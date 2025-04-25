import css from "../style.css";
import PayModal from "./steps/modal";
import { useContext, useEffect } from "react";
import { CrayContext } from "../providers";
import { IPaymentStatus } from "../types";
import Button from "../ui/button";
import { ICrayPayload, IOrder } from "../interface";
const PayWidget = ({
  payload,
  testnet,
  apiKey,
  onPaymentStarted,
  onPaymentCompleted,
  onPaymentFailed,
}: {
  payload: ICrayPayload;
  testnet: boolean;
  apiKey: string;
  onPaymentStarted: (params: IOrder) => any;
  onPaymentCompleted: (params: IOrder) => any;
  onPaymentFailed: (params: IOrder) => any;
}) => {
  const {
    state: { loading, status },
    setState,
  } = useContext(CrayContext);
  useEffect(() => {}, [loading]);
  switch (status) {
    case IPaymentStatus.idle:
      return (
        <Button
          onClick={() =>
            setState((state) => ({
              ...state,
              apiKey,
              testnet,
              status: IPaymentStatus.initiated,
              onPaymentStarted,
              onPaymentCompleted,
              onPaymentFailed,
              payload,
            }))
          }
        >
          Pay
        </Button>
      );
    default:
      return (
        <>
          <style>{css}</style>
          <div className="bg-black/50 fixed !z-[999999] top-0 left-0 w-screen h-screen flex items-center justify-center">
            <div className="relative  overflow-hidden w-full md:w-[480px] h-full md:h-auto mx-auto  shadow-sm bg-white rounded-[16px]">
              <PayModal apiKey={apiKey} testnet={testnet} payload={payload} />
            </div>
          </div>
        </>
      );
  }
};
export default PayWidget;
