import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import Header from '../components/Layout/Header'
import '../styles/scss/globals.scss'
import { AuthProvider } from '../utils/useAuth'


function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  const [ layout, setLayout ] = useState(false)

  useEffect(() => {
    if(router.pathname !== '/') {
      setLayout(true)
    }
  }, [])

  return (
    <AuthProvider>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Aplicatie web pentru utilizatorii autorizati, prin care sa fie administrat site-ul romdig" />
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
        <meta charSet="utf-8" />
        <link rel="canonical" href="https://dashboard.romdig.net" />
        <link rel="logo icon" href="/favicon.ico" />
      </Head>
      <noscript>Please enable JavaScript to view this page</noscript>
      {layout && <Header /> }
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
