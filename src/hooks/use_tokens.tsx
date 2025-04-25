import { payWidgetService } from "../services";
import { useQuery } from "@tanstack/react-query";

export const useTokens = () => {
  const tokens = useQuery({
    queryKey: ["tokens"],
    queryFn: () => payWidgetService.GetAllTokens(),
  });
  return (tokens.data || []).reduce((obj: any, prop: any) => {
    if (!obj[prop.chainId]) {
      obj[prop.chainId] = {};
    }
    obj[prop.chainId][prop.tokenAddress] = prop;
    return obj;
  }, {});
};
