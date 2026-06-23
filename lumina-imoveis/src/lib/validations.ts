import { z } from 'zod'

export const listingTypeSchema = z.enum(['compra', 'aluguel', 'lancamento', 'luxo'])
export const propertyTypeSchema = z.enum([
  'apartamento',
  'casa',
  'cobertura',
  'terreno',
  'comercial',
])
export const propertyStatusSchema = z.enum(['disponivel', 'reservado', 'vendido'])

export const propertyImageSchema = z.object({
  url: z.string().url('URL de imagem inválida'),
  alt: z.string().min(1, 'Descreva a imagem'),
})

export const propertySchema = z.object({
  title: z.string().min(5, 'Título muito curto').max(120),
  slug: z.string().optional(),
  description: z.string().min(20, 'Descrição muito curta'),
  price: z.coerce.number().positive('Informe um valor válido'),
  listingType: listingTypeSchema,
  type: propertyTypeSchema,
  status: propertyStatusSchema.default('disponivel'),
  city: z.string().min(2, 'Informe a cidade'),
  state: z.string().min(2, 'UF').max(2),
  neighborhood: z.string().min(2, 'Informe o bairro'),
  address: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().int().min(0),
  garage: z.coerce.number().int().min(0),
  area: z.coerce.number().positive('Informe a área'),
  suites: z.coerce.number().int().min(0).optional(),
  images: z.array(propertyImageSchema).min(1, 'Adicione ao menos uma imagem'),
  // Aceita array ou string "a, b, c" (vinda do formulário) e normaliza.
  amenities: z.preprocess(
    (val) =>
      typeof val === 'string'
        ? val.split(',').map((s) => s.trim()).filter(Boolean)
        : val,
    z.array(z.string()).default([]),
  ),
  featured: z.boolean().default(false),
  agentId: z.string().optional(),
  tourUrl: z.string().url().optional().or(z.literal('')),
  videoUrl: z.string().url().optional().or(z.literal('')),
})

export type PropertyFormValues = z.infer<typeof propertySchema>

export const leadSchema = z.object({
  name: z.string().min(3, 'Informe seu nome completo'),
  email: z.string().email('E-mail inválido'),
  phone: z
    .string()
    .min(10, 'Informe um telefone válido')
    .regex(/^[\d\s()+-]+$/, 'Telefone inválido'),
  message: z.string().max(1000).optional(),
  propertyId: z.string().optional(),
  propertyTitle: z.string().optional(),
  source: z.string().optional(),
})

export type LeadFormValues = z.infer<typeof leadSchema>

export const searchSchema = z.object({
  listingType: listingTypeSchema.optional(),
  type: propertyTypeSchema.optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  query: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  garage: z.coerce.number().optional(),
  minArea: z.coerce.number().optional(),
  maxArea: z.coerce.number().optional(),
})
