import { QueryClient } from "@tanstack/react-query";

export enum AUTHENTICATION_STATE {
  AUTHENTICATED = "AUTHENTICATED",
  UNAUTHENTICATED = "UNAUTHENTICATED",
}
export const queryClient = new QueryClient();
