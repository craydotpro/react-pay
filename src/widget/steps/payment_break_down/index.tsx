import { IAccountBalance, ISpendBalance, IToken } from "../../../interface";
import Button from "../../../ui/button";
import Chip from "../../../ui/chip";
import { StepContext } from "../../../ui/stepper";
import { _sleep, prettifyAddress } from "../../../utils";
import { useAppKitAccount } from "@reown/appkit/react";
import { useContext, useEffect, useState } from "react";
import SelectTokens from "./select_tokens";
import { formatUnits } from "viem";
import { Wallet03 } from "@untitled-ui/icons-react";
import { payWidgetService } from "../../../services";
import { CrayContext } from "../../../providers";
import { Loading } from "../../../ui/loading";

const PaymentBreakdown = () => {
  const [loading, setLoading] = useState(false);
  const {
    state: {
      order,
      payload,
      userBalance,
      selectedBalances,
      orderAllocation,
      testnet,
      apiKey,
    },
    setState,
  } = useContext(CrayContext);
  const [showSelectTokens, setShowSelectTokens] = useState(false);
  const stepperContext = useContext(StepContext);
  const { address } = useAppKitAccount();
  useEffect(() => {
    let active = true;
    if (!userBalance) return;
    /** if no balance is selected then selectedBalance will be all the tokens user has */
    const selectedBalancesHash = (selectedBalances || userBalance)?.map(
      (balance: IToken) => balance.chainId + balance.tokenAddress
    );
    const allowedBalance = userBalance.filter((balance: IToken) =>
      selectedBalancesHash.includes(balance.chainId + balance.tokenAddress)
    );

    const fetchAllocation = async () => {
      setLoading(true);
      const allocation = await payWidgetService.GetAllocation({
        balances: allowedBalance,
        amount: order?.amount!,
        destinationChain: payload?.destinationChain!,
        testnet,
        address: address!,
      });
      setLoading(false);

      if (active) {
        setState((states) => ({
          ...states,
          orderAllocation: (allocation as any) || [],
        }));
      }
    };
    fetchAllocation();
    return () => {
      active = false;
    };
  }, [userBalance, selectedBalances, address]);
  const allocationBalance = (orderAllocation || [])?.reduce(
    (a: number, b: IAccountBalance) =>
      a + parseFloat(formatUnits(BigInt(b.balance), b.decimals)),
    0
  );
  const isEnoughBalance = parseFloat(order?.amount!) <= allocationBalance;
  return (
    <div className="h-full">
      {loading ? (
        <div className="absolute flex items-center justify-center w-full h-full bg-white z-10">
          <Loading size="64" className="fill-[#FA6800]" />
        </div>
      ) : null}
      <div className=" bg-[#F8F9FC] flex flex-col items-center justify-center gap-5 pt-6 pb-9">
        <span className="text-[#667085] font-medium cray-label-md">
          Request Amount
        </span>
        <h3 className="cray-h3">${order?.amount}</h3>
      </div>
      <div className="p-5 flex flex-col">
        <div className="bg-[#F8F9FC]  rounded-[12px] border border-slate-200">
          <div className="flex justify-between text-[#667085] cray-label-md border-b py-3 px-4">
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
              className="m-1 py-1 px-[10px] cray-label-md bg-primary rounded-[16px] cursor-pointer bg-black text-white"
            >
              Edit Token
            </button>
          </div>
        </div>
        <p className="cray-label-md mt-[14px]">
          <span className="font-bold">NOTE:</span> Cray finds the best way to
          pay — but you're in control. Edit to pick other tokens.
        </p>
        <div
          className={` border-error bg-red-50 rounded-[8px] text-center mt-5 text-error cray-label-md font-medium transition-all duration-200 ${
            isEnoughBalance || !userBalance
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
