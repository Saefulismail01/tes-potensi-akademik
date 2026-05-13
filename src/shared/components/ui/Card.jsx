/* Notion-style cards: rounded-xl (12px), hairline border */

export default function Card({ variant = 'default', className = '', children, ...props }) {
  const styles = {
    default: 'bg-canvas border border-hairline shadow-card hover:shadow-card-hover',
    interactive: 'bg-canvas border border-hairline shadow-card hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer',
    highlighted: 'bg-tint-lavender border border-primary/20',
    pastelPeach: `bg-[var(--color-tint-peach)] border border-hairline`,
    pastelMint: `bg-[var(--color-tint-mint)] border border-hairline`,
    pastelSky: `bg-[var(--color-tint-sky)] border border-hairline`,
    pastelRose: `bg-[var(--color-tint-rose)] border border-hairline`,
    pastelYellow: `bg-[var(--color-tint-yellow)] border border-hairline`,
  }

  return (
    <div
      className={`rounded-xl p-5 transition-all duration-200 ${styles[variant] || styles.default} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}