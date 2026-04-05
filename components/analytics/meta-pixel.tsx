"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pixel } from "@/lib/pixel";

// Fires PageView on every route change (Next.js App Router soft navigations)
export function MetaPixelPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    pixel.pageView();
  }, [pathname, searchParams]);

  return null;
}
