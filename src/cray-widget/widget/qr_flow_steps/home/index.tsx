import { useContext, useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { paymentService } from "../../../services/payment";
import { useAppStore } from "../../../store";
import { useTokens } from "../../../../hooks/use_tokens";
import { Loading } from "../../../../components/ui/loading";
import { OrderStatus } from "../../../interface";
import { StepContext } from "../../../../components/stepper";
import PaymentSuccess from "../../steps/payment_success";
import PaymentError from "../../steps/payment_error";
import QRProcessingPayment from "../../steps/processing_qr_payment";
import { secondsToHours } from "../../../../utils";
import { CHAINS } from "../../../config/chains";

const QRFlowHome = () => {
  const stepperContext = useContext(StepContext);
  const [chainId, setChainId] = useState<any>();
  const [chains, setChains] = useState([]);
  const [remainingTime, setRemainingTime] = useState(1000);

  const status = useAppStore((state) => state.status);
  const testntet = useAppStore((state) => state.testnet);
  const { amount, destinationChain, destinationAddress } = useAppStore(
    (state) => state.payload
  );

  const [order, setOrder] = useState<any>();

  const callBacks = useAppStore((state) => state.callBacks);
  const tokens = useTokens();
  useEffect(() => {
    /** chain handling */
    if (!order) return;
    let chains = order.QR_ENABLED_CHAINS.map(
      (chainId) => CHAINS[chainId]
    ).filter((chain) => !!chain.testnet === !!testntet);
    if (!chains[0]) {
      alert("network not supported");
    }
    setChains(chains);
    setChainId(chains[0].id);
  }, [order]);
  useEffect(() => {
    /** */
    if (remainingTime <= 0) stepperContext.next();
  }, [remainingTime]);
  useEffect(() => {
    if (!order) return;
    const interval = setInterval(() => {
      setRemainingTime((state) => state - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [order]);
  useEffect(() => {
    let ES;
    (async () => {
      try {
        const order = await paymentService.CreateQROrder({
          receiverAddress: destinationAddress,
          destinationChain: destinationChain?.id!,
          amount: amount,
          orderType: "dapp",
        });
        setOrder(order);
        setRemainingTime(
          (Number(new Date(order.createdAt)) -
            Number(new Date()) +
            order.QR_EXPIRE_TIME) /
            1000
        );
        ES = paymentService.ListenStatus(order.orderId);
        ES.onmessage = function (event) {
          try {
            const data = JSON.parse(event.data);
            useAppStore.setState({ stage: data.stage, status: data.status });
            if (data.status === OrderStatus.COMPLETED) {
              callBacks.onPaymentCompleted(order);
            } else if (data.status === OrderStatus.FAILED) {
              callBacks.onPaymentFailed(order);
            }
          } catch (error) {
            console.log(error);
          }
        };
      } catch (error) {
        alert(error?.response?.data || error);
      }
    })();
    return () => ES?.close?.();
  }, []);
  const QR = useMemo(() => {
    if (!order || tokens.isLoading || !chainId) return null;
    const tokenAddress = tokens.data[chainId].tokenAddress;
    const amount = order.qrId;
    const verifierContractAddresses = order.verifierContractAddresses[chainId];
    return `ethereum:${tokenAddress}@${chainId}/approve?uint256=${amount}&address=${verifierContractAddresses}`;
  }, [order, tokens, chainId]);

  if (status === OrderStatus.COMPLETED) {
    return <PaymentSuccess />;
  } else if (status === OrderStatus.FAILED) {
    return <PaymentError />;
  } else if (status === OrderStatus.PROCESSING) {
    return <QRProcessingPayment />;
  }
  return (
    <div>
      <div className=" bg-[#F8F9FC] flex flex-col items-center justify-center gap-5 pt-6 pb-9 w-full">
        <span className="text-[#667085] font-medium cray-label-md">
          Request Amount
        </span>
        <h3 className="cray-h3">${amount}</h3>
      </div>
      {QR ? (
        <>
          <div className="pt-5 flex justify-center w-full">
            <QRCodeSVG value={QR} size={200} />
          </div>
          <div className="flex text-bold justify-center items-center gap-4 text-center font-bold mt-4 text-[#f96900]">
            <span>Expire</span>
            <span className=" leading-3">{secondsToHours(remainingTime)}</span>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center p-8">
          <Loading size="64" />
        </div>
      )}
      <div className="flex text-bold justify-center items-center gap-4 text-center font-bold mt-4 ">
        {chains.map((chain) => (
          <button
            onClick={() => setChainId(chain.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              chainId === chain.id
                ? "ring-2 ring-[#f96900] bg-[#f96900]/10 "
                : ""
            }`}
          >
            <img
              src={`https://app.cray.pro/icons/chains/${chain.id}.svg`}
              className="h-6"
            />
            <p>{chain.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
export default QRFlowHome;
