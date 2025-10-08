import { xhr } from "../../utils";

class TokenService {
  GetAll = async () => (await xhr.get(`/tokens`)).data;
}
export const tokenService = new TokenService();
