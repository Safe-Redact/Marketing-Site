"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  SupportChatLauncher,
  type SupportChatStatus,
} from "@/components/support/SupportChatLauncher";
import { chatwootLoader } from "@/lib/support/chatwoot-loader";
import type { ChatwootPublicConfig } from "@/lib/support/chatwoot-config";

const loadingTimeoutMs = 12_000;
const staffPaths = ["/admin", "/moderation"];

interface SupportChatProps {
  config: ChatwootPublicConfig;
  fallbackEmail: string;
}

export function SupportChat({ config, fallbackEmail }: SupportChatProps) {
  const pathname = usePathname();
  const [status, setStatus] = useState<SupportChatStatus>("idle");
  const timeoutRef = useRef<number | null>(null);
  const hidden = staffPaths.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  const clearLoadingTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    const onReady = () => {
      clearLoadingTimeout();
      setStatus("ready");
      window.$chatwoot?.toggle("open");
    };
    const onError = () => {
      clearLoadingTimeout();
      setStatus("error");
    };

    window.addEventListener("chatwoot:ready", onReady);
    window.addEventListener("chatwoot:error", onError);
    return () => {
      clearLoadingTimeout();
      window.removeEventListener("chatwoot:ready", onReady);
      window.removeEventListener("chatwoot:error", onError);
    };
  }, [clearLoadingTimeout]);

  useEffect(() => {
    if (hidden && status === "ready") window.$chatwoot?.toggle("close");
  }, [hidden, status]);

  const activate = useCallback(() => {
    if (status === "ready") {
      window.$chatwoot?.toggle("open");
      return;
    }
    if (status === "loading") return;

    setStatus("loading");
    timeoutRef.current = window.setTimeout(() => setStatus("error"), loadingTimeoutMs);
    chatwootLoader
      ?.load(config.baseUrl, config.websiteToken)
      .catch(() => {
        clearLoadingTimeout();
        setStatus("error");
      });
  }, [clearLoadingTimeout, config.baseUrl, config.websiteToken, status]);

  if (hidden) return null;

  return (
    <SupportChatLauncher
      status={status}
      onActivate={activate}
      fallbackEmail={fallbackEmail}
    />
  );
}
