import type { ITokens } from "@/interfaces";
import { xhr } from "@/utils";

class BalanceService {
  GetAll = async (address: string) =>
    (await xhr.get(`/balances/${address}`)).data;
  GetTokenAllocation = async ({
    amount,
    destinationChain,
    address,
    tokens,
  }: {
    amount: string;
    destinationChain: number;
    address: string;
    tokens: ITokens[];
  }) =>
    (
      await xhr.post(`/balances/calculate-allocation`, {
        amount,
        destinationChain,
        address,
        tokens,
      })
    ).data;
}
export const balanceService = new BalanceService();
