import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodType, z } from 'zod'
import { designTokens } from '../../styles/design-tokens'

interface FormProps<T> {
  schema: ZodType<T>
  defaultValues: Partial<T>
  onSubmit: (data: T) => void
  children: React.ReactNode
}

export function Form<T>({ schema, defaultValues, onSubmit, children }: FormProps<T>) {
  const methods = useForm<T>({ resolver: zodResolver(schema as z.ZodTypeAny), defaultValues: defaultValues as T })
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        style={{ display: 'grid', gap: designTokens.spacing.md }}
      >
        {children}
      </form>
    </FormProvider>
  )
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
}

export const Field: React.FC<FieldProps> = ({ name, label, ...props }) => {
  const { register, formState } = (FormProvider as any)._context._currentValue
  const error = formState?.errors?.[name]?.message as string | undefined
  return (
    <label style={{ display: 'grid', gap: 6, color: designTokens.colors.text }}>
      <span style={{ fontSize: 12, opacity: 0.9 }}>{label}</span>
      <input
        {...register(name)}
        {...props}
        style={{
          background: '#0b1424',
          border: '1px solid #1E293B',
          color: designTokens.colors.text,
          borderRadius: 8,
          padding: '10px 12px'
        }}
      />
      {error && <span style={{ color: designTokens.colors.danger, fontSize: 12 }}>{error}</span>}
    </label>
  )
}

export default Form

