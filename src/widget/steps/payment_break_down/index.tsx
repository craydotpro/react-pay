import { IAccountBalance, ISpendBalance, IToken } from "../../../interface";
import Button from "../../../ui/button";
import Chip from "../../../ui/chip";
import { StepContext } from "../../../ui/stepper";
import { _sleep, calculateAllocation, prettifyAddress } from "../../../utils";
import { useAppKitAccount } from "@reown/appkit/react";
import { useContext, useEffect, useState } from "react";
import SelectTokens from "./select_tokens";
import { formatUnits } from "viem";
import { Wallet03 } from "@untitled-ui/icons-react";
import { useQuery } from "@tanstack/react-query";
import { payWidgetService } from "../../../services";
import { CrayContext } from "../../../providers";

const PaymentBreakdown = () => {
  const {
    state: { order, payload, userBalance, selectedBalances, orderAllocation },
    setState,
  } = useContext(CrayContext);
  const [showSelectTokens, setShowSelectTokens] = useState(false);
  const stepperContext = useContext(StepContext);
  const allocationOrder = useQuery({
    queryKey: ["allocatoin_order"],
    queryFn: () => payWidgetService.GetAllocationOrder(),
  });
  useEffect(() => {
    if (selectedBalances) return;
    // setState(states=>({...states, selectedBalances:[...userBalance]}))
  }, []);
  useEffect(() => {
    if (!userBalance || !allocationOrder.data) return;
    /** if no balance is selected then selectedBalance will be all the tokens user has */
    const selectedBalance = (selectedBalances || userBalance)?.map(
      (balance: IToken) => balance.chainId + balance.tokenAddress
    );
    const allowedBalance = userBalance.filter((balance: IToken) =>
      selectedBalance.includes(balance.chainId + balance.tokenAddress)
    );

    const allocation = calculateAllocation({
      balances: allowedBalance,
      amount: order?.amount!,
      toChainId: payload?.destinationChain!,
      chainAllocationOrder: allocationOrder.data,
    });
    setState((states) => ({
      ...states,
      orderAllocation: (allocation as any) || [],
    }));
  }, [userBalance, selectedBalances, allocationOrder.data]);
  const { address } = useAppKitAccount();
  const allocationBalance = (orderAllocation || [])?.reduce(
    (a: number, b: IAccountBalance) =>
      a + parseFloat(formatUnits(BigInt(b.balance), b.decimals)),
    0
  );
  const isEnoughBalance = parseFloat(order?.amount!) <= allocationBalance;
  const isLoading = !userBalance || !allocationOrder.data;
  return (
    <div className="h-full">
      <div className=" bg-[#F8F9FC] flex flex-col items-center justify-center gap-5 pt-6 pb-9">
        <span className="text-[#667085] font-medium label-md">
          Request Amount
        </span>
        <h3>${order?.amount}</h3>
      </div>
      <div className="p-5 flex flex-col">
        <div className="bg-[#F8F9FC]  rounded-[12px] border border-slate-200">
          <div className="flex justify-between text-[#667085] label-md border-b py-3 px-4">
            <span>Token Breakdown</span>
            <span className="flex items-center gap-[6px]">
              <Wallet03 width={16} className=" text-slate-500" />
              {prettifyAddress(address)}
            </span>
          </div>
          <div className="flex flex-wrap py-3 px-4 gap-2">
            {orderAllocation?.map((allocation: ISpendBalance) => (
              <Chip chain={allocation.chainId} token={allocation} />
            ))}
            <button
              onClick={() => setShowSelectTokens(!showSelectTokens)}
              className="m-1 py-1 px-[10px] label-md bg-primary text-secondary rounded-[16px] cursor-pointer"
            >
              Edit Token
            </button>
          </div>
        </div>
        <span className="label-md mt-[14px]">
          NOTE: Add note here Add note here Add note here Add note here Add note
          here Add note here Add note here
        </span>
        <div
          className={` border-error bg-red-50 rounded-[8px] text-center mt-5 text-error label-md font-medium transition-all duration-200 ${
            isEnoughBalance || isLoading
              ? "h-0 overflow-hidden p-0"
              : "max-h-[100px] p-3 border "
          }`}
        >
          Insufficient funds.
        </div>
        <div className="py-5">
          <Button
            disabled={!isEnoughBalance}
            onClick={() => stepperContext.next()}
          >
            Continue Payment
          </Button>
        </div>
      </div>
      <SelectTokens
        showSelectTokens={showSelectTokens}
        setShowSelectTokens={setShowSelectTokens}
        isEnoughBalance={isEnoughBalance}
      />
    </div>
  );
};
export default PaymentBreakdown;
