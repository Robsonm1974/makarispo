"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full ring-2 ring-border/20 transition-all duration-200",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full text-sm font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

// Variante para avatares pequenos
function AvatarSmall({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar-small"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full ring-2 ring-border/20 transition-all duration-200",
        className
      )}
      {...props}
    />
  )
}

// Variante para avatares grandes
function AvatarLarge({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar-large"
      className={cn(
        "relative flex size-16 shrink-0 overflow-hidden rounded-full ring-2 ring-border/20 transition-all duration-200",
        className
      )}
      {...props}
    />
  )
}

// Variante para avatares extra grandes
function AvatarXLarge({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar-xlarge"
      className={cn(
        "relative flex size-24 shrink-0 overflow-hidden rounded-full ring-2 ring-border/20 transition-all duration-200",
        className
      )}
      {...props}
    />
  )
}

// Variante para avatares com borda colorida
function AvatarWithStatus({
  status,
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  status: "online" | "offline" | "away" | "busy"
}) {
  const statusColors = {
    online: "ring-green-500",
    offline: "ring-gray-400",
    away: "ring-yellow-500",
    busy: "ring-red-500",
  }

  return (
    <AvatarPrimitive.Root
      data-slot="avatar-with-status"
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full ring-2 ring-border/20 transition-all duration-200",
        statusColors[status],
        className
      )}
      {...props}
    />
  )
}

// Variante para avatares com hover effect
function AvatarInteractive({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar-interactive"
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full ring-2 ring-border/20 transition-all duration-200 hover:ring-primary/50 hover:scale-105 cursor-pointer",
        className
      )}
      {...props}
    />
  )
}

// Componente para grupo de avatares
function AvatarGroup({
  children,
  className,
  max = 4,
  ...props
}: React.ComponentProps<"div"> & {
  children: React.ReactNode
  max?: number
}) {
  const avatars = React.Children.toArray(children)
  const visibleAvatars = avatars.slice(0, max)
  const hiddenCount = avatars.length - max

  return (
    <div
      data-slot="avatar-group"
      className={cn("flex -space-x-2", className)}
      {...props}
    >
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          className="ring-2 ring-background rounded-full"
        >
          {avatar}
        </div>
      ))}
      {hiddenCount > 0 && (
        <div className="flex size-10 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground ring-2 ring-background">
          +{hiddenCount}
        </div>
      )}
    </div>
  )
}

export { 
  Avatar, 
  AvatarImage, 
  AvatarFallback,
  AvatarSmall,
  AvatarLarge,
  AvatarXLarge,
  AvatarWithStatus,
  AvatarInteractive,
  AvatarGroup
}
