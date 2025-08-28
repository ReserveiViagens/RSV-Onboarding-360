import type { AppProps } from 'next/app'
import { AuthProvider } from '../context/AuthContext'
import '../styles/globals.css'
import Head from 'next/head'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient()
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Onion RSV 360 - Sistema de Turismo</title>
        <meta name="description" content="Sistema completo de gestão turística Onion RSV 360" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </QueryClientProvider>
    </>
  )
} 