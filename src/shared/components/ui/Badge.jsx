/* Notion-style badges: rounded-full, caption-bold (13px/600) */

const variants = {
  primary: 'bg-primary text-white',
  pink: 'bg-[var(--color-brand-pink)] text-white' || 'bg-pink-500 text-white',
  success: 'bg-success text-white',
  warning: 'bg-warning text-white',
  error: 'bg-error text-white',
  tagPurple: 'bg-tint-lavender text-[var(--color-primary)]',
  tagOrange: 'bg-tint-peach text-[var(--color-warning)]',
  tagGreen: 'bg-tint-mint text-[var(--color-success)]',
  soft: 'bg-surface text-slate',
}

export default function Badge({ variant = 'tagPurple', className = '', children }) {
  return (
    <span className={`inline-flex items-center text-[13px] font-semibold px-[10px] py-[4px] rounded-full leading-[1.4] ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}