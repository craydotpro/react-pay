import { payWidgetService } from "../../services";
import Button from "../../ui/button";
import { _sleep, prettifyAddress } from "../../utils";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { useMutation } from "@tanstack/react-query";

import { useSignMessage, useSignTypedData } from "wagmi";
import {
  ArrowLeft,
  BankNote01,
  Hourglass03,
  Wallet03,
} from "@untitled-ui/icons-react";
import PaymentLoading from "./loading";
import { CHAINS } from "../../constants";
import { useContext } from "react";
import { CrayContext } from "../../providers";
import { OrderStatus } from "../../interface";
import { IStepData } from "../../ui/stepper";

const PayScreen = ({ prev }: IStepData) => {
  const { address: senderAddress } = useAppKitAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const { switchNetwork } = useAppKitNetwork();
  const { signMessageAsync } = useSignMessage();
  const {
    state: {
      order,
      orderStatus,
      orderAllocation,
      onPaymentStarted,
      onPaymentFailed,
      apiKey,
      payload,
      testnet,
    },
    setState,
  } = useContext(CrayContext);
  const handleSend = useMutation({
    mutationFn: async () => {
      try {
        let updatedOrder = await payWidgetService.Create({
          data: {
            ...payload,
            senderAddress: senderAddress,
            sourceTokens: orderAllocation?.map(({ chainId, tokenAddress }) => ({
              chainId,
              address: tokenAddress,
            })),
          },
          testnet,
          apiKey,
        });

        const signedApprovalData = [];
        for (let i = 0; i < updatedOrder.allowance?.length; i++) {
          const data = updatedOrder.allowance[i];
          await switchNetwork(CHAINS[data.domainData.chainId]);
          await _sleep(2000); // delay between chain change
          let signature = await signTypedDataAsync({
            types: data.types,
            domain: data.domainData,
            message: data.values as any,
            primaryType: "Permit" as any,
          });
          const r = signature.slice(0, 66);
          const s = "0x" + signature.slice(66, 130);
          const v = "0x" + signature.slice(130, 132);
          signedApprovalData.push({
            r,
            s,
            v,
            chainId: data.domainData.chainId,
            verifyingContract: data.domainData.verifyingContract,
            walletAddress: senderAddress,
            value: data.values.value,
            deadline: data.values.deadline,
          });
        }
        const signedOrder = await signMessageAsync({
          message: { raw: updatedOrder.orderHash },
        });

        let res = await payWidgetService.SubmitOrder({
          orderHash: updatedOrder.orderHash,
          data: {
            params: {
              signedOrder,
              signedApprovalData,
              ...updatedOrder,
            },
          },
          apikey: apiKey,
          testnet: testnet,
        });
        onPaymentStarted(res.data.result);
        setState((state) => ({
          ...state,
          order: res.data.result,
          orderStatus: res.data.result.status,
        }));
      } catch (error) {
        console.log(error);
        onPaymentFailed(order!);
        if (String(error).includes("User rejected the request")) {
          return;
        }
        setState((state) => ({ ...state, orderStatus: OrderStatus.FAILED }));
      }
    },
  });

  const handlePayWithWallet = async () => {
    handleSend.mutate();
  };
  if (
    (handleSend as any).isLoading ||
    (handleSend as any).isPending ||
    orderStatus === "SIGNED"
  ) {
    return <PaymentLoading />;
  }
  return (
    <div className="h-full">
      <Button
        variant="ghost"
        size="sm"
        className="w-auto rounded-full border-0 absolute left-4 top-4"
        onClick={() => prev()}
      >
        {" "}
        <ArrowLeft width={24} />
      </Button>
      <div className="h-1/3 bg-[#F8F9FC] flex flex-col items-center justify-center gap-5 pt-6 pb-9">
        <span className="text-[#667085] font-medium cray-label-md">
          Requested Amount
        </span>
        <h3 className="cray-h3">${payload?.amount}</h3>
      </div>
      <div className="p-5 flex flex-col gap-5">
        <div className="flex flex-col divide-y divide-[#F2F4F7] font-medium cray-label-md">
          <div className="py-[14px] flex justify-between">
            <span className="flex items-center gap-[6px] text-slate-500 ">
              <Hourglass03 width={16} /> Estimated Time
            </span>
            <span className=" cray-label-md font-bold">~15sec</span>
          </div>
          <div className="py-[14px] flex justify-between">
            <span className="flex items-center gap-[6px] text-slate-500">
              <BankNote01 width={16} /> Platform Fee
            </span>
            <span className=" cray-label-md font-bold">Free</span>
          </div>
          <div className="py-[14px] flex justify-between">
            <span className="flex items-center gap-[6px] text-slate-500">
              <Wallet03 width={16} /> Wallet Info
            </span>
            <span className=" cray-label-md font-bold">
              {prettifyAddress(senderAddress)}
            </span>
          </div>
        </div>
        <div className="flex w-full">
          <Button loading={handleSend.isPending} onClick={handlePayWithWallet}>
            Confirm and Pay
          </Button>
        </div>
      </div>
    </div>
  );
};
export default PayScreen;
