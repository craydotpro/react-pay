import { createAppKit } from "@reown/appkit/react";
import { modal } from "@reown/appkit/react";

import { WagmiProvider } from "wagmi";
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
} from "@reown/appkit/networks";
import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import React from "react";
import { ENV } from "../env";

// 0. Setup queryClient

// 1. Get projectId from https://cloud.reown.com
const projectId = ENV.VITE_WALLET_KIT_PROJECT_ID!;
// 2. Create a metadata object - optional
const metadata = {
  name: "Cray pay",
  description: "Cray Pay Widget",
  url: "https://pay.cray.network", // origin must match your domain & subdomain
  icons: ["https://demo.cray.network/nft-preview.png"],
};

// 3. Set the networks
const networks = [
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  /** testnet */
  arbitrumSepolia,
  baseSepolia,
  optimismSepolia,
  polygonAmoy,
  sepolia,
] as any;

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  networks,
  projectId,
});
export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>{children}</WagmiProvider>
  );
}
export const AppKitProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  if (!modal) {
    // 5. Create modal, if not exists in parent app
    createAppKit({
      adapters: [wagmiAdapter],
      networks,
      projectId,
      metadata,
      // features: {
      //   analytics: true, // Optional - defaults to your Cloud configuration
      // },
    });
  }
  if (modal && modal?.options?.projectId !== projectId) {
    return children;
  } else {
    return <AppKitProvider>{children}</AppKitProvider>;
  }
};
