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
