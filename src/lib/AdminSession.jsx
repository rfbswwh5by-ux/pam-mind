import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SIGNED_OUT_EVENT, callAdmin, readToken, writeToken } from "@/api/client";

const AdminSessionContext = createContext(null);

/**
 * Dashboard sign-in state using the site's own access-code system:
 * "loading" → checking, "setup" → no code yet (claim with ADMIN_SETUP_KEY),
 * "locked" → enter the access code, "unlocked" → dashboard open, "error" → server/database problem.
 */
export function AdminSessionProvider({ children }) {
  const qc = useQueryClient();
  const [status, setStatus] = useState("loading");
  const [loadError, setLoadError] = useState("");

  const check = useCallback(async () => {
    setLoadError("");
    setStatus("loading");
    try {
      if (readToken()) {
        const session = await callAdmin("session");
        if (session?.ok) return setStatus("unlocked");
        writeToken(null);
      }
      const state = await callAdmin("status");
      if (!state?.ok) {
        setLoadError(state?.error || "The dashboard could not reach the database.");
        return setStatus("error");
      }
      setStatus(state.claimed ? "locked" : "setup");
    } catch {
      setLoadError("The dashboard could not reach the server. Check your connection and try again.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    check();
    const onSignedOut = () => {
      qc.removeQueries({ queryKey: ["admin"] });
      setStatus("locked");
    };
    window.addEventListener(SIGNED_OUT_EVENT, onSignedOut);
    return () => window.removeEventListener(SIGNED_OUT_EVENT, onSignedOut);
  }, [check, qc]);

  const begin = useCallback((res) => {
    writeToken(res.token);
    setStatus("unlocked");
  }, []);

  const login = useCallback(async (code) => {
    const res = await callAdmin("login", { code });
    if (res?.ok) begin(res);
    else if (res?.code === "NEEDS_SETUP") setStatus("setup");
    return res;
  }, [begin]);

  const claim = useCallback(async (code, setupKey) => {
    const res = await callAdmin("claim", { code, setupKey });
    if (res?.ok) begin(res);
    else if (res?.code === "ALREADY_CLAIMED") setStatus("locked");
    return res;
  }, [begin]);

  const recover = useCallback((code, setupKey) => callAdmin("recover", { code, setupKey }), []);

  const logout = useCallback(async () => {
    if (readToken()) await callAdmin("logout").catch(() => null);
    writeToken(null);
    qc.removeQueries({ queryKey: ["admin"] });
    setStatus("locked");
  }, [qc]);

  const changeCode = useCallback((currentCode, newCode) => callAdmin("changeCode", { currentCode, newCode }), []);

  const value = useMemo(
    () => ({ status, loadError, login, claim, recover, logout, changeCode, retry: check }),
    [status, loadError, login, claim, recover, logout, changeCode, check]
  );
  return <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>;
}

export function useAdminSession() {
  const ctx = useContext(AdminSessionContext);
  if (!ctx) throw new Error("useAdminSession must be used inside <AdminSessionProvider>");
  return ctx;
}
