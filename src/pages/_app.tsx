import { GeistSans } from 'geist/font/sans'
import { type AppType } from 'next/app'

import { api } from '~/utils/api'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import '~/styles/globals.css'
import { SidebarProvider } from '~/components/ui/sidebar'

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <NextThemesProvider
      defaultTheme="dark"
      attribute="class"
      enableSystem
      disableTransitionOnChange
    >
      <div className={GeistSans.className}>
        <SidebarProvider>
          <Component {...pageProps} />
        </SidebarProvider>
      </div>
    </NextThemesProvider>
  )
}

export default api.withTRPC(MyApp)
