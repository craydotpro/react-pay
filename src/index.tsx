import { ReactElement, useMemo } from "react";
import PayWidget from "./widget";
import CrayProvider from "./providers";
import { QueryClientProvider } from "@tanstack/react-query";
import { AppKitProviderWrapper } from "./config/wagmi_adopter";
import { queryClient } from "./constants";
import { ICrayPayload, IOrder } from "./interface";

const CrayPayButton = ({
  apiKey,
  testnet = false,
  payload,
  onPaymentStarted = () => {},
  onPaymentCompleted = () => {},
  onPaymentFailed = () => {},
  children,
}: {
  apiKey: string;
  testnet: boolean;
  payload: ICrayPayload;
  onPaymentStarted?: (params: IOrder) => any;
  onPaymentCompleted?: (params: IOrder) => any;
  onPaymentFailed?: (params: IOrder) => any;
  children?: ReactElement;
}) => {
  const {
    destinationToken,
    receiverAddress,
    destinationChain,
    amount,
    action,
  } = payload;
  const updatedAction = useMemo(() => {
    if (action) {
      let serializedAction = JSON.stringify(action);
      serializedAction = serializedAction.replaceAll(
        "$$senderAddress",
        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
      );
      // replace $$senderAddress with placeholder addrss
      return JSON.parse(serializedAction);
    }
  }, [action]);
  return (
    <CrayProvider>
      <QueryClientProvider client={queryClient}>
        <AppKitProviderWrapper>
          <PayWidget
            payload={{
              amount,
              destinationToken,
              receiverAddress,
              orderType: "dapp",
              destinationChain,
              action: updatedAction,
            }}
            testnet={testnet}
            apiKey={apiKey}
            onPaymentStarted={onPaymentStarted}
            onPaymentCompleted={onPaymentCompleted}
            onPaymentFailed={onPaymentFailed}
            children={children}
          />
        </AppKitProviderWrapper>
      </QueryClientProvider>
    </CrayProvider>
  );
};
export default CrayPayButton;
