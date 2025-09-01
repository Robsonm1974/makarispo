"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-3", className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive font-medium", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm leading-relaxed", className)}
      {...props}
    />
  )
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : props.children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-destructive text-sm font-medium", className)}
      {...props}
    >
      {body}
    </p>
  )
}

// Variante para formulários com layout em grid
function FormGrid({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-grid"
      className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}
      {...props}
    />
  )
}

// Variante para formulários compactos
function FormCompact({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-compact"
      className={cn("space-y-4", className)}
      {...props}
    />
  )
}

// Variante para formulários com seções
function FormSection({ 
  title, 
  description, 
  className, 
  children, 
  ...props 
}: React.ComponentProps<"div"> & {
  title?: string
  description?: string
}) {
  return (
    <div
      data-slot="form-section"
      className={cn("space-y-4 p-6 rounded-xl border border-border/50 bg-card/50", className)}
      {...props}
    >
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

// Variante para grupos de campos relacionados
function FormGroup({ 
  title, 
  className, 
  children, 
  ...props 
}: React.ComponentProps<"div"> & {
  title?: string
}) {
  return (
    <div
      data-slot="form-group"
      className={cn("space-y-3", className)}
      {...props}
    >
      {title && (
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      )}
      <div className="space-y-3">
        {children}
      </div>
    </div>
  )
}

// Variante para campos obrigatórios
function FormRequired({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="form-required"
      className={cn("text-destructive ml-1", className)}
      {...props}
    >
      *
    </span>
  )
}

// Variante para campos opcionais
function FormOptional({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="form-optional"
      className={cn("text-muted-foreground ml-1 text-xs", className)}
      {...props}
    >
      (opcional)
    </span>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormGrid,
  FormCompact,
  FormSection,
  FormGroup,
  FormRequired,
  FormOptional,
}
