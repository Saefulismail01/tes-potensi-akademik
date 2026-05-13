export default function ProgressBar({ value = 0, className = '', size = 'md' }) {
  const heights = { sm: 'h-1', md: 'h-2', lg: 'h-3' }
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${heights[size]} ${className}`}>
      <div
        className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-700 ease-out"
        style={{ width: `${clamped}%`, height: '100%' }}
      />
    </div>
  )
}