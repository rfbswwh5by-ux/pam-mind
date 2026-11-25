import { handleApi } from "../server/api.js";

export function GET(request) {
  return handleApi(request);
}

export function POST(request) {
  return handleApi(request);
}
