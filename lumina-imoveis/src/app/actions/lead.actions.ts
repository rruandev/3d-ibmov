'use server'

import { revalidatePath } from 'next/cache'
import { leadService } from '@/services/lead.service'
import { leadSchema } from '@/lib/validations'
import type { Lead } from '@/types'

export type ActionState<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }

export async function createLeadAction(
  input: unknown,
): Promise<ActionState<{ id: string }>> {
  const parsed = leadSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Verifique os campos do formulário.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }
  try {
    const lead = await leadService.create(parsed.data)
    revalidatePath('/admin/leads')
    return { ok: true, data: { id: lead.id } }
  } catch {
    return { ok: false, error: 'Não foi possível enviar. Tente novamente.' }
  }
}

export async function updateLeadStatusAction(
  id: string,
  status: Lead['status'],
): Promise<ActionState<null>> {
  try {
    await leadService.updateStatus(id, status)
    revalidatePath('/admin/leads')
    return { ok: true, data: null }
  } catch {
    return { ok: false, error: 'Falha ao atualizar status.' }
  }
}
