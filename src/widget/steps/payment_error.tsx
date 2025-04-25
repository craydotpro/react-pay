import Button from "../../ui/button";
import Footer from "../../ui/footer";

const PaymentError = () => {
  return (
    <div className="h-full">
      <div className=" bg-[#F8F9FC] flex flex-col items-center justify-center gap-5 pt-6 pb-9">
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.2008 6.80248C20.7687 8.0229 18.9881 8.76045 17.1125 8.91013C12.7355 9.25941 9.2599 12.735 8.91061 17.112C8.76094 18.9876 8.02339 20.7682 6.80297 22.2003C3.955 25.5422 3.955 30.4575 6.80297 33.7994C8.02339 35.2315 8.76094 37.0121 8.91061 38.8877C9.2599 43.2646 12.7355 46.7403 17.1125 47.0895C18.9881 47.2392 20.7687 47.9768 22.2008 49.1972C25.5427 52.0452 30.458 52.0452 33.7999 49.1972C35.232 47.9768 37.0126 47.2392 38.8882 47.0895C43.2651 46.7403 46.7408 43.2646 47.09 38.8877C47.2397 37.0121 47.9773 35.2315 49.1977 33.7994C52.0457 30.4575 52.0457 25.5422 49.1977 22.2003C47.9773 20.7682 47.2397 18.9876 47.09 17.112C46.7408 12.735 43.2651 9.25941 38.8882 8.91013C37.0126 8.76045 35.232 8.0229 33.7999 6.80248C30.458 3.95451 25.5427 3.95451 22.2008 6.80248Z"
            fill="#FFD5D8"
            stroke="#E93544"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M35 21L21 35M21 21L35 35"
            stroke="#E93544"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="flex flex-col gap-[6px] text-center max-w-[406px]">
          <h6 className="text-[#1D2939]">Payment Failed</h6>
          <span className="text-center text-slate-600">
            Sorry, your payment was not successful. Please try again or you can
            request a bug 👇🏻
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col">
        <Button variant="secondary">Report a Bug</Button>
      </div>
      <Footer />
    </div>
  );
};
export default PaymentError;
