import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'LUMINA Imóveis — Imóveis de luxo e alto padrão'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'radial-gradient(ellipse at top, #1A1A1A 0%, #0A0A0A 70%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #E6C55C, #D4AF37, #A8861F)',
            }}
          />
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>LUMINA</div>
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.05,
            maxWidth: 900,
            letterSpacing: -2,
          }}
        >
          O imóvel ideal para o{' '}
          <span style={{ color: '#D4AF37' }}>próximo capítulo</span> da sua vida.
        </div>
        <div style={{ marginTop: 32, fontSize: 26, color: 'rgba(255,255,255,0.6)' }}>
          Curadoria de imóveis premium · apartamentos, casas e coberturas de luxo
        </div>
      </div>
    ),
    size,
  )
}
