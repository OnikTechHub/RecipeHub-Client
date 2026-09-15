"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChefsRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/browse-recipes");
  }, [router]);

  return null;
}
