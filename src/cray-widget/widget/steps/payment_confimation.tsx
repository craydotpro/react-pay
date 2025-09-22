import { ArrowLeft, Banknote, Hourglass, Wallet } from "lucide-react";
// import { useBridgeStore } from "../store";
// import { prettifyAddress } from "../lib/utils";
import { useAppKitAccount } from "@reown/appkit/react";
// import { Button } from "../components/ui/button";
// import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { prettifyAddress } from "../../../utils";
import { Button } from "../../../components/ui/button";
import { paymentService } from "../../../cray-widget/services/payment";
import { useAppStore } from "../../../cray-widget/store";
import { useContext } from "react";
import { StepContext } from "../../../components/stepper";

const PaymentConfirmation = () => {
  const stepperContext = useContext(StepContext);

  const { amount, destinationChain, destinationAddress } = useAppStore(
    (state) => state.payload
  );
  const orderAllocation = useAppStore((state) => state.orderAllocation);
  const { address } = useAppKitAccount();
  const handleSend = useMutation({
    mutationFn: async () => {
      const order = await paymentService.CreateOrder({
        receiverAddress: destinationAddress,
        destinationChain: destinationChain?.id!,
        amount: amount,
        orderType: "dapp",
        senderAddress: address!,
        sourceTokens: orderAllocation?.map(({ tokenAddress, chainId }) => ({
          address: tokenAddress,
          chainId,
        })),
      });
      useAppStore.setState({
        orderId: order.orderId,
        order,
        status: order.status,
        stage: order.stage,
      });
      stepperContext.next();
      // navigate("/wait-for-confirmation");
    },
  });
  return (
    <div className="h-full bg-re">
      <button
        onClick={() => stepperContext.prev()}
        className="w-auto rounded-full border-0 absolute left-4 top-4"
      >
        <ArrowLeft width={24} />
      </button>
      <div className="h-1/3 bg-[#F8F9FC] flex flex-col items-center justify-center gap-5 pt-6 pb-9">
        <span className="text-[#667085] font-medium cray-label-md">
          Payment Amount
        </span>
        <h3 className="text-3xl font-bold">${amount}</h3>
      </div>
      <div className="p-5 flex flex-col gap-5">
        <div className="flex flex-col divide-y divide-[#F2F4F7] font-medium cray-label-md">
          <div className="py-[14px] flex justify-between">
            <span className="flex items-center gap-[6px] text-slate-500 ">
              <Hourglass width={16} /> Estimated Time
            </span>
            <span className=" cray-label-md font-bold">~15sec</span>
          </div>
          <div className="py-[14px] flex justify-between">
            <span className="flex items-center gap-[6px] text-slate-500">
              <Banknote width={16} /> Platform Fee
            </span>
            <span className=" cray-label-md font-bold">Free</span>
          </div>
          <div className="py-[14px] flex justify-between">
            <span className="flex items-center gap-[6px] text-slate-500">
              <Wallet width={16} /> Wallet Info
            </span>
            <span className=" cray-label-md font-bold">
              {prettifyAddress(address)}
            </span>
          </div>
        </div>
        <div className="flex w-full justify-center">
          <Button
            isLoading={handleSend.isPending}
            onClick={() => handleSend.mutate()}
          >
            Confirm and Pay
          </Button>
        </div>
      </div>
    </div>
  );
};
export default PaymentConfirmation;
