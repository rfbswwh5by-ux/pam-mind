import * as React from "react"
import { cn } from "@/lib/utils"

// Shown when an image has no link yet, or its link is broken.
const PLACEHOLDER =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#EDE8F2"/><path d="M150 190l40-50 30 36 20-24 40 38z" fill="#C9BFD8"/><circle cx="250" cy="115" r="16" fill="#C9BFD8"/></svg>'
  )

/**
 * A plain <img> for the site's photos. `fittingType="fit"` shows the whole
 * image (letterboxed); the default "fill" crops it to cover its box.
 * A missing or broken link shows a soft placeholder instead of a broken icon.
 */
const Image = React.forwardRef(({ src, fittingType = "fill", onError, className, style, ...props }, ref) => {
  const [failed, setFailed] = React.useState(false)
  React.useEffect(() => setFailed(false), [src])
  const shown = !src || failed ? PLACEHOLDER : src
  return (
    <img
      ref={ref}
      src={shown}
      className={className}
      style={{ objectFit: fittingType === "fit" ? "contain" : "cover", ...style }}
      onError={(event) => {
        if (!failed && src) {
          setFailed(true)
          onError?.(event)
        }
      }}
      {...(!src ? { "data-empty-image": "" } : {})}
      {...props}
    />
  )
})
Image.displayName = "Image"

export { Image }
