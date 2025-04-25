export interface IToken {
  chainId: number;
  tokenAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  icon: string;
  isStable: boolean;
  price?: number;
  gasless?: boolean;
}

export interface IAccountBalance extends IToken {
  account: string;
  balance: string;
  amount: string; // formatted balance
  usdBalance: string;
}

export interface ISpendBalance extends IAccountBalance {
  spend: string;
}
export interface IOrder {
  orderId: string;
  orderHash: string;
  status: string;
  amount: string;
  subOrders?: any[];
  destinationToken: string;
  destinationChain: number;
  orderData: string;
}
export interface ICrayPayload {
  amount: string;
  destinationToken: string;
  receiverAddress: string;
  orderType?: string;
  destinationChain: number;
  action: {
    payload: {
      abi: any;
      functionName: string;
      args: any[];
    }; // This will prepare bytecode for the action to execute on the destination chain.
    gasLimit: number; // The maximum gas limit for the action on the destination chain.;
  };
}
export enum OrderStatus {
  INITIALIZED = "INITIALIZED",
  SIGNED = "SIGNED",
  DECLINED = "DECLINED",
  ASSIGNED = "ASSIGNED",
  CREATED = "CREATED",
  CREATED_FAILED = "CREATED_FAILED",
  FULFILLED = "FULFILLED",
  FULFILLED_FAILED = "FULFILLED_FAILED",
  SETTLED = "SETTLED",
  SETTLE_FAILED = "SETTLE_FAILED",
  FAILED = "FAILED",
}
