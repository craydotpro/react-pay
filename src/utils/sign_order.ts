import { CHAINS } from "../config/chains";
import { _sleep } from "./";

export const signOrder = async ({
  order,
  signTypedDataAsync,
  switchNetwork,
}: {
  order: any;
  signTypedDataAsync: Function;
  switchNetwork: Function;
}) => {
  const signedApprovalData = [];
  for (let i = 0; i < order.allowance?.length; i++) {
    const data = order.allowance[i];
    await switchNetwork(CHAINS[data.domainData.chainId]);
    await _sleep(2000); // delay between chain change
    let signature = await signTypedDataAsync({
      types: data.types,
      domain: data.domainData,
      message: data.values as any,
      primaryType: "Permit" as any,
    });
    const r = signature.slice(0, 66);
    const s = "0x" + signature.slice(66, 130);
    const v = "0x" + signature.slice(130, 132);
    signedApprovalData.push({
      r,
      s,
      v,
      chainId: data.domainData.chainId,
      verifyingContract: data.domainData.verifyingContract,
      walletAddress: order.typedOrder.message.sender,
      value: data.values.value,
      deadline: data.values.deadline,
    });
  }
  const signedOrder = {
    data: await signTypedDataAsync(order.typedOrder),
  };
  return {
    signedOrder,
    signedApprovalData,
  };
};
