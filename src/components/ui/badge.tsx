import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm [a&]:hover:bg-primary/90 [a&]:hover:shadow-md",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground shadow-sm [a&]:hover:bg-secondary/90 [a&]:hover:shadow-md",
        destructive:
          "border-transparent bg-destructive text-white shadow-sm [a&]:hover:bg-destructive/90 [a&]:hover:shadow-md focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground border-border shadow-sm [a&]:hover:bg-accent [a&]:hover:text-accent-foreground [a&]:hover:shadow-md",
        success:
          "border-transparent bg-green-600 text-white shadow-sm [a&]:hover:bg-green-700 [a&]:hover:shadow-md",
        warning:
          "border-transparent bg-yellow-600 text-white shadow-sm [a&]:hover:bg-yellow-700 [a&]:hover:shadow-md",
        info:
          "border-transparent bg-blue-600 text-white shadow-sm [a&]:hover:bg-blue-700 [a&]:hover:shadow-md",
        purple:
          "border-transparent bg-purple-600 text-white shadow-sm [a&]:hover:bg-purple-700 [a&]:hover:shadow-md",
        pink:
          "border-transparent bg-pink-600 text-white shadow-sm [a&]:hover:bg-pink-700 [a&]:hover:shadow-md",
        gray:
          "border-transparent bg-gray-600 text-white shadow-sm [a&]:hover:bg-gray-700 [a&]:hover:shadow-md",
      },
      size: {
        default: "px-3 py-1 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-4 py-1.5 text-sm",
        xl: "px-5 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

// Variante para badges com ícones
function BadgeWithIcon({ 
  icon, 
  children, 
  className, 
  variant = "default",
  size = "default",
  ...props 
}: React.ComponentProps<"span"> & { 
  icon: React.ReactNode
  variant?: VariantProps<typeof badgeVariants>["variant"]
  size?: VariantProps<typeof badgeVariants>["size"]
}) {
  return (
    <Badge
      variant={variant}
      size={size}
      className={cn("gap-2", className)}
      {...props}
    >
      {icon}
      {children}
    </Badge>
  )
}

// Variante para badges de status
function StatusBadge({ 
  status, 
  children, 
  className,
  ...props 
}: React.ComponentProps<"span"> & { 
  status: "online" | "offline" | "away" | "busy" | "pending" | "completed" | "error"
}) {
  const statusVariants = {
    online: "success",
    offline: "gray",
    away: "warning",
    busy: "destructive",
    pending: "warning",
    completed: "success",
    error: "destructive",
  } as const

  return (
    <Badge
      variant={statusVariants[status]}
      className={cn("gap-1.5", className)}
      {...props}
    >
      <div className={cn(
        "size-1.5 rounded-full",
        status === "online" && "bg-green-400",
        status === "offline" && "bg-gray-400",
        status === "away" && "bg-yellow-400",
        status === "busy" && "bg-red-400",
        status === "pending" && "bg-yellow-400",
        status === "completed" && "bg-green-400",
        status === "error" && "bg-red-400",
      )} />
      {children}
    </Badge>
  )
}

// Variante para badges de contador
function CountBadge({ 
  count, 
  max = 99, 
  className,
  variant = "default",
  size = "default",
  ...props 
}: React.ComponentProps<"span"> & { 
  count: number
  max?: number
  variant?: VariantProps<typeof badgeVariants>["variant"]
  size?: VariantProps<typeof badgeVariants>["size"]
}) {
  const displayCount = count > max ? `${max}+` : count.toString()

  return (
    <Badge
      variant={variant}
      size={size}
      className={cn("min-w-[1.5rem] justify-center", className)}
      {...props}
    >
      {displayCount}
    </Badge>
  )
}

export { Badge, BadgeWithIcon, StatusBadge, CountBadge, badgeVariants }
