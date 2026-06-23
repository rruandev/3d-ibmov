'use server'

import { revalidatePath } from 'next/cache'
import { propertyRepository } from '@/repositories/property.repository'
import { propertyService } from '@/services/property.service'
import { propertySchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'
import type { Property, PropertyInput } from '@/types'
import type { ActionState } from './lead.actions'

/** Leitura de imóveis por IDs — usado nas páginas de favoritos/comparação. */
export async function getPropertiesByIdsAction(ids: string[]): Promise<Property[]> {
  if (ids.length === 0) return []
  return propertyService.getByIds(ids)
}

function normalize(values: Record<string, unknown>): PropertyInput {
  const data = propertySchema.parse(values)
  return {
    ...data,
    slug: data.slug || slugify(data.title),
    tourUrl: data.tourUrl || undefined,
    videoUrl: data.videoUrl || undefined,
  } as PropertyInput
}

export async function createPropertyAction(
  values: Record<string, unknown>,
): Promise<ActionState<{ id: string; slug: string }>> {
  const parsed = propertySchema.safeParse(values)
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Verifique os campos do imóvel.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }
  try {
    const created = await propertyRepository.create(normalize(values))
    revalidatePath('/admin/imoveis')
    revalidatePath('/imoveis')
    revalidatePath('/')
    return { ok: true, data: { id: created.id, slug: created.slug } }
  } catch {
    return { ok: false, error: 'Falha ao cadastrar o imóvel.' }
  }
}

export async function updatePropertyAction(
  id: string,
  values: Record<string, unknown>,
): Promise<ActionState<{ id: string; slug: string }>> {
  const parsed = propertySchema.safeParse(values)
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Verifique os campos do imóvel.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }
  try {
    const updated = await propertyRepository.update(id, normalize(values))
    revalidatePath('/admin/imoveis')
    revalidatePath(`/imoveis/${updated.slug}`)
    revalidatePath('/imoveis')
    return { ok: true, data: { id: updated.id, slug: updated.slug } }
  } catch {
    return { ok: false, error: 'Falha ao atualizar o imóvel.' }
  }
}

export async function deletePropertyAction(id: string): Promise<ActionState<null>> {
  try {
    await propertyRepository.remove(id)
    revalidatePath('/admin/imoveis')
    revalidatePath('/imoveis')
    return { ok: true, data: null }
  } catch {
    return { ok: false, error: 'Falha ao excluir o imóvel.' }
  }
}
