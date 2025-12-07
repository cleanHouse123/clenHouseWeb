import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/core/lib/utils"

const cardVariants = cva(
    "bg-card text-card-foreground",
    {
        variants: {
            radius: {
                r12: "rounded-[12px]",
                r16: "rounded-[16px]",
                r20: "rounded-[20px]",
                r24: "rounded-[24px]",
                r40: "rounded-[40px]",
            },
            padding: {
                none: "p-0",
                sm: "p-4",
                md: "p-5",
                lg: "p-7",
                xl: "p-12",
            },
            background: {
                card: "bg-card",
                white: "bg-white",
                muted: "bg-[var(--background)]",
                transparent: "bg-transparent",
            },
            bordered: {
                true: "border border-[var(--border)]",
                false: "border-0",
            },
            shadow: {
                true: "shadow-sm",
                false: "shadow-none",
            },
        },
        defaultVariants: {
            radius: "r20",
            padding: "md",
            background: "white",
            bordered: false,
            shadow: true,
        },
    }
)

export interface CardProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> { }

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, radius, padding, background, bordered, shadow, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(cardVariants({ radius, padding, background, bordered, shadow }), className)}
            {...props}
        />
    )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn("text-lg font-semibold leading-none tracking-tight text-center", className)}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("pt-4", className)} {...props} />
))
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }
