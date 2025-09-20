import { useAppKit } from "@reown/appkit/react";
import { useAppStore } from "../store";
import { _sleep } from "@/utils";
import { Button } from "@/components/ui/button";

const ConnectWallet = () => {
  const payload = useAppStore(state => state.payload);
  const { open } = useAppKit();

  return (
    <div className=" flex flex-col h-full">
      <div className="flex items-center justify-center bg-[#F8F9FC] h-1/2 gap-4 py-[66px]">
        <div className="w-[88px] h-[88px] border-[1.22px] border-[#EAECF0] rounded-[14.67px] p-[4.89px] shadow-[0px_1.98px_4.89px_0px_#1D29390D] bg-white">
          <div className="w-full h-full border-[1.22px] border-[#EAECF0] rounded-[10px]"></div>
        </div>
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22.6668H9.33329C5.65139 22.6668 2.66663 19.6821 2.66663 16.0002C2.66663 12.3183 5.65139 9.3335 9.33329 9.3335H12M20 22.6668H22.6666C26.3485 22.6668 29.3333 19.6821 29.3333 16.0002C29.3333 12.3183 26.3485 9.3335 22.6666 9.3335H20M9.33329 16.0002L22.6666 16.0002"
            stroke="#0E121B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="w-[88px] h-[88px] border-[1.22px] border-[#EAECF0] rounded-[14.67px] p-[4.89px] shadow-[0px_1.98px_4.89px_0px_#1D29390D] bg-white">
          <div className="w-full h-full border-[1.22px] border-[#EAECF0] rounded-[10px] flex items-center justify-center ">
            <img src="https://pay.cray.network/logo.svg" />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center  h-1/2 gap-6 py-8">
        <div className="flex flex-col gap-2">
          <p className=" text-[28px] font-bold">
            ${payload?.amount} Payment Requested
          </p>
          <p className=" text-slate-600 text-lg font-medium">
            Connect the wallet you want to pay from
          </p>
        </div>
        <Button onClick={() => open()}>Continue with Wallet</Button>
      </div>
    </div>
  );
};
export default ConnectWallet;
