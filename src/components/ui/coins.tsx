import type { IOrderAllocation } from "../../interfaces";

const Coins = ({ tokens }: { tokens: IOrderAllocation[] }) => {
  return (
    <div className="flex">
      {tokens?.map((token, i) => (
        <img
          key={token?.tokenAddress}
          src={token?.icon}
          className={`${i !== 0 && "-ml-[10px]"}`}
        />
      ))}
    </div>
  );
};
export default Coins;
