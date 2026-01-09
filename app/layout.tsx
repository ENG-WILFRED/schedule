import '../styles/globals.css'
import Navigation from '../components/Navigation'
import ToastContainer from '../components/ToastContainer'

export const metadata = {
  title: 'Anchor Routine'
}

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="en">
      <body className="">
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <ToastContainer />
      </body>
    </html>
  )
}
