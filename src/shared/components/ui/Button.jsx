/* Notion-style buttons: rounded-lg (8px), rectangular, sober-geometric */

const variants = {
  primary:
    'bg-primary text-white hover:bg-[var(--color-primary-pressed)] active:bg-[var(--color-primary-pressed)]',
  secondary:
    'bg-transparent text-ink border border-hairline-strong hover:bg-surface active:bg-surface-soft',
  ghost:
    'bg-transparent text-slate hover:bg-surface active:bg-surface-soft',
  'on-dark':
    'bg-canvas text-ink hover:bg-gray-100 active:bg-gray-200',
  danger:
    'bg-error text-white hover:bg-red-700 active:bg-red-800',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-[18px] py-[10px] text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({ variant = 'primary', size = 'md', loading, disabled, className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="inline-block w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}