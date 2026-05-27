import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children, onNavigate, transparentOnTop }) {
  const mainClass = transparentOnTop ? "pt-0" : "pt-[130px]"

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-between font-sans text-text">
      {/* Universal Header / Navbar */}
      <Navbar onNavigate={onNavigate} transparentOnTop={transparentOnTop} />

      {/* Dynamic Main Body Content */}
      <main className={`flex-grow animate-fade-in ${mainClass}`}>
        {children}
      </main>

      {/* Universal Footer */}
      <Footer />
    </div>
  )
}
