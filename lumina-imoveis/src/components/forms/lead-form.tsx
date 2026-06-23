'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { leadSchema, type LeadFormValues } from '@/lib/validations'
import { createLeadAction } from '@/app/actions/lead.actions'
import { cn } from '@/lib/utils'

interface LeadFormProps {
  propertyId?: string
  propertyTitle?: string
  source?: string
  variant?: 'light' | 'dark'
  className?: string
}

export function LeadForm({
  propertyId,
  propertyTitle,
  source = 'site',
  variant = 'light',
  className,
}: LeadFormProps) {
  const [success, setSuccess] = useState(false)
  const dark = variant === 'dark'

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { propertyId, propertyTitle, source },
  })

  async function onSubmit(values: LeadFormValues) {
    const res = await createLeadAction(values)
    if (res.ok) {
      setSuccess(true)
      reset({ propertyId, propertyTitle, source })
      setTimeout(() => setSuccess(false), 6000)
    } else if (res.fieldErrors) {
      Object.entries(res.fieldErrors).forEach(([key, msgs]) =>
        setError(key as keyof LeadFormValues, { message: msgs?.[0] }),
      )
    }
  }

  if (success) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-2xl p-10 text-center',
          dark ? 'glass-dark text-white' : 'bg-card',
          className,
        )}
      >
        <CheckCircle2 className="size-12 text-emerald-500" />
        <h3 className="font-display text-xl font-semibold">Recebemos seu contato!</h3>
        <p className={cn('text-sm', dark ? 'text-white/60' : 'text-muted-foreground')}>
          Um especialista LUMINA falará com você em breve.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-4', className)} noValidate>
      {propertyTitle && (
        <p className={cn('text-sm', dark ? 'text-white/60' : 'text-muted-foreground')}>
          Sobre: <span className="font-medium text-gold">{propertyTitle}</span>
        </p>
      )}
      <Field label="Nome completo" error={errors.name?.message} dark={dark}>
        <Input placeholder="Seu nome" {...register('name')} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="E-mail" error={errors.email?.message} dark={dark}>
          <Input type="email" placeholder="voce@email.com" {...register('email')} />
        </Field>
        <Field label="Telefone / WhatsApp" error={errors.phone?.message} dark={dark}>
          <Input placeholder="(11) 99999-0000" {...register('phone')} />
        </Field>
      </div>
      <Field label="Mensagem (opcional)" error={errors.message?.message} dark={dark}>
        <Textarea placeholder="Conte o que você procura…" {...register('message')} />
      </Field>

      <Button type="submit" variant="gold" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Enviando…
          </>
        ) : (
          <>
            <Send className="size-4" /> Quero ser contatado
          </>
        )}
      </Button>
      <p className={cn('text-center text-xs', dark ? 'text-white/40' : 'text-muted-foreground')}>
        Ao enviar, você concorda em ser contatado pela equipe LUMINA.
      </p>
    </form>
  )
}

function Field({
  label,
  error,
  dark,
  children,
}: {
  label: string
  error?: string
  dark: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className={dark ? 'text-white/80' : undefined}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
