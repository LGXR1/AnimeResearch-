import VisitCounter from './VisitCounter'

export default function Layout({ children, className = '' }) {
  return (
    <div
      className={`min-h-screen relative overflow-hidden ${className}`}
      style={{ background: 'linear-gradient(170deg, #0a0a12 0%, #1a1025 30%, #0f1724 60%, #0a0a12 100%)' }}
    >
      {children}
      <VisitCounter />
    </div>
  )
}
