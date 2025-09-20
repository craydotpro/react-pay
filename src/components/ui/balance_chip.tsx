import type { IOrderAllocation } from "@/interfaces";
import { SHOW } from "@/utils";

import { formatUnits } from "viem";

const BalanceChip = ({
  chain,
  token,
}: {
  chain: number;
  token: IOrderAllocation;
}) => {
  return (
    <div className="p-1 pr-2 rounded-full border border-[#EAECF0] bg-white flex items-center gap-2 shrink-0">
      <div className="relative">
        <img src={`/chains/${chain}.svg`} className="w-6 h-6" />
        <img
          src={token?.icon}
          className="w-[14px] h-[14px] absolute left-[13px] top-[13px]"
        />
      </div>
      <span className="cray-label-md text-slate-600 font-medium">
        {token?.symbol}
      </span>
      <span
        {...SHOW(!!token?.spend)}
        className="cray-label-md text-[#0E121B] border-slate-300 border-l pl-[10px]"
      >
        ${formatUnits(BigInt(token?.spend || 0), token?.decimals || 0)}
      </span>
    </div>
  );
};
export default BalanceChip;
