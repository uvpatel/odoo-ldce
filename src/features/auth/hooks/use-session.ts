"use client";

import { authClient } from "@/lib/auth-client";

export function useSession() {
  const session = authClient.useSession();
  return session;
}
