import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import NextNProgress from 'nextjs-progressbar'

import Header from '../components/Layout/Header'
import '../styles/scss/globals.scss'
import { AuthProvider } from '../utils/useAuth'
import { server } from '../config/server'


function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  const [ layout, setLayout ] = useState(false)

  useEffect(() => {
    if(router.pathname !== '/') {
      setLayout(true)
    }
  }, [])

  useEffect(() => {
    const verifyUser = async () => {
      let error = false;

      const response = await axios.post(`${server}/api/sd/authentication/login-status`, {}, { withCredentials: true })
                        .then(res => res.data)
                        .catch(err => {
                          error = true
                        })    

      if(Cookies.get('Allow-Authorization') && error) {
        Cookies.remove('Allow-Authorization')
        router.reload()
      }
    }

    verifyUser()
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
      <noscript>
        <h2>Please enable JavaScript to view this page</h2>
      </noscript>
      <NextNProgress color="#F5F5F5" />
      {layout && <Header /> }
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp;