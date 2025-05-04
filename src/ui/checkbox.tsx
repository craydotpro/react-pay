import { useEffect, useState } from "react";

const Checkbox = ({
  checked,
  onChange = () => {},
}: {
  checked: boolean;
  onChange?: Function;
}) => {
  const [checked_, setChecked_] = useState(checked);
  if (checked !== checked_) {
    setChecked_(checked);
  }
  useEffect(() => {
    if (checked !== checked_) {
      onChange(checked_);
    }
  }, [checked_]);
  return (
    <svg
      onClick={() => setChecked_(!checked_)}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {checked_ ? (
        <>
          <g filter="url(#filter0_ii_63_561)">
            <rect x="1" y="1" width="16" height="16" rx="4" fill="#FA6800" />
            <rect x="1" y="1" width="16" height="16" rx="4" stroke="#FA6800" />
            <path
              d="M13 6L7.5 11.5L5 9"
              stroke="white"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <filter
              id="filter0_ii_63_561"
              x="0.5"
              y="-1.5"
              width="17"
              height="21"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.828614 0 0 0 0 0.3463 0 0 0 0 0.00273327 0 0 0 1 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect1_innerShadow_63_561"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="-2" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.827451 0 0 0 0 0.345098 0 0 0 0 0.00392157 0 0 0 1 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_innerShadow_63_561"
                result="effect2_innerShadow_63_561"
              />
            </filter>
          </defs>
        </>
      ) : (
        <>
          <rect x="1" y="1" width="16" height="16" rx="4" fill="#F2F5F8" />
          <rect x="1" y="1" width="16" height="16" rx="4" stroke="#CACFD8" />
        </>
      )}
    </svg>
  );
};
export default Checkbox;
