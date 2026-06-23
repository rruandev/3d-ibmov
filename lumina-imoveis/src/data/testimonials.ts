export interface Testimonial {
  id: string
  name: string
  role: string
  avatar: string
  rating: number
  quote: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Mariana & Pedro Lemos',
    role: 'Compraram cobertura em Itaim Bibi',
    avatar: 'https://i.pravatar.cc/200?img=5',
    rating: 5,
    quote:
      'A LUMINA entendeu exatamente o que buscávamos. Em três semanas estávamos assinando a escritura do apartamento dos nossos sonhos.',
  },
  {
    id: 't2',
    name: 'Eduardo Sampaio',
    role: 'Investidor',
    avatar: 'https://i.pravatar.cc/200?img=13',
    rating: 5,
    quote:
      'Atendimento de outro nível. A curadoria de lançamentos me trouxe oportunidades que eu jamais encontraria sozinho.',
  },
  {
    id: 't3',
    name: 'Família Nakamura',
    role: 'Casa em Alphaville',
    avatar: 'https://i.pravatar.cc/200?img=8',
    rating: 5,
    quote:
      'Profissionalismo do início ao fim. O tour virtual nos poupou semanas de visitas — fechamos negócio com total segurança.',
  },
  {
    id: 't4',
    name: 'Beatriz Coelho',
    role: 'Primeira compra',
    avatar: 'https://i.pravatar.cc/200?img=20',
    rating: 5,
    quote:
      'Achei que comprar meu primeiro imóvel seria estressante. A LUMINA transformou a jornada em algo leve e empolgante.',
  },
  {
    id: 't5',
    name: 'Otávio Brandão',
    role: 'Cobertura na orla',
    avatar: 'https://i.pravatar.cc/200?img=15',
    rating: 5,
    quote:
      'Sofisticação e transparência. Cada detalhe foi cuidado com um nível de excelência que eu só via fora do Brasil.',
  },
]
