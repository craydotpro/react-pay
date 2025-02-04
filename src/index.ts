/**
 * useCrayPay - A React hook for integrating cray.network crypto payments.
 *
 * This hook provides a simplified interface for initiating and managing crypto payments
 * through the CrayPay widget. It handles communication with the widget, manages payment
 * status, and provides callbacks for success and error scenarios.
 *
 * @returns {object} An object containing the `pay` function and the `status` state.
 */
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
        case "INVALID_API_KEY":
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

  /**
   * pay - Initiates a crypto payment.
   *
   * Opens the CrayPay widget in a popup, sends payment information, and monitors the payment status.
   *
   * @param {object} paymentDetails - The details of the payment.
   * @param {string} paymentDetails.destinationToken - The address of the token to be sent.
   * @param {string} paymentDetails.receiverAddress - The address of the recipient.
   * @param {string} paymentDetails.apiKey - Your CrayPay API key.
   * @param {boolean} [paymentDetails.testnet=false] - Whether to use the testnet.
   * @param {string} paymentDetails.amount - The amount to be paid (as a string).
   * @param {number} paymentDetails.destinationChain - The ID of the destination chain.
   * @param {object} [paymentDetails.action=null] - Optional action details (e.g., for contract calls).
   * @param {string} paymentDetails.action.payload - The payload for the action.
   * @param {string} paymentDetails.action.gasLimit - The gas limit for the action.
   * @param {object} [options] - Optional callbacks for success and error.
   * @param {function} [options.onSuccess] - Callback function called when the payment is successful. Receives the payment response as an argument.
   * @param {function} [options.onError] - Callback function called when the payment fails. Receives the error as an argument.
   *
   * @returns {Promise<void>}
   */
  const pay = async (
    {
      destinationToken,
      receiverAddress,
      apiKey,
      testnet = false,
      destinationChain,
      amount,
      action,
    }: {
      destinationToken: string;
      receiverAddress: string;
      apiKey: string;
      testnet?: boolean;
      amount: string;
      destinationChain: number;
      action?: {
        payload: {
          abi: any;
          functionName: string;
          args: any[];
        } | null;
        gasLimit: number; // The maximum gas limit for the action on the destination chain.
      };
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
      nativeBridge.UpdateChannel(popup);
      setPopup(popup);
      setStatus(IPaymentStatus.initiated);
      await waitTillInitialization(() => states.current.isPopupWindowConnected);
      nativeBridge.Send("APP_DATA", {
        apiKey,
        destinationToken,
        receiverAddress,
        testnet,
        destinationChain,
        amount,
        action,
      });

      const order = await payWidgetService.Create({
        data: {
          params: {
            amount,
            destinationToken,
            receiverAddress,
            orderType: "dapp",
            destinationChain,
          },
        },
        testnet,
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
            testnet,
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
