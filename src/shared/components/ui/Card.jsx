const variants = {
  default:
    'bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300',
  interactive:
    'bg-white border border-gray-100 hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer',
  highlighted:
    'bg-indigo-50 border border-indigo-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300',
  error:
    'bg-red-50 border border-red-200 hover:border-red-300 hover:shadow-md transition-all duration-300',
}

export default function Card({ variant = 'default', className = '', children, ...props }) {
  return (
    <div
      className={`rounded-2xl p-5 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}