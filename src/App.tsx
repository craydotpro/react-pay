import CrayPayButton from "./cray-widget/index";
const API_KEY = import.meta.env.VITE_GATEWAY_API_KEY;
export default function App() {
  return (
    <CrayPayButton
      testnet={true}
      apiKey={API_KEY}
      onPaymentStarted={e => console.log("paymentStarted", e)}
      onPaymentCompleted={e => console.log("paymentCompeted", e)}
      onPaymentFailed={e => console.log("paymentFailed", e)}
      payload={{
        destinationChain: 137,
        amount: ".001",
        destinationAddress: "0x82656BB86876A96bbbD553Df7E441AbD46235e25",
      }}
    >
      <button className="w-full bg-red-500">Cray Pay1</button>
    </CrayPayButton>
  );
}
