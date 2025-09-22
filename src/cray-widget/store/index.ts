import { create } from "zustand";
import {
  ICrayPayload,
  IOrder,
  OrderStage,
  OrderStatus,
  type IOrderAllocation,
  type ITokens,
} from "../interface";
import { CHAINS } from "../../config/chains";
import { mainnet } from "viem/chains";

interface IAppStore {
  apikey: string | null;
  testnet: boolean;
  status: OrderStatus | null;
  stage: OrderStage | null;
  order: null | any;
  orderId: null | string;
  userTokens: ITokens[];
  selectedTokens: null | Record<string, boolean>;
  orderAllocation: null | IOrderAllocation[];
  setUserTokens: Function;
  payload:
    | (Omit<ICrayPayload, "destinationChain"> & {
        destinationChain: typeof mainnet;
      })
    | null;
  initOrder: Function;
  reset: Function;
  callBacks: {
    onPaymentStarted?: (params: IOrder) => any;
    onPaymentCompleted?: (params: IOrder) => any;
    onPaymentFailed?: (params: IOrder) => any;
  };
  setCallBacks: Function;
}
const initialState = {
  apikey: null,
  testnet: false,
  status: null,
  stage: null,
  order: null,
  orderId: null,
  amount: "",
  userTokens: [],
  selectedTokens: null,
  orderAllocation: null,
  destinationChain: null,
  destinationAddress: "",
  action: null,
  payload: null,
  callBacks: {
    onPaymentStarted: () => {},
    onPaymentCompleted: () => {},
    onPaymentFailed: () => {},
  },
};
export const useAppStore = create<IAppStore>((set, get) => ({
  ...initialState,
  setUserTokens: (tokens: ITokens[]) => {
    let selectedTokens;
    if (!get().selectedTokens) {
      selectedTokens = tokens
        .map(_ => _.chainId + _.tokenAddress)
        .reduce((obj, prop) => {
          obj[prop] = true;
          return obj;
        }, {} as any);
    }
    set({ userTokens: tokens, ...(selectedTokens && { selectedTokens }) });
  },

  initOrder: (payload: ICrayPayload & { destinationChain: number }) => {
    set({
      payload: {
        ...payload,
        destinationChain: CHAINS[payload.destinationChain] as typeof mainnet,
      },
    });
  },
  setCallBacks: (callBacks: IAppStore["callBacks"]) => set({ callBacks }),
  reset: () => set({ ...initialState }),
}));
