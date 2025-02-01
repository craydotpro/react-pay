import axios from "redaxios";

const GATEWAY_HOST = "https://dev-api.cray.network/api";
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
      await axios.post(`${GATEWAY_HOST}/create-order`, data, {
        headers: {
          apiKey,
          testnet,
        },
      })
    ).data.result;
  };
}
export const payWidgetService = new PayWidgetService();
