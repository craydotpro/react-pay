import { Loading } from "../../../components/ui/loading";
const QRProcessingPayment = () => {
  return (
    <div>
      <div className="h-96 md:h-48 bg-[#F8F9FC] flex flex-col items-center justify-center gap-5 pt-6 pb-9">
        <Loading size="64" className="fill-[#FA6800]" />
      </div>
      <div className="p-8 flex flex-col gap-2">
        <span className="text-center text-[28px] font-bold">
          Processing your payment
        </span>
        <span className="cray-label-lg font-medium text-slate-600 text-center">
          Hang tight - this will only take a moment.
        </span>
      </div>
    </div>
  );
};
export default QRProcessingPayment;
