import { useState } from "react";
import type { IOrderAllocation } from "../../../interfaces";
import { ChevronDown } from "lucide-react";
import { useAppStore } from "../../../cray-widget/store";
import Coins from "../../../components/ui/coins";
import BalanceChip from "../../../components/ui/balance_chip";
import { Button } from "../../../components/ui/button";
import SuccessIcon from "../../../components/ui/success_icon";
const PaymentSuccess = () => {
  const [expandReceivedTokens, setExpandReceivedTokens] = useState(true);

  const order = useAppStore((state) => state.order);
  const orderAllocation = useAppStore((state) => state.orderAllocation);
  const { destinationChain } = useAppStore((state) => state.payload);
  const reset = useAppStore((state) => state.reset);
  return (
    <div className=" flex flex-col h-full">
      <div className="h-full">
        <div className=" bg-[#F8F9FC] flex flex-col items-center justify-center gap-5 pt-6 pb-9">
          <SuccessIcon />
          <h6 className=" font-bold md:text-2xl">
            ${order?.amount} USDC Payment Successful.
          </h6>
        </div>
        <div className="p-5 flex flex-col gap-[26px] relative">
          <div className="absolute top-1/2 -translate-y-1/2 w-[2px] h-[calc(100%-50px)] bg-[#1DAF61] left-[29px] z-[0]"></div>
          <button
            onClick={() => setExpandReceivedTokens(!expandReceivedTokens)}
            className="flex items-center gap-[10px] cursor-pointer"
          >
            <SuccessIcon size="20" className="z-[1]" />
            <span className="cray-label-lg text-slate-500 flex items-center gap-1">
              Paid with
              <Coins tokens={orderAllocation!} />
              <ChevronDown
                width={20}
                className={`  transition-all duration-200 ${
                  expandReceivedTokens ? "-rotate-180" : ""
                }`}
              />
            </span>
          </button>
          <div
            className={`w-full flex flex-wrap gap-2 pl-7 overflow-hidden transition-all duration-200 ${
              expandReceivedTokens ? "max-h-[80px]" : "max-h-0"
            }`}
          >
            {orderAllocation?.map((token: IOrderAllocation) => (
              <BalanceChip
                key={`${token.chainId}${token.tokenAddress}`}
                token={token}
                chain={token.chainId}
              />
            ))}
          </div>
          <div className="flex items-center gap-[10px]">
            <SuccessIcon size="20" className="z-[1]" />
            <span className="cray-label-lg text-slate-500">
              Received {destinationChain?.name}
            </span>
          </div>
        </div>
        <div className="px-5 pb-5 flex items-center justify-center">
          <Button onClick={() => reset}>Close</Button>
        </div>
      </div>
    </div>
  );
};
export default PaymentSuccess;
