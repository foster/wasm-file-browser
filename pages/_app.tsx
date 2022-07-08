import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { WorkerProvider } from '../lib/use-worker'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WorkerProvider>
      <Component {...pageProps} />
    </WorkerProvider>
  )
}

export default MyApp
