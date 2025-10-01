import { mainnet } from "viem/chains";

export interface IOrder {
  _id: string;
  orderId: string;
  orderHash: string;
  status: string;
  amount: string;
  subOrders?: any[];
  destinationToken: string;
  destinationChain: number;
  orderData: string;
}
export interface ICrayActionPayload {
  payload: {
    abi: any;
    functionName: string;
    args: any[];
  }; // This will prepare bytecode for the action to execute on the destination chain.
  gasLimit: number; // The maximum gas limit for the action on the destination chain.;
}
export interface ICrayPayload {
  amount: string;
  testnet?: boolean;
  destinationChain: number;
  destinationToken?: string;
  destinationAddress: string;
  orderType?: string;
  action?: ICrayActionPayload;
}
export enum OrderStage {
  INITIALIZED = "INITIALIZED",
  SIGNED = "SIGNED",
  DECLINED = "DECLINED",
  CREATED = "CREATED",
  ASSIGNED = "ASSIGNED",
  CREATED_FAILED = "CREATED_FAILED",
  FULFILLED = "FULFILLED",
  FULFILLED_FAILED = "FULFILLED_FAILED",
  SETTLED = "SETTLED",
  SETTLE_FAILED = "SETTLE_FAILED",
  FAILED = "FAILED",
}

export enum OrderStatus {
  IDLE = "IDLE",
  INITIALIZED = "Initialized",
  PROCESSING = "Processing",
  COMPLETED = "Completed",
  FAILED = "Failed",
  CANCELLED = "Cancelled",
}

export interface ITokens {
  icon: string;
  symbol: string;
  decimals: number;
  tokenAddress: string;
  chainId: number;
  balance: string;
  usdBalance: string;
}

export type IOrderAllocation = ITokens & {
  spend: string;
};
