import { ReactNode } from "react";
import { Loading } from "./loading";

export default function SuspenceLoader({
  hidden,
  loader,
  children,
  label,
}: {
  hidden?: boolean;
  loader?: ReactNode;
  children?: ReactNode;
  label?: string;
}) {
  return (
    <div
      hidden={hidden}
      className="flex items-center flex-col justify-center h-full w-full bg-white top-0 left-0 gap-4 px-4"
    >
      <div className=" text-black px-4 text-center flex flex-col gap-2">
        {children}
      </div>

      {loader || <Loading className="fill-[#FA6800]" size="64" />}
      <p>{label}</p>
    </div>
  );
}
