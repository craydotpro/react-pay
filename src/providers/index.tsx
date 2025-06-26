import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { IPaymentStatus } from "../types";
import {
  IAccountBalance,
  ICrayPayload,
  IOrder,
  ISpendBalance,
  OrderStatus,
} from "../interface";
interface IState {
  status: IPaymentStatus;
  loading: boolean;
  order: IOrder | null;
  error: string;
  apiKey: string;
  testnet: boolean;
  orderAllocation: null | ISpendBalance[];
  orderStatus: null | OrderStatus;
  userBalance: IAccountBalance[] | null;
  onPaymentStarted: (params: IOrder) => any;
  onPaymentCompleted: (params: IOrder) => any;
  onPaymentFailed: (params: IOrder) => any;
  payload: null | ICrayPayload;
  selectedBalances: any;
}
export const defaultValue = {
  status: IPaymentStatus.idle,
  loading: false,
  order: null,
  error: "",
  apiKey: "",
  testnet: false,
  orderAllocation: null,
  orderStatus: null,
  onPaymentStarted: () => {},
  onPaymentCompleted: () => {},
  onPaymentFailed: () => {},
  userBalance: null,
  payload: null,
  selectedBalances: null,
};
export const CrayContext = createContext<{
  state: IState;
  setState: Dispatch<SetStateAction<IState>>;
}>({ state: defaultValue, setState: () => {} });
const CrayProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<IState>(defaultValue);

  return (
    <CrayContext.Provider value={{ state, setState }}>
      {children}
    </CrayContext.Provider>
  );
};
export default CrayProvider;
