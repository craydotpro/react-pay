import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  polygon,
  polygonAmoy,
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
  80_002: polygonAmoy,
  8453: base,
  42_161: arbitrum,
  1: mainnet,
  10: optimism,
  137: polygon,
} as any;
