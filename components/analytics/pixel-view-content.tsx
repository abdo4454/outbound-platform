"use client";

import { useEffect } from "react";
import { pixel } from "@/lib/pixel";

export function PixelViewContent({
  contentName,
  contentCategory,
}: {
  contentName: string;
  contentCategory?: string;
}) {
  useEffect(() => {
    pixel.viewContent({ content_name: contentName, content_category: contentCategory });
  }, [contentName, contentCategory]);

  return null;
}
