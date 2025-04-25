import {
  arbitrumSepolia,
  baseSepolia,
  optimismSepolia,
  sepolia,
} from "viem/chains";
import { QueryClient } from "@tanstack/react-query";

export enum AUTHENTICATION_STATE {
  AUTHENTICATED = "AUTHENTICATED",
  UNAUTHENTICATED = "UNAUTHENTICATED",
}
export const queryClient = new QueryClient();
export const CHAINS = {
  84532: baseSepolia,
  11_155_111: sepolia,
  421_614: arbitrumSepolia,
  11155420: optimismSepolia,
} as any;
