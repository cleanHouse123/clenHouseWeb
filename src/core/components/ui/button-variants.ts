import { cva } from "class-variance-authority";


// Removed ADMIN_BUTTON_COLORS in favor of static Tailwind classes to avoid purge issues

export const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-[8px] text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-card-foreground text-card shadow hover:bg-muted-foreground",
                destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
                outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                "admin-primary": "bg-primary text-primary-foreground shadow hover:bg-primary/90 active:bg-primary/80",
                "admin-secondary": "bg-background text-primary border border-primary hover:bg-accent active:bg-secondary",
                "admin-tertiary": "bg-background text-primary hover:bg-accent active:bg-secondary",
                
            },
            size: {
                default: "h-12 px-5 py-3",
                sm: "h-8 rounded-[8px] px-3 text-base",
                lg: "h-10 rounded-[8px] px-8",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
); 