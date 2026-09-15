"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StandaloneAIRecipeGeneratorRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/ai-recipe-generator");
  }, [router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <div className="loading loading-spinner loading-lg text-primary"></div>
      <p className="text-xs font-semibold opacity-70">Redirecting to Dashboard AI Generator...</p>
    </div>
  );
}
