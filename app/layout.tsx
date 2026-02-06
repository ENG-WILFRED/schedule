import '../styles/globals.css'
import Navigation from '../components/Navigation'
import ToastContainer from '../components/ToastContainer'
import { LayoutClient } from './layout-client'

export const metadata = {
  title: 'Anchor Routine'
}

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="en">
      <body className="">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
