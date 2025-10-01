import { Wallet2 } from "lucide-react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useEffect, useState } from "react";
import type { IOrderAllocation, ITokens } from "../../../../interfaces";
import { isValidNumber, prettifyAddress } from "../../../../utils";
import TokensSelector from "../../../../components/tokens_selector";
import { useDebounce } from "use-debounce";
import { formatUnits } from "viem";
import { CopyButton } from "../../../../components/ui/copy_button";
import { useAppStore } from "../../../../cray-widget/store";
import { Loading } from "../../../../components/ui/loading";
import BalanceChip from "../../../../components/ui/balance_chip";
import { balanceService } from "../../../../cray-widget/services/balance";

const AmountBreakdown = () => {
  const [fetchingAllocation, setFetchingAllocation] = useState(false);
  const [showSelectTokens, setShowSelectTokens] = useState(false);
  const { address } = useAppKitAccount();
  const payload = useAppStore((state) => state.payload);
  const userTokens = useAppStore((state) => state.userTokens);
  const selectedTokens = useAppStore((state) => state.selectedTokens);
  const orderAllocation = useAppStore((state) => state.orderAllocation);

  // const {
  //   amount,
  //   orderAllocation,
  //   destinationChain,
  //   userTokens,
  //   selectedTokens,
  // } = useBridgeStore();
  // const [debouncedAmount] = useDebounce(payload.amount, 1000);
  const debouncedAmount = payload.amount;
  useEffect(() => {
    let active = true;
    useAppStore.setState(() => ({ orderAllocation: null }));
    if (!isValidNumber(debouncedAmount)) return;
    (async () => {
      setFetchingAllocation(true);
      const allocation = await balanceService.GetTokenAllocation({
        address: address!,
        amount: debouncedAmount,
        destinationChain: payload.destinationChain?.id!,
        tokens: userTokens.filter(
          (_) => selectedTokens?.[_.chainId + _.tokenAddress]
        ),
      });
      if (active) {
        useAppStore.setState(() => ({ orderAllocation: allocation }));
        setFetchingAllocation(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [debouncedAmount, selectedTokens, payload.destinationChain.id]);
  const allocatedBalance = (orderAllocation || [])?.reduce(
    (a: number, b: ITokens) =>
      a + parseFloat(formatUnits(BigInt(b.balance), b.decimals)),
    0
  );
  const isEnoughBalance = parseFloat(payload.amount!) <= allocatedBalance;
  const loading = fetchingAllocation || payload.amount !== debouncedAmount;
  return (
    <div className="p-4">
      <div className="bg-[#F8F9FC]  rounded-[12px] border border-slate-200">
        <div className="flex justify-between text-[#667085] cray-label-md  py-3 px-4">
          <span>Paying with</span>
          <span className="flex items-center gap-[6px]">
            <Wallet2 width={16} className=" text-slate-500" />
            {prettifyAddress(address)}
            <CopyButton value={address!} />
          </span>
        </div>

        {Number(payload.amount) ? (
          <div className="flex flex-wrap items-center py-3 px-4 gap-2 border-t border-gray-200">
            {loading || payload.amount !== debouncedAmount ? (
              <Loading size="24" className="fill-[#FA6800] animate-spin-slow" />
            ) : (
              orderAllocation?.map((allocation: IOrderAllocation) => (
                <BalanceChip
                  key={allocation.chainId + allocation.tokenAddress}
                  chain={allocation.chainId}
                  token={allocation}
                />
              ))
            )}

            <button
              onClick={() => setShowSelectTokens(!showSelectTokens)}
              className="m-1 py-1 px-[10px] cray-label-md  rounded-[16px] cursor-pointer bg-black text-white"
            >
              Edit Token
            </button>
          </div>
        ) : null}
      </div>
      {Number(payload.amount) ? (
        <p className="cray-label-md mt-[14px]">
          <span className="font-bold">NOTE:</span> Cray finds the best way to
          send — you're in control. Edit to pick other tokens if needed.
        </p>
      ) : null}
      <div
        className={` border-error bg-red-50 rounded-[8px] text-center mt-5 text-error cray-label-md font-medium transition-all duration-200 ${
          isEnoughBalance || loading || !payload.amount
            ? "h-0 overflow-hidden p-0"
            : "max-h-[100px] p-3 border "
        }`}
      >
        Insufficient funds.
      </div>
      <TokensSelector
        isEnable={showSelectTokens}
        setEnable={setShowSelectTokens}
      />
    </div>
  );
};
export default AmountBreakdown;
