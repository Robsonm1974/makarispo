import * as React from "react"
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted animate-pulse rounded-xl", className)}
      {...props}
    />
  )
}

// Variante para skeleton de texto
function SkeletonText({ 
  lines = 1, 
  className, 
  ...props 
}: React.ComponentProps<"div"> & {
  lines?: number
}) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-muted animate-pulse rounded-lg",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
          style={{ height: "1rem" }}
        />
      ))}
    </div>
  )
}

// Variante para skeleton de título
function SkeletonTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton-title"
      className={cn("bg-muted animate-pulse rounded-lg w-3/4", className)}
      style={{ height: "1.5rem" }}
      {...props}
    />
  )
}

// Variante para skeleton de parágrafo
function SkeletonParagraph({ 
  lines = 3, 
  className, 
  ...props 
}: React.ComponentProps<"div"> & {
  lines?: number
}) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-muted animate-pulse rounded-lg",
            i === lines - 1 ? "w-2/3" : "w-full"
          )}
          style={{ height: "1rem" }}
        />
      ))}
    </div>
  )
}

// Variante para skeleton de avatar
function SkeletonAvatar({ 
  size = "default", 
  className, 
  ...props 
}: React.ComponentProps<"div"> & {
  size?: "sm" | "default" | "lg" | "xl"
}) {
  const sizeClasses = {
    sm: "size-8",
    default: "size-10",
    lg: "size-16",
    xl: "size-24"
  }

  return (
    <div
      data-slot="skeleton-avatar"
      className={cn(
        "bg-muted animate-pulse rounded-full",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}

// Variante para skeleton de card
function SkeletonCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton-card"
      className={cn(
        "bg-card border border-border/50 rounded-2xl p-6 space-y-4",
        className
      )}
      {...props}
    >
      <div className="flex items-center space-x-4">
        <SkeletonAvatar size="lg" />
        <div className="space-y-2 flex-1">
          <SkeletonTitle />
          <SkeletonText lines={1} />
        </div>
      </div>
      <SkeletonParagraph lines={2} />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  )
}

// Variante para skeleton de tabela
function SkeletonTable({ 
  rows = 5, 
  columns = 4, 
  className, 
  ...props 
}: React.ComponentProps<"div"> & {
  rows?: number
  columns?: number
}) {
  return (
    <div
      data-slot="skeleton-table"
      className={cn(
        "bg-card border border-border/50 rounded-xl overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="bg-muted/30 px-4 py-3 border-b border-border/50">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={i}
              className="bg-muted animate-pulse rounded-lg flex-1"
              style={{ height: "1rem" }}
            />
          ))}
        </div>
      </div>
      {/* Rows */}
      <div className="divide-y divide-border/50">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-4 py-3">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className={cn(
                    "bg-muted animate-pulse rounded-lg",
                    colIndex === 0 ? "w-1/3" : "flex-1"
                  )}
                  style={{ height: "1rem" }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Variante para skeleton de lista
function SkeletonList({ 
  items = 5, 
  className, 
  ...props 
}: React.ComponentProps<"div"> & {
  items?: number
}) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <SkeletonAvatar size="sm" />
          <div className="space-y-1 flex-1">
            <SkeletonTitle />
            <SkeletonText lines={1} />
          </div>
        </div>
      ))}
    </div>
  )
}

// Variante para skeleton de formulário
function SkeletonForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      <div className="space-y-4">
        <SkeletonTitle />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-4">
        <SkeletonTitle />
        <Skeleton className="h-20 w-full" />
      </div>
      <div className="flex space-x-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  )
}

export { 
  Skeleton, 
  SkeletonText, 
  SkeletonTitle, 
  SkeletonParagraph, 
  SkeletonAvatar, 
  SkeletonCard, 
  SkeletonTable, 
  SkeletonList, 
  SkeletonForm 
}
