import { ArrowLeft } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { useBridgeStore } from "../store";

const SettingBottomSheet = ({
  showBridgeSettings,
  setShowBridgeSettings,
}: {
  showBridgeSettings: boolean;
  setShowBridgeSettings: Function;
}) => {
  const { testnet, changeNetwork } = useBridgeStore((state) => state);

  return (
    <div
      className={`h-full w-full absolute transition-all duration-150 p-4 bg-white z-10 ${
        showBridgeSettings ? "top-0" : "top-full"
      }`}
    >
      <div className="flex gap-4">
        <ArrowLeft
          className="btn"
          onClick={() => setShowBridgeSettings(false)}
        />
        <b>Settings</b>
      </div>
      <div className="flex flex-col flex-grow mt-2">
        <button
          className={`flex py-3 items-center justify-between gap-4 px-5 cursor-pointer border-b border-slate-200 ${
            testnet && "bg-slate-50"
          }`}
          onClick={() => changeNetwork(!testnet)}
        >
          <div className="flex items-center gap-4">
            <span className="cray-label-md font-bold">Testnet</span>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox checked={testnet} />
          </div>
        </button>
      </div>
    </div>
  );
};
export default SettingBottomSheet;
