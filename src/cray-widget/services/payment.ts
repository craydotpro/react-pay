import { xhr } from "../../utils";
import { ENV } from "../env";

class PaymentService {
  CreateOrder = async (payload: any) =>
    (await xhr.post("/orders", payload)).data;
  SubmitOrder = async (orderId: string, payload: any) =>
    (await xhr.post(`/orders/${orderId}`, payload)).data;
  ListenStatus = (orderId: string) =>
    new EventSource(
      import.meta.env.VITE_API_HOST + `/orders/${orderId}?sse=true`
    );
}
export const paymentService = new PaymentService();
