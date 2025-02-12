"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
console.log(isAuthenticated);
    if (isAuthenticated) {
      router.replace("/dashboard"); // Redirect to dashboard if logged in
    } else {
      router.replace("/login"); // Otherwise, go to login page
    }
  }, [router]);

  return null; // Don't render anything, just handle redirection
}