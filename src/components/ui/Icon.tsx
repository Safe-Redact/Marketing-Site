import type { ReactElement } from "react";
import { cn } from "@/lib/utils";

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

const icons: Record<string, ReactElement> = {
  "shield-check": (
    <>
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  users: (
    <path
      d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  lock: (
    <>
      <rect
        x="3"
        y="11"
        width="18"
        height="11"
        rx="2"
        ry="2"
        strokeWidth="1.5"
      />
      <path
        d="M7 11V7a5 5 0 0 1 10 0v4"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  "check-circle": (
    <>
      <path
        d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="22 4 12 14.01 9 11.01"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  video: (
    <path
      d="M23 7l-7 5 7 5V7z M14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  audio: (
    <>
      <path
        d="M9 18V5l12-2v13"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="18" r="3" strokeWidth="1.5" />
      <circle cx="18" cy="16" r="3" strokeWidth="1.5" />
    </>
  ),
  document: (
    <>
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="14 2 14 8 20 8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="16"
        y1="13"
        x2="8"
        y2="13"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="17"
        x2="8"
        y2="17"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <polyline
        points="10 9 9 9 8 9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  scale: (
    <path
      d="M12 3v18M3 7l3-4 3 4M15 7l3-4 3 4M6 7v6a6 6 0 0 0 12 0V7"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  heart: (
    <path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  building: (
    <>
      <rect
        x="4"
        y="2"
        width="16"
        height="20"
        rx="2"
        ry="2"
        strokeWidth="1.5"
      />
      <path
        d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  landmark: (
    <>
      <line
        x1="3"
        y1="22"
        x2="21"
        y2="22"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="6"
        y1="18"
        x2="6"
        y2="11"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="10"
        y1="18"
        x2="10"
        y2="11"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="18"
        x2="14"
        y2="11"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="18"
        y1="18"
        x2="18"
        y2="11"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <polygon
        points="12 2 20 7 4 7"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  briefcase: (
    <>
      <rect
        x="2"
        y="7"
        width="20"
        height="14"
        rx="2"
        ry="2"
        strokeWidth="1.5"
      />
      <path
        d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" strokeWidth="1.5" />
      <line
        x1="21"
        y1="21"
        x2="16.65"
        y2="16.65"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </>
  ),
  layers: (
    <path
      d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  brain: (
    <path
      d="M9.5 2A5.5 5.5 0 0 0 4 7.5c0 1.58.67 3 1.73 4.01L12 18l6.27-6.49A5.49 5.49 0 0 0 20 7.5 5.5 5.5 0 0 0 14.5 2c-1.27 0-2.42.47-3.3 1.24A5.47 5.47 0 0 0 9.5 2z"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "file-text": (
    <>
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="14 2 14 8 20 8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="16"
        y1="13"
        x2="8"
        y2="13"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="17"
        x2="8"
        y2="17"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
      <polyline
        points="12 6 12 12 16 14"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  arrow: (
    <path
      d="M5 12h14M12 5l7 7-7 7"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "arrow-down": (
    <path
      d="M12 5v14M19 12l-7 7-7-7"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  menu: (
    <>
      <line x1="3" y1="6" x2="21" y2="6" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3" y1="12" x2="21" y2="12" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3" y1="18" x2="21" y2="18" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  close: (
    <>
      <line x1="18" y1="6" x2="6" y2="18" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="6" x2="18" y2="18" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  "chevron-down": (
    <path
      d="M6 9l6 6 6-6"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "external-link": (
    <>
      <path
        d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="15 3 21 3 21 9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="10"
        y1="14"
        x2="21"
        y2="3"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </>
  ),
  download: (
    <>
      <path
        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="7 10 12 15 17 10"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="12"
        y1="15"
        x2="12"
        y2="3"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </>
  ),
  upload: (
    <>
      <path
        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="17 8 12 3 7 8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="12"
        y1="3"
        x2="12"
        y2="15"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </>
  ),
  send: (
    <path
      d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
      <line x1="12" y1="11" x2="12" y2="17" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="7.5" r="0.75" fill="currentColor" stroke="none" />
    </>
  ),
};

export function Icon({ name, className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {icons[name] || null}
    </svg>
  );
}
