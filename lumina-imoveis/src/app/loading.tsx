export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-dark-radial">
      <div className="flex flex-col items-center gap-4">
        <div className="size-12 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
        <p className="text-sm uppercase tracking-[0.3em] text-gold">LUMINA</p>
      </div>
    </div>
  )
}
