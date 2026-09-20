import './globals.css'
import {Toaster} from "react-hot-toast"
import { SanityLive } from '@/sanity/lib/live'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <body className="font-poppins antialiased">
        {children}
        <SanityLive />
        <Toaster 
          position='bottom-right'
          toastOptions={{
            style: {
              background: "#000000",
              color: '#fff'
            }
          }}
        />
      </body>
    </html>
  )
};

export default RootLayout;
