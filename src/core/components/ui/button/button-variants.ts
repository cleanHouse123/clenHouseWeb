import { cva } from "class-variance-authority";

export const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                primary: "bg-primary text-primary-foreground hover:bg-[var(--accent)] disabled:bg-[var(--disabled)] disabled:text-[var(--primary-foreground)] disabled:cursor-not-allowed rounded-lg [--radius:12px]",
                outline: "bg-white border-[1.5px] border-primary text-primary hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:border-[var(--disabled)] disabled:text-[var(--disabled)] disabled:cursor-not-allowed rounded-lg [--radius:10px]",
                ghost: "bg-transparent text-[rgba(0,0,0,0.9)] hover:bg-muted/50 disabled:bg-[var(--disabled)] disabled:text-[var(--primary-foreground)] disabled:cursor-not-allowed",
            },
            size: {
                sm: "px-3 py-1.5 text-xs rounded-[6px]",
                md: "px-4 py-2 text-sm rounded-[8px]",
                lg: "px-5 py-3 text-[16px] leading-[1.4] rounded-[12px]",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);


