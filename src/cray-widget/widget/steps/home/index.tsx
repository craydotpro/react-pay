import { useQuery } from "@tanstack/react-query";
import AmountBreakdown from "./amount_breakdown";
import { useAppKitAccount } from "@reown/appkit/react";
import { useContext, useEffect, useMemo } from "react";
import { formatUnits, isAddress } from "viem";
import { useAppStore } from "@/cray-widget/store";
import { Button } from "@/components/ui/button";
import { balanceService } from "@/cray-widget/services/balance";
import { ITokens } from "@/interfaces";
import { StepContext } from "@/components/stepper";

const Home = () => {
  const stepperContext = useContext(StepContext);

  const { address } = useAppKitAccount();
  const payload = useAppStore(state => state.payload);
  const setUserTokens = useAppStore(state => state.setUserTokens);
  const orderAllocation = useAppStore(state => state.orderAllocation);
  //   const {
  //     testnet,
  //     setUserTokens,
  //     amount,
  //     orderAllocation,
  //     destinationAddress,
  //   } = useBridgeStore();
  const userTokens = useQuery({
    queryKey: ["user_balance", payload.testnet],
    queryFn: () => balanceService.GetAll(address!),
    enabled: !!address,
  });
  useEffect(() => {
    if (!userTokens.data) return;
    setUserTokens(userTokens.data);
  }, [userTokens.data]);
  const allocatedBalance = (orderAllocation || [])?.reduce(
    (a: number, b: ITokens) =>
      a + parseFloat(formatUnits(BigInt(b.balance), b.decimals)),
    0
  );
  const isEnoughBalance = parseFloat(payload.amount!) <= allocatedBalance;
  const isValidToAddress = useMemo(
    () => isAddress(payload.destinationAddress),
    [payload.destinationAddress]
  );
  return (
    <div className="">
      <div className=" bg-[#F8F9FC] flex flex-col items-center justify-center gap-5 pt-6 pb-9">
        <span className="text-[#667085] font-medium cray-label-md">
          Request Amount
        </span>
        <h3 className="cray-h3">${payload?.amount}</h3>
      </div>
      <AmountBreakdown />
      <div className="pt-5 flex justify-center w-full">
        <Button
          onClick={() => stepperContext.next()}
          disabled={
            !isEnoughBalance || !isValidToAddress || !orderAllocation?.length
          }
        >
          Continue to Send
        </Button>
      </div>
    </div>
  );
};
export default Home;
