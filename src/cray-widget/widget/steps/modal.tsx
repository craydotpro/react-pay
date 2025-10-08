import { useAppKitAccount } from "@reown/appkit/react";
import ConnectWallet from "../connect_wallet";
import { Stepper, useStepData } from "../../../components/stepper";
import Home from "./home";
import PaymentConfirmation from "./payment_confimation";
import PaymentConfirmationWaiting from "./payment_confimation_waiting";
import { useAppStore } from "../../store";
import QRFlowHome from "../qr_flow_steps/home";
import PaymentExpired from "./payment_expired";
const PayModal = () => {
  const { isConnected } = useAppKitAccount();
  const stepperContext = useStepData();
  const payment_method = useAppStore((state) => state.payment_method);

  if (!payment_method || (!isConnected && payment_method === "WALLET")) {
    return <ConnectWallet />;
  } else if (payment_method === "QR") {
    return (
      <Stepper stepData={stepperContext}>
        <Stepper.Step>
          <QRFlowHome />
        </Stepper.Step>
        <Stepper.Step>
          <PaymentExpired />
        </Stepper.Step>
      </Stepper>
    );
  } else if (isConnected && payment_method === "WALLET") {
    return (
      <Stepper stepData={stepperContext}>
        <Stepper.Step>
          <Home />
        </Stepper.Step>
        <Stepper.Step>
          <PaymentConfirmation />
        </Stepper.Step>
        <Stepper.Step>
          <PaymentConfirmationWaiting />
        </Stepper.Step>
      </Stepper>
    );
  }
};
export default PayModal;
