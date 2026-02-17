// components/DeviceIDProvider.tsx
"use client";

import { useEffect } from "react";

export default function DeviceIDProvider() {
  useEffect(() => {
    const existing = localStorage.getItem("X-Device-ID");
    if (!existing) {
      const newID = crypto.randomUUID(); // أو nanoid()
      localStorage.setItem("X-Device-ID", newID);
    }
  }, []);

  return null;
}
