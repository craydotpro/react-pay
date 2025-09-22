// @ts-nocheck

export const ENV = {
  VITE_API_HOST:
    import.meta.env?.VITE_API_HOST || (process.env as any)?.env?.VITE_API_HOST,
  VITE_GATEWAY_API_KEY:
    import.meta.env?.VITE_GATEWAY_API_KEY ||
    (process.env as any)?.env?.VITE_GATEWAY_API_KEY,
  VITE_WALLET_KIT_PROJECT_ID:
    import.meta.env?.VITE_WALLET_KIT_PROJECT_ID ||
    (process.env as any)?.env?.VITE_WALLET_KIT_PROJECT_ID,
};
console.log(123, ENV);
