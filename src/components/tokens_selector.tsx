import { ArrowLeft } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import type { ITokens } from "../interfaces";
import { useAppStore } from "../cray-widget/store";

const TokensSelector = ({
  isEnable,
  setEnable,
}: {
  isEnable: boolean;
  setEnable: Function;
}) => {
  const { selectedTokens, userTokens } = useAppStore((state) => state);

  return (
    <div
      className={`left-0 h-full w-full absolute transition-all duration-150 p-4 bg-white z-10 ${
        isEnable ? "top-0" : "top-full"
      }`}
    >
      <div className="flex gap-4">
        <ArrowLeft className="btn" onClick={() => setEnable(false)} />
        <b>Select Token</b>
      </div>

      <div className="flex flex-col mt-4">
        {userTokens?.map((balance: ITokens) => {
          let key = balance.chainId + balance.tokenAddress;
          const isSelected = selectedTokens?.[key];
          return (
            <button
              key={key}
              className={`flex py-3 items-center justify-between gap-4 px-5 cursor-pointer border-b border-slate-200 ${
                isSelected && "bg-slate-50"
              }`}
              onClick={() =>
                useAppStore.setState((state) => ({
                  ...state,
                  selectedTokens: {
                    ...state.selectedTokens,
                    [key]: !state.selectedTokens?.[key],
                  },
                }))
              }
            >
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 relative">
                  <img src={`/chains/${balance.chainId}.svg`} />
                  <img
                    src={balance?.icon}
                    className="absolute w-5 z-1  left-[20px] top-[20px]"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="cray-label-md font-bold">
                    {balance.symbol}
                  </span>
                  <span className="cray-label-md text-slate-500 ">
                    {balance.symbol}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className=" font-bold lable-md">
                  $ {Number(balance.usdBalance).toFixed(2)}
                </span>
                <Checkbox checked={isSelected!} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default TokensSelector;
