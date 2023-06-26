"use client";

import React from "react";
import { SWRConfig } from "swr";

export function ClientSwrConfig({
  fallback = {},
  children,
}: {
  fallback?: Record<string, any>;
} & React.PropsWithChildren) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnMount: false,
        revalidateOnReconnect: false,
        refreshWhenOffline: false,
        refreshWhenHidden: false,
        refreshInterval: 0,
        fallback,
      }}
    >
      {children}
    </SWRConfig>
  );
}
