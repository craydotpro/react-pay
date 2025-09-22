import PayModal from "./steps/modal";
import { ReactElement, ReactNode, useMemo } from "react";
import { ICrayPayload, IOrder } from "../interface";
import ReactDOM from "react-dom";
import { useAppStore } from "../store";
import { Button } from "../../components/ui/button";
let crayModal = document.getElementById("cray-modal")?.shadowRoot;
if (!crayModal) {
  const container = document.createElement("div");
  container.setAttribute("id", "cray-modal");
  document.body.appendChild(container);
  container.attachShadow({ mode: "open" });
  crayModal = container.shadowRoot;
}
const CloseIcon = () => {
  const reset = useAppStore((state) => state.reset);
  const handleClose = () => reset();
  return (
    <button
      onClick={handleClose}
      className=" cursor-pointer absolute top-2 right-2 hover:bg-gray-100 rounded-full p-2 active:bg-gray-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="16px"
        viewBox="0 -960 960 960"
        width="16px"
        fill="black"
      >
        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
      </svg>
    </button>
  );
};
const Portal = ({
  children,
  portalTarget,
}: {
  children: ReactNode;
  portalTarget: ShadowRoot;
}) => {
  if (portalTarget) {
    return ReactDOM.createPortal(children, portalTarget);
  } else {
    return children;
  }
};
const PayWidget = ({
  payload,
  testnet,
  apiKey,
  onPaymentStarted,
  onPaymentCompleted,
  onPaymentFailed,
  children,
}: {
  payload: ICrayPayload;
  testnet: boolean;
  apiKey: string;
  onPaymentStarted: (params: IOrder) => any;
  onPaymentCompleted: (params: IOrder) => any;
  onPaymentFailed: (params: IOrder) => any;
  children?: ReactElement;
}) => {
  const orderInitiated = useAppStore((state) => state.payload);
  const initOrder = useAppStore((state) => state.initOrder);
  const setCallBacks = useAppStore((state) => state.setCallBacks);
  const handleNext = () => {
    useAppStore.setState(() => ({
      apikey: apiKey,
      testnet,
    }));
    initOrder(payload);
    setCallBacks({
      onPaymentStarted,
      onPaymentCompleted,
      onPaymentFailed,
    });
  };
  const css = useMemo(
    () =>
      [...document.querySelectorAll("style")].map((_) => _.innerHTML).join(""),
    []
  );
  if (orderInitiated) {
    return (
      <Portal portalTarget={crayModal!}>
        <style>{css}</style>
        <div className="bg-black/50 fixed !z-[999999] top-0 left-0 w-screen h-screen flex items-center justify-center text-black">
          <div className="relative  overflow-hidden w-full md:w-[480px] h-full md:h-auto mx-auto  shadow-sm bg-white md:rounded-[16px] pb-8">
            <CloseIcon />
            <PayModal />
          </div>
        </div>
      </Portal>
    );
  } else {
    return children ? (
      <children.type {...children.props} onClick={handleNext} />
    ) : (
      <Button onClick={handleNext}>Pay</Button>
    );
  }
};
export default PayWidget;
