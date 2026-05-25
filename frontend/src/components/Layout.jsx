import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children, onNavigate }) {
  return (
    <div className="min-h-screen bg-bg flex flex-col justify-between font-sans text-text">
      {/* Universal Header / Navbar */}
      <Navbar onNavigate={onNavigate} />

      {/* Dynamic Main Body Content */}
      <main className="flex-grow animate-fade-in">
        {children}
      </main>

      {/* Universal Footer */}
      <Footer />
    </div>
  )
}
