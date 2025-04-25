const Coins = ({ tokens }: { tokens: Record<string, string>[] }) => {
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
