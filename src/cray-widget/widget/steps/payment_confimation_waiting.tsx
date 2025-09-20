import { useEffect } from "react";
// import { paymentService } from "../services/payment";
// import { useBridgeStore } from "../store";
import { OrderStage, OrderStatus } from "@/interfaces";
import { useAppKitNetwork } from "@reown/appkit/react";
import { useSignTypedData } from "wagmi";
// import PaymentSuccess from "./payment_success";
import { paymentService } from "@/cray-widget/services/payment";
import { useAppStore } from "@/cray-widget/store";
import { signOrder } from "@/utils/sign_order";
import { Loading } from "@/components/ui/loading";
import PaymentSuccess from "./payment_success";
import PaymentError from "./payment_error";

const PaymentConfirmationWaiting = () => {
  const { signTypedDataAsync } = useSignTypedData();
  const { switchNetwork } = useAppKitNetwork();
  const { order, stage, status } = useAppStore();
  useEffect(() => {
    (async () => {
      try {
        let { signedOrder, signedApprovalData } = await signOrder({
          order,
          switchNetwork,
          signTypedDataAsync,
        });
        useAppStore.setState({ stage: OrderStage.SIGNED });
        await paymentService.SubmitOrder(order.orderId, {
          signedOrder,
          signedApprovalData,
        });
        const ES = paymentService.ListenStatus(order.orderId);
        ES.onmessage = function (event) {
          try {
            const data = JSON.parse(event.data);
            useAppStore.setState({ stage: data.stage, status: data.status });

            console.log(4, data);
          } catch (error) {
            console.log(error);
          }
        };
      } catch (error) {
        console.log(error);
        useAppStore.setState({ status: OrderStatus.FAILED });
      }
    })();
  }, []);
  if (status === OrderStatus.COMPLETED) {
    return <PaymentSuccess />;
  } else if (status === OrderStatus.FAILED) {
    return <PaymentError />;
  }
  return (
    <div>
      <div className="h-96 md:h-48 bg-[#F8F9FC] flex flex-col items-center justify-center gap-5 pt-6 pb-9">
        <Loading size="64" className="fill-[#FA6800]" />
      </div>
      <div className="p-8 flex flex-col gap-2">
        <span className="text-center text-[28px] font-bold">
          {stage !== OrderStage.INITIALIZED
            ? "Processing your payment"
            : "Waiting for Signature"}
        </span>
        <span className="cray-label-lg font-medium text-slate-600 text-center">
          {stage !== OrderStage.INITIALIZED
            ? "Hang tight - this will only take a moment."
            : `Almost there. Just confirming it's you. Sign the message in your
          wallet to proceed with payment.`}
        </span>
      </div>
    </div>
  );
};
export default PaymentConfirmationWaiting;
