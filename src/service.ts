import axios from "redaxios";
const GATEWAY_HOST = {
  testnet: "https://dev-api.cray.network/api",
  mainnet: "https://dev.cray.network/api",
};

class PayWidgetService {
  Status = async ({
    orderId,
    apiKey,
    istestnet,
  }: {
    orderId: string;
    apiKey: string;
    istestnet: any;
  }) => {
    const host = istestnet ? GATEWAY_HOST.testnet : GATEWAY_HOST.mainnet;
    return (
      await axios.get(`${host}/order-status-by-order-id/${orderId}`, {
        headers: {
          apiKey,
          istestnet,
        },
      })
    ).data.result;
  };
  Create = async ({
    data,
    istestnet,
    apiKey,
  }: {
    data: any;
    istestnet: any;
    apiKey: string;
  }) => {
    const host = istestnet ? GATEWAY_HOST.testnet : GATEWAY_HOST.mainnet;
    return (
      await axios.post(`${host}/create-order`, data, {
        headers: {
          apiKey,
          istestnet,
        },
      })
    ).data.result;
  };
}
export const payWidgetService = new PayWidgetService();
