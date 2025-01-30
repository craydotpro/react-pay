export enum IPaymentStatus {
  "idle" = "idle",
  "initiated" = "initiated",
  "pending" = "pending",
  "completed" = "completed",
  "failed" = "failed",
  "processing" = "processing",
}
export interface IPaymentRes {
  _id: String;
  receiverAddress: string;
  destinationChain: number;
  destinationToken: string;
  amount: string;
  orderType: string;
  minAmountOut: string;
  orderHash: string;
  status: IPaymentStatus;
  destinationPayload: string;
  destinationGasLimit: number;
  apiId: string;
  isSponsered: boolean;
  subOrders: [];
  createdAt: string;
  updatedAt: string;
  orderData: string;
  senderAddress: string;
  signedAt: string;
  signedOrder: string;
}
