import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../utils";

const buttonVariants = cva(
  "w-full font-semibold disabled:pointer-events-none border disabled:bg-gray-300 disabled:border-gray-200 disabled:shadow-none  active:opacity-70",
  {
    variants: {
      variant: {
        primary:
          "border-[#D05802] bg-[#FA6800] text-white shadow-[0px_2px_4px_0px_#c95502_inset,0px_-2px_4px_0px_#c95502_inset]",
        secondary: " hover:bg-gray-50 active:bg-gray-100 ",
        ghost: " hover:bg-gray-50 active:bg-gray-100 ",
      },
      size: {
        sm: "rounded-[8px] text-[18px]  p-2 ",
        xl: "rounded-[8px] text-[18px]  px-4  py-4 ",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "xl",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leadingIcon?: any;
  tralingIcon?: any;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading,
      children,
      leadingIcon,
      tralingIcon,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <>
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          // style={{
          //   boxShadow:
          //     "",
          // }}
          ref={ref}
          {...props}
          disabled={loading || props.disabled}
        >
          {leadingIcon ? <leadingIcon.type className="w-4" /> : null}
          {children}
          {tralingIcon ? <tralingIcon.type className="w-4" /> : null}
        </Comp>
      </>
    );
  }
);
Button.displayName = "Button";

export default Button;
