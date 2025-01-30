const INTERVAL = 100;
export const waitTillInitialization = (cb: Function) => {
  return new Promise((resolve) => {
    const checkInitialization = () => {
      const value = cb();
      if (value) {
        /* if initialized */
        clearInterval(interval);
        resolve(value || true);
      }
    };
    let interval = setInterval(checkInitialization, INTERVAL);
    checkInitialization();
  }) as any;
};
export const _sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), ms));
