import * as chains from "viem/chains";

export const CHAINS = Object.keys(chains).reduce((obj, prop) => {
  //@ts-ignore
  obj[chains[prop].id] = chains[prop];
  return obj;
}, {}) as Record<number, (typeof chains)[keyof typeof chains]>;
