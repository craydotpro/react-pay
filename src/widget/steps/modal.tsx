import { useAppKitAccount } from "@reown/appkit/react";
import { Stepper, useStepData } from "../../ui/stepper";
import ConnectWallet from "../connect_wallet";
import PaymentBreakdown from "./payment_break_down";
import { useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { payWidgetService } from "../../services";
import PayScreen from "./pay";
import { CrayContext } from "../../providers";
import SuspenceLoader from "../../ui/suspense_loader";
import Footer from "../../ui/footer";
import PaymentSuccess from "./payment_success";
import PaymentError from "./payment_error";
import { IPaymentStatus } from "../../types";
const PayModal = ({ testnet }: any) => {
  const {
    state: { loading, error, status },
    setState,
  } = useContext(CrayContext);
  const stepperContext = useStepData();
  const { isConnected, address } = useAppKitAccount();

  const userBalance = useQuery({
    queryKey: ["user_balance"],
    queryFn: () => payWidgetService.GetUserBalance(address!, testnet),
    enabled: !!address,
  });
  useEffect(() => {
    setState((state) => ({ ...state, userBalance: userBalance.data }));
  }, [userBalance.data]);

  if (loading) return <SuspenceLoader />;
  else if (status === IPaymentStatus.completed) return <PaymentSuccess />;
  else if (status === IPaymentStatus.failed || error)
    return <PaymentError error={error} />;
  return (
    <div className=" flex flex-col h-full">
      {!isConnected ? (
        <ConnectWallet />
      ) : (
        <Stepper stepData={stepperContext}>
          <Stepper.Step>
            <PaymentBreakdown />
          </Stepper.Step>
          <Stepper.Step>
            <PayScreen {...stepperContext} />
          </Stepper.Step>
        </Stepper>
      )}
      <Footer />
    </div>
  );
};
export default PayModal;
