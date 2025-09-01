"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-tight font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-foreground",
        className
      )}
      {...props}
    />
  )
}

// Variante para labels pequenos
function LabelSmall({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label-small"
      className={cn(
        "flex items-center gap-1.5 text-xs leading-tight font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-foreground",
        className
      )}
      {...props}
    />
  )
}

// Variante para labels grandes
function LabelLarge({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label-large"
      className={cn(
        "flex items-center gap-2 text-base leading-tight font-semibold select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-foreground",
        className
      )}
      {...props}
    />
  )
}

// Variante para labels com ícone
function LabelWithIcon({
  icon,
  className,
  children,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & {
  icon: React.ReactNode
}) {
  return (
    <LabelPrimitive.Root
      data-slot="label-with-icon"
      className={cn(
        "flex items-center gap-2 text-sm leading-tight font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-foreground",
        className
      )}
      {...props}
    >
      <span className="text-muted-foreground">{icon}</span>
      {children}
    </LabelPrimitive.Root>
  )
}

// Variante para labels de seção
function SectionLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="section-label"
      className={cn(
        "flex items-center gap-2 text-lg leading-tight font-semibold select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-foreground tracking-tight",
        className
      )}
      {...props}
    />
  )
}

// Variante para labels de grupo
function GroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="group-label"
      className={cn(
        "flex items-center gap-2 text-sm leading-tight font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

// Variante para labels com badge
function LabelWithBadge({
  badge,
  className,
  children,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & {
  badge: React.ReactNode
}) {
  return (
    <LabelPrimitive.Root
      data-slot="label-with-badge"
      className={cn(
        "flex items-center gap-2 text-sm leading-tight font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-foreground",
        className
      )}
      {...props}
    >
      {children}
      {badge}
    </LabelPrimitive.Root>
  )
}

// Variante para labels com descrição
function LabelWithDescription({
  description,
  className,
  children,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & {
  description?: string
}) {
  return (
    <div className="space-y-1">
      <LabelPrimitive.Root
        data-slot="label-with-description"
        className={cn(
          "flex items-center gap-2 text-sm leading-tight font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </LabelPrimitive.Root>
      {description && (
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}

export { 
  Label, 
  LabelSmall, 
  LabelLarge, 
  LabelWithIcon, 
  SectionLabel, 
  GroupLabel, 
  LabelWithBadge, 
  LabelWithDescription 
}
