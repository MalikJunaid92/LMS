"use client";
import { useRouter } from "next/navigation";
import userAuth from "./userAuth";
import { useEffect } from "react";

interface ProtectedProps {
  children: React.ReactNode;
}

export default function Protected({ children }: ProtectedProps) {
  const isAutheniticated = userAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAutheniticated) router.replace("/");
  }, [isAutheniticated, router]);

  if (!isAutheniticated) return null;
  return <>{children}</>;
}
