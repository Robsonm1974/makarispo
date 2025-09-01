import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-20 w-full rounded-xl border bg-transparent px-4 py-3 text-base shadow-sm transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none hover:border-border/80",
        className
      )}
      {...props}
    />
  )
}

// Variante para textarea pequeno
function TextareaSmall({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea-small"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-lg border bg-transparent px-3 py-2 text-sm shadow-sm transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none hover:border-border/80",
        className
      )}
      {...props}
    />
  )
}

// Variante para textarea grande
function TextareaLarge({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea-large"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-32 w-full rounded-xl border bg-transparent px-4 py-3 text-base shadow-sm transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none hover:border-border/80",
        className
      )}
      {...props}
    />
  )
}

// Variante para textarea com contador de caracteres
function TextareaWithCounter({ 
  maxLength, 
  className, 
  ...props 
}: React.ComponentProps<"textarea"> & {
  maxLength: number
}) {
  const [charCount, setCharCount] = React.useState(0)

  return (
    <div className="relative">
      <textarea
        data-slot="textarea-with-counter"
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-20 w-full rounded-xl border bg-transparent px-4 py-3 text-base shadow-sm transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none hover:border-border/80 pb-8",
          className
        )}
        onChange={(e) => {
          setCharCount(e.target.value.length)
          props.onChange?.(e)
        }}
        maxLength={maxLength}
        {...props}
      />
      <div className="absolute bottom-2 right-3 text-xs text-muted-foreground">
        {charCount}/{maxLength}
      </div>
    </div>
  )
}

// Variante para textarea com placeholder animado
function TextareaWithPlaceholder({ 
  placeholder, 
  className, 
  ...props 
}: React.ComponentProps<"textarea"> & {
  placeholder: string
}) {
  return (
    <div className="relative">
      <textarea
        data-slot="textarea-with-placeholder"
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-20 w-full rounded-xl border bg-transparent px-4 py-3 text-base shadow-sm transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none hover:border-border/80",
          className
        )}
        placeholder={placeholder}
        {...props}
      />
    </div>
  )
}

// Variante para textarea com label flutuante
function TextareaWithFloatingLabel({ 
  label, 
  className, 
  ...props 
}: React.ComponentProps<"textarea"> & {
  label: string
}) {
  const [isFocused, setIsFocused] = React.useState(false)
  const [hasValue, setHasValue] = React.useState(false)

  return (
    <div className="relative">
      <textarea
        data-slot="textarea-with-floating-label"
        className={cn(
          "border-input placeholder:text-transparent focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-20 w-full rounded-xl border bg-transparent px-4 pt-6 pb-3 text-base shadow-sm transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none hover:border-border/80",
          className
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false)
          setHasValue(e.target.value.length > 0)
        }}
        onChange={(e) => setHasValue(e.target.value.length > 0)}
        {...props}
      />
      <label className={cn(
        "absolute left-4 top-3 text-sm text-muted-foreground transition-all duration-200 pointer-events-none",
        (isFocused || hasValue) && "text-xs text-primary -translate-y-1"
      )}>
        {label}
      </label>
    </div>
  )
}

export { 
  Textarea, 
  TextareaSmall, 
  TextareaLarge, 
  TextareaWithCounter, 
  TextareaWithPlaceholder, 
  TextareaWithFloatingLabel 
}
