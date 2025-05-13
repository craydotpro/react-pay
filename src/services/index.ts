import axios from "redaxios";
import { IAccountBalance } from "../interface";

const GATEWAY_HOST = process.env.GATEWAY_HOST;
class PayWidgetService {
  Status = async ({
    orderId,
    apiKey,
    testnet,
  }: {
    orderId: string;
    apiKey: string;
    testnet: any;
  }) => {
    return (
      await axios.get(`${GATEWAY_HOST}/order-status-by-order-id/${orderId}`, {
        headers: {
          apiKey,
          testnet,
        },
      })
    ).data.result;
  };
  Create = async ({
    data,
    testnet,
    apiKey,
  }: {
    data: any;
    testnet: any;
    apiKey: string;
  }) => {
    return (
      await axios.post(
        `${GATEWAY_HOST}/create-order`,
        {
          params: data,
        },
        {
          headers: {
            apiKey,
            testnet,
          },
        }
      )
    ).data.result;
  };
  Authorize = ({
    origin,
    apikey,
    testnet,
  }: {
    origin: string;
    apikey: string;
    testnet: any;
  }) =>
    axios.get(`${GATEWAY_HOST}/authorize/`, {
      headers: {
        apiKey: apikey,
        clientorigin: origin,
        testnet,
      },
    });

  SubmitOrder = ({
    orderHash,
    data,
    apikey,
    testnet,
  }: {
    orderHash: string;
    data: any;
    apikey: string;
    testnet: any;
  }) =>
    axios.post(`${GATEWAY_HOST}/submit-order/${orderHash}`, data, {
      headers: {
        apiKey: apikey,
        testnet,
      },
    });
  SetOrderPayee = ({
    orderHash,
    data,
    apikey,
    testnet,
  }: {
    orderHash: string;
    data: any;
    apikey: string;
    testnet: any;
  }) =>
    axios.patch(`${GATEWAY_HOST}/set-payee/${orderHash}`, data, {
      headers: {
        apiKey: apikey,
        testnet,
      },
    });
  GetAllTokens = async ({ testnet }: { testnet: any }) => {
    return (
      await axios.get(`${GATEWAY_HOST}/tokens`, {
        headers: {
          testnet,
        },
      })
    ).data.result;
  };
  GetUserBalance = async (address: string, testnet: any) => {
    return (
      await axios.get(`${GATEWAY_HOST}/get-balance/${address}`, {
        headers: {
          testnet,
        },
      })
    ).data.result;
  };
  GetAllocation = async ({
    balances,
    testnet,
    amount,
    destinationChain,
    address,
  }: {
    balances: IAccountBalance[];
    amount: string;
    destinationChain: number;
    testnet: any;
    address: string;
  }) => {
    return (
      await axios.post(
        `${GATEWAY_HOST}/calculate-allocation`,
        {
          balances,
          amount,
          destinationChain,
          address,
        },
        {
          headers: {
            testnet,
          },
        }
      )
    ).data.result;
  };
}
export const payWidgetService = new PayWidgetService();
