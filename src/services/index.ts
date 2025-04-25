import axios from "redaxios";

const GATEWAY_HOST = "http://localhost:4000/api"; //"https://dev-api.cray.network/api";
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
  GetAllTokens = async () => {
    return (await axios.get(`${GATEWAY_HOST}/tokens`)).data.result;
  };
  GetUserBalance = async (address: string) => {
    return (await axios.get(`${GATEWAY_HOST}/get-balance/${address}`)).data
      .result;
  };
  GetAllocationOrder = async () => {
    return (await axios.get(`${GATEWAY_HOST}/allocation-order`)).data.result;
  };
}
export const payWidgetService = new PayWidgetService();
