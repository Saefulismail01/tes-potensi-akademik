export default function ProgressBar({ value = 0, className = '', size = 'md' }) {
  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' }
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className={`w-full bg-hairline-soft rounded-full overflow-hidden ${heights[size]} ${className}`}>
      <div
        className="bg-primary rounded-full transition-all duration-500 ease-out"
        style={{ width: `${clamped}%`, height: '100%' }}
      />
    </div>
  )
}