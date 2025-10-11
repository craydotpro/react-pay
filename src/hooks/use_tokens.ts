import { useQuery } from "@tanstack/react-query";
import { tokenService } from "../cray-widget/services/token";
import { useMemo } from "react";

export const useTokens = () => {
  const tokens = useQuery({
    queryKey: ["tokens"],
    queryFn: () => tokenService.GetAll(),
  });
  return useMemo(() => {
    if (tokens.isLoading) return { isLoading: true, data: {} };
    const tokenMap = (tokens as any).data
      .filter((_) => _.name === "USDC")
      .reduce((obj, prop) => {
        obj[prop.chainId] = prop;
        return obj;
      }, {});
    return {
      data: tokenMap,
    };
  }, [tokens.data]);
};
