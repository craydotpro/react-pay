import { useAppKitAccount } from "@reown/appkit/react";
// import { Stepper, useStepData } from "../../ui/stepper";
import ConnectWallet from "../connect_wallet";
import { Stepper, useStepData } from "@/components/stepper";
import Home from "./home";
import PaymentConfirmation from "./payment_confimation";
import PaymentConfirmationWaiting from "./payment_confimation_waiting";
// import Footer from "../../ui/footer";
const PayModal = () => {
  const stepperContext = useStepData();
  const { isConnected, address } = useAppKitAccount();

  // if (loading) return <SuspenceLoader />;
  // else if (status === IPaymentStatus.completed) return <PaymentSuccess />;
  // else if (status === IPaymentStatus.failed || error)
  //   return <PaymentError error={error} />;
  return (
    <div className=" flex flex-col h-full">
      {!isConnected ? (
        <ConnectWallet />
      ) : (
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
      )}
      {/* <Footer /> */}
    </div>
  );
};
export default PayModal;
