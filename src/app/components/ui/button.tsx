import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justfiy-center whitespace-nowrap rounded-full text-base font-semibold ring-offset-white transition-colors cursor-pointer",  
  {
    variants: {
      variant: {
        default: "bg-primary-foreground text-primary hover:bg-primary-foreground/90",
        primary: "bg-primary text-white hover:bg-primary-hover",
        accent: "bg-accent text-primary hover:bg-accent-hover",
        outline: "border border-accent bg-transparent text-accent hover:bg-accent-hover hover:text-primary",
        action: "bg-primary text-red-500 hover:ring-2 hover:ring-red-500 hover:text-white",
        destructive: "bg-red-500 text-white hover:bg-red-600",
      },
      size: {
        default: "h-[44px] px-6",
        sm: "h-9 rounded-md px-3",
        lg: "h-[48px] px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 