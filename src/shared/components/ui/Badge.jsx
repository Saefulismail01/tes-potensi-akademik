const variants = {
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-indigo-100 text-indigo-700',
  neutral: 'bg-gray-100 text-gray-600',
  soft: 'bg-gray-50 text-gray-500',
}

export default function Badge({ variant = 'neutral', className = '', children }) {
  return (
    <span className={`inline-flex items-center text-[10px] font-semibold px-2.5 py-1 rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}