export default function Skeleton({ className = '', height = '1rem' }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 ${className}`}
      style={{ height }}
    />
  )
}