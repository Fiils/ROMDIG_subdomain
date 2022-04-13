import '../styles/scss/globals.scss'
import type { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Aplicatie web pentru utilizatorii autorizati, prin care sa fie administrat site-ul romdig" />
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
        <meta charSet="utf-8" />
        <link rel="canonical" href="https://dashboard.romdig.net" />
        <link rel="logo icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
