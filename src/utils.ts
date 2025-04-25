import { encodeFunctionData, formatUnits, parseUnits } from "viem";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { IAccountBalance } from "./interface";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const HIDE = (condition: boolean) => ({
  ...(condition && { hidden: true }),
});
export const SHOW = (condition?: boolean) => ({
  ...(!condition && { hidden: true }),
});

export const _sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), ms));

export const pageAccessedByReload =
  (window.performance.navigation && window.performance.navigation.type === 1) ||
  window.performance
    .getEntriesByType("navigation")
    .map((nav: any) => nav.type)
    .includes("reload");

export const deserializeFunctionData = (
  action: any,
  options: Record<string, string | number>
) => {
  if (!action) return null;
  const args = action.args.map((arg: string) => {
    if (!arg.startsWith("$$")) return arg;
    arg = arg.substr(2); //remove $$ from start
    if (arg in options) {
      return options[arg];
    } else return "$$" + arg;
  });
  return encodeFunctionData({
    abi: action.abi,
    functionName: action.functionName,
    args,
  });
};
const moveElementToFirst = (elem: any, array: any[]) => {
  const isExists = array.includes(elem);
  if (!isExists) return array;
  return [elem, ...array.filter((a) => a !== elem)];
};
export function prettifyAddress(hash: string = "") {
  return hash.substr(0, 6) + "..." + hash.substr(-4);
}

export const calculateAllocation = ({
  balances,
  amount,
  toChainId,
  chainAllocationOrder,
}: {
  balances: IAccountBalance[];
  amount: string;
  toChainId: number;
  chainAllocationOrder: number[];
}) => {
  let remainingAmount = parseFloat(amount);
  const transferDetails = [];
  if (balances.length === 1) {
    let spend = parseUnits(
      remainingAmount.toFixed(balances[0].decimals).toString(),
      balances[0].decimals
    );
    return [{ ...balances[0], spend: spend.toString() }];
  }
  // let chainAllocationOrder: number[] = [];
  chainAllocationOrder = moveElementToFirst(toChainId, chainAllocationOrder);
  // Sort the user balances in ascending order
  const sortedBalances = balances.sort(
    (a, b) =>
      chainAllocationOrder.indexOf(a.chainId) -
      chainAllocationOrder.indexOf(b.chainId)
  );
  // Iterate the balances and transfer the maximum possible amount from each balance
  for (const balance of sortedBalances) {
    let tempRemainingAmount = parseUnits(
      remainingAmount.toFixed(balance.decimals).toString(),
      balance.decimals
    );
    const balanceAmount = BigInt(balance.balance);
    if (balanceAmount < tempRemainingAmount) {
      /** if token balance is less than remaining balance, push token balance in the array and continue the loop */
      transferDetails.push({ ...balance, spend: balanceAmount.toString() });
      tempRemainingAmount = tempRemainingAmount - balanceAmount;
      remainingAmount = parseFloat(
        formatUnits(tempRemainingAmount, balance.decimals)
      );
    } else {
      let spend = parseUnits(
        remainingAmount.toFixed(balance.decimals).toString(),
        balance.decimals
      );
      transferDetails.push({ ...balance, spend: spend.toString() });
      remainingAmount = 0;
      break;
    }
  }
  // If the remaining amount is greater than 0, return transfer is not possible
  if (remainingAmount > 0) {
    return false;
  }
  return transferDetails;
};

export function localizeFiat(number: number | string) {
  if (typeof number === "string") {
    number = Number(number);
  }
  return "$ " + number.toFixed(2);
}
