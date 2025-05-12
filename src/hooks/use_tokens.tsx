import { payWidgetService } from "../services";
import { useQuery } from "@tanstack/react-query";

export const useTokens = ({ testnet }: { testnet: boolean }) => {
  const tokens = useQuery({
    queryKey: ["tokens"],
    queryFn: () => payWidgetService.GetAllTokens({ testnet }),
  });
  return (tokens.data || []).reduce((obj: any, prop: any) => {
    if (!obj[prop.chainId]) {
      obj[prop.chainId] = {};
    }
    obj[prop.chainId][prop.tokenAddress] = prop;
    return obj;
  }, {});
};
