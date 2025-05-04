import { useContext, useEffect } from "react";
import { Loading } from "../../ui/loading";
import { payWidgetService } from "../../services";
import { IPaymentStatus } from "../../types";
import { _sleep } from "../../utils";
import { CrayContext } from "../../providers";
import { OrderStatus } from "../../interface";

const PaymentLoading = () => {
  const {
    state: {
      order,
      orderStatus,
      apiKey,
      testnet,
      onPaymentCompleted,
      onPaymentFailed,
    },
    setState,
  } = useContext(CrayContext);
  useEffect(() => {
    if (!order?.orderId) return;
    let fetchStatus = true;
    (async () => {
      while (fetchStatus) {
        try {
          const res = await payWidgetService.Status({
            orderId: order?.orderId,
            apiKey: apiKey,
            testnet: testnet,
          });
          if (res.status === "FULFILLED") {
            fetchStatus = false;
            setState((states) => ({
              ...states,
              order: res,
              status: IPaymentStatus.completed,
            }));
            onPaymentCompleted(res);
          } else if (res.status === "FAILED") {
            fetchStatus = false;
            setState((states) => ({
              ...states,
              order: res,
              status: IPaymentStatus.failed,
            }));
            onPaymentFailed(res);
            throw res;
          }
        } catch (error) {
          console.log(error);
        }
        await _sleep(5000);
      }
    })();
  }, [order?.orderId]);
  return (
    <div className="h-full">
      <div className="h-1/2 bg-[#F8F9FC] flex flex-col items-center justify-center gap-5 pt-6 pb-9">
        <Loading size="64" className="fill-[#FA6800]" />
      </div>
      <div className="p-8 flex flex-col gap-2">
        <span className="text-center text-[28px] font-bold">
          {orderStatus === OrderStatus.SIGNED
            ? "Processing"
            : "Waiting for Signature"}
        </span>
        <span className="cray-label-lg font-medium text-slate-600 text-center">
          {orderStatus === OrderStatus.SIGNED
            ? "Hang tight - it's on its way."
            : `Almost there. Just confirming it's you. Sign the message in your
          wallet to proceed with payment.`}
        </span>
      </div>
    </div>
  );
};
export default PaymentLoading;
