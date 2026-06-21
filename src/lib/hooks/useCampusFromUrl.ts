"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function useCampusFromUrl(
  setCampus: (campus: string) => void
) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const campusParam = searchParams.get("campus");
    if (campusParam) {
      setCampus(campusParam);
    }
  }, [searchParams, setCampus]);
}
