"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import IsLoading from "@/components/IsLoading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = true,
  redirectTo = "/",
}) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
console.log(isAuthenticated,isAdmin)
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    if (adminOnly && !isAdmin) {
      router.replace("/");
    }
  }, [isAuthenticated, isAdmin, isLoading, adminOnly, redirectTo, router]);

  if (isLoading) {
    return <IsLoading />;
  }

  if (!isAuthenticated) return null;
  if (adminOnly && !isAdmin) return null;

  return <>{children}</>;
};
