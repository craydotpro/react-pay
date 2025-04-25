import { CHAINS } from "../../constants";
import { useTokens } from "../../hooks/use_tokens";
import { CrayContext } from "../../providers";
import { IPaymentStatus } from "../../types";
import Button from "../../ui/button";
import Chip from "../../ui/chip";
import Coins from "../../ui/coins";
import Footer from "../../ui/footer";
import SuccessIcon from "../../ui/success_icon";
import { ChevronDown } from "@untitled-ui/icons-react";
import { useContext, useMemo, useState } from "react";

const PaymentSuccess = () => {
  const {
    state: { order },
    setState,
  } = useContext(CrayContext);
  const [expandReceivedTokens, setExpandReceivedTokens] = useState(false);
  const tokens = useTokens();
  const outputOrder = order?.subOrders?.find(
    (order: any) => order.type === "OUTPUT"
  );
  const outputChain = CHAINS[outputOrder.sourceChain];
  const destinationToken =
    tokens?.[order?.destinationChain!]?.[order?.destinationToken!] || {};
  const inputOrders = useMemo(
    () => JSON.parse(order?.orderData!).inputs,
    [order?.orderData]
  );
  const handleClose = () => {
    setState((states) => ({ ...states, status: IPaymentStatus.idle }));
  };
  return (
    <div className=" flex flex-col h-full">
      <div className="h-full">
        <div className=" bg-[#F8F9FC] flex flex-col items-center justify-center gap-5 pt-6 pb-9">
          <SuccessIcon />
          <h6 className=" cray-h6">
            ${order?.amount} USDC Payment Successfully
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
              Received
              {inputOrders.length === 1 ? (
                <span>
                  {
                    tokens?.[inputOrders[0]?.chainId]?.[inputOrders[0]?.token]
                      ?.symbol
                  }
                </span>
              ) : (
                <Coins
                  tokens={inputOrders.map(
                    (order: Record<string, string>) =>
                      tokens?.[order.chainId]?.[order.token]
                  )}
                />
              )}
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
            {inputOrders.map((order: Record<string, any>) => (
              <Chip
                key={order.chainId + order.token}
                token={tokens?.[order.chainId]?.[order.token]}
                chain={order.chainId}
              />
            ))}
          </div>
          <div className="flex items-center gap-[10px]">
            <SuccessIcon size="20" className="z-[1]" />
            <span className="cray-label-lg text-slate-500">
              Paid in {outputChain.name} {destinationToken.symbol}
            </span>
          </div>
        </div>
        <div className="px-5 pb-5">
          <Button onClick={handleClose}>Close</Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default PaymentSuccess;
