'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Save, Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { propertySchema, type PropertyFormValues } from '@/lib/validations'
import { LISTING_TYPES, PROPERTY_TYPES } from '@/lib/constants'
import { createPropertyAction, updatePropertyAction } from '@/app/actions/property.actions'
import type { Agent, Property } from '@/types'

interface PropertyFormProps {
  property?: Property
  agents: Agent[]
}

export function PropertyForm({ property, agents }: PropertyFormProps) {
  const router = useRouter()
  const isEdit = Boolean(property)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: property
      ? {
          ...property,
          tourUrl: property.tourUrl ?? '',
          videoUrl: property.videoUrl ?? '',
        }
      : {
          status: 'disponivel',
          listingType: 'compra',
          type: 'apartamento',
          featured: false,
          amenities: [],
          images: [{ url: '', alt: '' }],
          state: 'SP',
        },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'images' })

  async function onSubmit(values: PropertyFormValues) {
    setServerError(null)
    const payload = {
      ...values,
      amenities:
        typeof values.amenities === 'string'
          ? (values.amenities as string).split(',').map((s) => s.trim()).filter(Boolean)
          : values.amenities,
    }
    const res = isEdit
      ? await updatePropertyAction(property!.id, payload)
      : await createPropertyAction(payload)

    if (res.ok) {
      router.push('/admin/imoveis')
      router.refresh()
    } else {
      setServerError(res.error)
      if (res.fieldErrors) {
        Object.entries(res.fieldErrors).forEach(([k, msgs]) =>
          setError(k as keyof PropertyFormValues, { message: msgs?.[0] }),
        )
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-white" noValidate>
      {serverError && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="size-4" /> {serverError}
        </div>
      )}

      {/* Dados principais */}
      <Section title="Informações principais">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Título" error={errors.title?.message} className="sm:col-span-2">
            <Input placeholder="Ex.: Cobertura Duplex Vista Parque" {...register('title')} />
          </FormField>
          <FormField label="Finalidade" error={errors.listingType?.message}>
            <Select {...register('listingType')}>
              {LISTING_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Tipo" error={errors.type?.message}>
            <Select {...register('type')}>
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Descrição" error={errors.description?.message} className="sm:col-span-2">
            <Textarea rows={5} placeholder="Descreva o imóvel…" {...register('description')} />
          </FormField>
        </div>
      </Section>

      {/* Valores e características */}
      <Section title="Valores e características">
        <div className="grid gap-5 sm:grid-cols-3">
          <FormField label="Preço (R$)" error={errors.price?.message}>
            <Input type="number" step="0.01" {...register('price')} />
          </FormField>
          <FormField label="Área (m²)" error={errors.area?.message}>
            <Input type="number" {...register('area')} />
          </FormField>
          <FormField label="Status" error={errors.status?.message}>
            <Select {...register('status')}>
              <option value="disponivel">Disponível</option>
              <option value="reservado">Reservado</option>
              <option value="vendido">Vendido</option>
            </Select>
          </FormField>
          <FormField label="Quartos" error={errors.bedrooms?.message}>
            <Input type="number" {...register('bedrooms')} />
          </FormField>
          <FormField label="Suítes" error={errors.suites?.message}>
            <Input type="number" {...register('suites')} />
          </FormField>
          <FormField label="Banheiros" error={errors.bathrooms?.message}>
            <Input type="number" {...register('bathrooms')} />
          </FormField>
          <FormField label="Vagas de garagem" error={errors.garage?.message}>
            <Input type="number" {...register('garage')} />
          </FormField>
        </div>
      </Section>

      {/* Localização */}
      <Section title="Localização">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Cidade" error={errors.city?.message}>
            <Input {...register('city')} />
          </FormField>
          <FormField label="Estado (UF)" error={errors.state?.message}>
            <Input maxLength={2} {...register('state')} />
          </FormField>
          <FormField label="Bairro" error={errors.neighborhood?.message}>
            <Input {...register('neighborhood')} />
          </FormField>
          <FormField label="Endereço" error={errors.address?.message}>
            <Input {...register('address')} />
          </FormField>
        </div>
      </Section>

      {/* Imagens */}
      <Section title="Imagens">
        <div className="space-y-3">
          {fields.map((field, i) => (
            <div key={field.id} className="grid gap-3 sm:grid-cols-[2fr_1.5fr_auto]">
              <Input placeholder="URL da imagem" {...register(`images.${i}.url`)} />
              <Input placeholder="Descrição (alt)" {...register(`images.${i}.alt`)} />
              <button
                type="button"
                onClick={() => remove(i)}
                disabled={fields.length === 1}
                className="grid size-11 place-items-center rounded-xl bg-white/5 text-white/60 hover:bg-destructive/20 hover:text-destructive disabled:opacity-30"
                aria-label="Remover imagem"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
          {errors.images && (
            <p className="text-xs text-destructive">{errors.images.message as string}</p>
          )}
          <Button type="button" variant="outline" size="sm" onClick={() => append({ url: '', alt: '' })}>
            <Plus className="size-4" /> Adicionar imagem
          </Button>
        </div>
      </Section>

      {/* Extras */}
      <Section title="Extras">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Comodidades (separadas por vírgula)"
            error={errors.amenities?.message as string}
            className="sm:col-span-2"
          >
            <Input
              placeholder="Piscina, Academia, Sacada gourmet"
              {...register('amenities' as never)}
            />
          </FormField>
          <FormField label="Corretor responsável" error={errors.agentId?.message}>
            <Select {...register('agentId')}>
              <option value="">Nenhum</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="URL do tour 360°" error={errors.tourUrl?.message}>
            <Input placeholder="https://my.matterport.com/…" {...register('tourUrl')} />
          </FormField>
          <FormField label="URL do vídeo (embed)" error={errors.videoUrl?.message}>
            <Input placeholder="https://www.youtube.com/embed/…" {...register('videoUrl')} />
          </FormField>
          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 sm:col-span-2">
            <input type="checkbox" className="size-4 accent-gold" {...register('featured')} />
            <span className="text-sm">Marcar como imóvel em destaque</span>
          </label>
        </div>
      </Section>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" variant="gold" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {isEdit ? 'Salvar alterações' : 'Cadastrar imóvel'}
        </Button>
      </div>
    </form>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-graphite p-6">
      <h2 className="mb-5 font-display text-lg font-semibold">{title}</h2>
      {children}
    </section>
  )
}

function FormField({
  label,
  error,
  className,
  children,
}: {
  label: string
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-white/80">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}
