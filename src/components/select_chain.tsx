import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { mainnet } from "viem/chains";
import { useBridgeStore } from "../store";
import { useActiveChains } from "../hooks/use_active_chains";

const SelectChain = () => {
  const [open, setOpen] = useState(false);
  const { destinationChain } = useBridgeStore();
  const CHAINS = useActiveChains();
  const chains = useMemo(() => {
    if (!CHAINS?.length) return [];
    return Object.values(CHAINS);
  }, [CHAINS]);
  useEffect(() => {
    if (!chains?.length) return;
    useBridgeStore.setState(() => ({ destinationChain: chains?.[0] }));
  }, [chains]);
  const handleSelect = (chain: typeof mainnet) => {
    useBridgeStore.setState(() => ({ destinationChain: chain }));
  };

  return (
    <button
      onClick={() => setOpen(!open)}
      className="p-1 pr-2 rounded-full border border-[#EAECF0] bg-white flex items-center gap-2 shrink-0 relative w-48 justify-between px-4"
    >
      <span className="cray-label-md text-slate-600 font-medium">
        {destinationChain?.name}
      </span>
      <ChevronDown />
      {open ? (
        <div
          onClick={(e) => e.stopPropagation}
          className="absolute w-full shadow-lg bg-white bottom-[calc(100%+4px)] rounded-md border left-0 flex flex-col items-start z-10"
        >
          {chains.map((chain: any) => (
            <button
              onClick={() => handleSelect(chain)}
              className="px-2 py-1 hover:bg-gray-50 w-full text-left"
            >
              {chain.name}
            </button>
          ))}
        </div>
      ) : null}
    </button>
  );
};
export default SelectChain;
