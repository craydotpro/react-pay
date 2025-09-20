import { twMerge } from "tailwind-merge";

export const Loading = ({
  className,
  size = "24",
}: {
  className?: string;
  size?: string;
}) => {
  return (
    <svg
      className={twMerge(" animate-spin-slow", className)}
      width={size}
      height={size}
      viewBox="0 0 55 57"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M28 2V8.66667M28 44V54.6667M11.3333 28H2M52.6667 28H48.6667M45.219 45.219L43.3333 43.3333M45.7712 10.4421L42 14.2133M9.12419 46.8758L16.6667 39.3333M9.67648 9.88981L15.3333 15.5467"
        stroke="#FA6800"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
