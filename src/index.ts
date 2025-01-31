import { useEffect, useRef, useState } from "react";
import { popupCenter } from "./window_popup";
import { payWidgetService } from "./service";
import { crayProcessingOutlay } from "./processing_outlay";
import { _sleep, waitTillInitialization } from "./utils";
import widgetBridge from "widget-bridge";
import { IPaymentStatus, IPaymentRes } from "./types";
const origin = "https://pay.cray.network";
const nativeBridge = new widgetBridge({
  origin: origin,
});

const useCrayPay = () => {
  const states = useRef({ isPopupWindowConnected: false });
  const [status, setStatus] = useState<IPaymentStatus>(IPaymentStatus.idle);
  //@ts-ignore
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popup, setPopup] = useState<Window | null>();

  useEffect(() => {
    const handleMessage = ({ data }: any) => {
      //@ts-ignore
      const { payload, key } = data;
      switch (key) {
        case "INIT":
          states.current.isPopupWindowConnected = true;
          break;
      }
    };
    nativeBridge.addEventListener("message", handleMessage);
    return () => nativeBridge.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    crayProcessingOutlay.onclick = () => popup?.focus();
    let interval = setInterval(() => {
      const isPopupOpen = !popup ? false : !popup?.closed;
      setIsPopupOpen(isPopupOpen);
      if (isPopupOpen) {
        if (document.body.contains(crayProcessingOutlay)) return;
        document.body.appendChild(crayProcessingOutlay);
      } else {
        if (!document.body.contains(crayProcessingOutlay)) return;
        states.current.isPopupWindowConnected = false;
        nativeBridge.Reset();
        document.body.removeChild(crayProcessingOutlay);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [popup]);

  const pay = async (
    {
      destinationToken,
      receiverAddress,
      apiKey,
      testnet = false,
      destinationChain,
      amount,
      action = null,
    }: {
      destinationToken: string;
      receiverAddress: string;
      apiKey: string;
      testnet?: boolean;
      amount: string;
      destinationChain: number;
      action?: {
        payload: string;
        gasLimit: string;
      } | null;
    },
    options?: {
      onSuccess?: (event: IPaymentRes) => any;
      onError?: (error: any) => any;
    }
  ) => {
    try {
      const urlParams = new URLSearchParams({
        ...(testnet && { testnet: true }),
        apiKey,
        origin: window.location.origin,
      } as any);
      let popup = popupCenter({
        url: origin + "?" + urlParams,
        title: "Cray Pay Widget",
        w: 450,
        h: 600,
      });
      if (!popup) {
        alert("Enable popup and try again");
      }
      setPopup(popup);
      setStatus(IPaymentStatus.initiated);
      nativeBridge.UpdateChannel(popup);
      await waitTillInitialization(() => states.current.isPopupWindowConnected);
      nativeBridge.Send("APP_DATA", {
        apiKey,
        destinationToken,
        receiverAddress,
        testnet,
        destinationChain,
        amount,
      });

      const order = await payWidgetService.Create({
        data: {
          params: {
            amount,
            destinationToken,
            receiverAddress,
            orderType: "dapp",
            destinationChain,
            action,
          },
        },
        istestnet: testnet,
        apiKey,
      });

      let res = await nativeBridge.SendAsync("order", order);
      crayProcessingOutlay.innerHTML =
        "Payment Processing, Please don't close the window";
      setStatus(IPaymentStatus.processing);

      let fetchStatus = true;
      while (fetchStatus) {
        try {
          const order = await payWidgetService.Status({
            orderId: res._id,
            apiKey,
            istestnet: testnet,
          });
          if (order.status === "FULFILLED") {
            fetchStatus = false;
            setStatus(IPaymentStatus.completed);
            nativeBridge.Send("FULFILLED", order);
            if (options?.onSuccess) {
              options.onSuccess(order);
            }
          } else if (order.status === "FAILED") {
            fetchStatus = false;
            setStatus(IPaymentStatus.failed);
            nativeBridge.Send("FAILED", order);
            throw order;
          }
        } catch (error) {
          console.log(error);
        }
        await _sleep(5000);
      }
    } catch (error: any) {
      if (options?.onError) {
        options.onError(error);
      }
      setStatus(IPaymentStatus.failed);
    } finally {
      setPopup(null);
      states.current.isPopupWindowConnected = false;
    }
  };
  const messageHandlerRef = useRef(({ data }: any) => {
    switch (data.key) {
      case "":
    }
  });

  useEffect(() => {
    nativeBridge.addEventListener("message", messageHandlerRef.current);
    return () =>
      nativeBridge.removeEventListener("message", messageHandlerRef.current);
  }, [popup]);
  return {
    pay,
    status,
  };
};
export default useCrayPay;
