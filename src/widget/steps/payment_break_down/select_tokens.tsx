import { IAccountBalance } from "../../../interface";
import { CrayContext } from "../../../providers";
import Button from "../../../ui/button";
import Checkbox from "../../../ui/checkbox";
import Footer from "../../../ui/footer";
import { localizeFiat } from "../../../utils";
import { ArrowLeft } from "@untitled-ui/icons-react";
import { useContext, useMemo } from "react";

const SelectTokens = ({
  showSelectTokens,
  setShowSelectTokens,
  isEnoughBalance,
}: {
  showSelectTokens: boolean;
  setShowSelectTokens: Function;
  isEnoughBalance: boolean;
}) => {
  const {
    state: { userBalance, selectedBalances, orderAllocation },
    setState,
  } = useContext(CrayContext);
  const selectedTokens = useMemo(
    () =>
      new Set(
        [...(selectedBalances || []), ...(orderAllocation || [])].map(
          (_) => _.chainId + _.tokenAddress
        )
      ),
    [selectedBalances, orderAllocation]
  );

  const handleSelectBalance = (token: IAccountBalance) => {
    let newSelectedBalances;
    if (selectedTokens.has(token.chainId + token.tokenAddress)) {
      newSelectedBalances = (selectedBalances || []).filter(
        (balance: IAccountBalance) =>
          balance.chainId + balance.tokenAddress !==
          token.chainId + token.tokenAddress
      );
    } else {
      newSelectedBalances = [...(selectedBalances || []), token];
    }
    setState((states) => ({
      ...states,
      selectedBalances: newSelectedBalances,
    }));
  };
  return (
    <div
      className={`flex flex-col absolute transition-all duration-300 w-full h-full  bg-white ${
        showSelectTokens ? "top-0" : "top-full"
      }`}
    >
      <div className="py-[14px] px-5 flex w-full items-center">
        <Button
          variant="ghost"
          size="sm"
          className="w-auto rounded-full border-0 absolute"
          onClick={() => setShowSelectTokens(false)}
        >
          <ArrowLeft width={24} />
        </Button>
        <p className="text-center flex-grow cray-label-md font-bold">
          Select Token
        </p>
      </div>
      <p className="cray-label-md px-5 text-slate-600 pt-2 pb-3">
        <span className="font-bold">NOTE:</span> We've pre-selected the best
        tokens for your payment. To change, deselect and choose others.
      </p>
      <div className="flex flex-col">
        {userBalance?.map((balance: IAccountBalance) => {
          const isSelected = selectedTokens.has(
            balance.chainId + balance.tokenAddress
          );
          return (
            <button
              key={balance.chainId + balance.tokenAddress}
              className={`flex py-3 items-center justify-between gap-4 px-5 cursor-pointer border-b border-slate-200 ${
                isSelected && "bg-slate-50"
              }`}
              onClick={() => handleSelectBalance(balance)}
            >
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 relative">
                  <img
                    src={`https://pay.cray.network/chains/${balance.chainId}.svg`}
                  />
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
                  {localizeFiat(balance.usdBalance)}
                </span>
                <Checkbox checked={isSelected} />
              </div>
            </button>
          );
        })}
      </div>
      <div className="w-full flex-grow"></div>
      <div
        className={` border-error bg-red-50 rounded-[8px] text-center mt-5 text-error cray-label-md font-medium transition-all duration-200 mx-5 ${
          isEnoughBalance
            ? "h-0 overflow-hidden p-0"
            : "max-h-[100px] p-3 border "
        }`}
      >
        Insufficient funds.
      </div>
      <div className="p-5 ">
        <Button onClick={() => setShowSelectTokens(false)}>
          Use these tokens
        </Button>
      </div>
      <Footer />
    </div>
  );
};
export default SelectTokens;
