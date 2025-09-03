"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border/50 shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

// Variante para separador sutil
function SeparatorSubtle({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-subtle"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border/30 shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

// Variante para separador forte
function SeparatorStrong({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-strong"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

// Variante para separador com gradiente
function SeparatorGradient({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-gradient"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-gradient-to-r from-transparent via-border/50 to-transparent shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

// Variante para separador com texto
function SeparatorWithText({
  children
}: React.ComponentProps<typeof SeparatorPrimitive.Root> & {
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center space-x-3">
      <SeparatorSubtle className="flex-1" />
      <span className="text-xs text-muted-foreground font-medium px-2">
        {children}
      </span>
      <SeparatorSubtle className="flex-1" />
    </div>
  )
}

// Variante para separador com ícone
function SeparatorWithIcon({
  icon
}: React.ComponentProps<typeof SeparatorPrimitive.Root> & {
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-center space-x-3">
      <SeparatorSubtle className="flex-1" />
      <div className="text-muted-foreground">
        {icon}
      </div>
      <SeparatorSubtle className="flex-1" />
    </div>
  )
}

// Variante para separador de seção
function SectionSeparator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="section-separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border/30 shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-6",
        className
      )}
      {...props}
    />
  )
}

// Variante para separador de item
function ItemSeparator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="item-separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border/20 shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

// Variante para separador decorativo
function DecorativeSeparator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="decorative-separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-gradient-to-r from-transparent via-primary/20 to-transparent shrink-0 data-[orientation=horizontal]:h-0.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-0.5",
        className
      )}
      {...props}
    />
  )
}

export { 
  Separator, 
  SeparatorSubtle, 
  SeparatorStrong, 
  SeparatorGradient, 
  SeparatorWithText, 
  SeparatorWithIcon, 
  SectionSeparator, 
  ItemSeparator, 
  DecorativeSeparator 
}
