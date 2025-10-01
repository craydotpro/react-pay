import copy from "copy-to-clipboard";
import { useState, type ReactNode } from "react";
import { Copy } from "lucide-react";
import { twMerge } from "tailwind-merge";

export const CopyButton = ({
  value,
  iconClass = "",
  children,
}: {
  value: string | number;
  iconClass?: string;
  children?: ReactNode;
}) => {
  const [label, setLabel] = useState("");
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    copy(String(value));
    setLabel("Copied!");
    setTimeout(() => {
      setLabel("");
    }, 1000);
    e.stopPropagation();
  };
  return (
    <div
      className={`relative flex items-center text-gray-600  before:absolute before:w-20 before:bg-white before:text-center before:bg-light-100 before:rounded-md before:shadow before:border before:px-3 before:py-1 before:-top-7 before:left-1/2 before:-translate-x-1/2 before:content-[attr(data-label)] ${
        !label ? "before:hidden" : ""
      }`}
      data-label={label}
    >
      <button onClick={handleClick}>
        {children || (
          <Copy width={16} className={twMerge("text-primary", iconClass)} />
        )}
      </button>
    </div>
  );
};
