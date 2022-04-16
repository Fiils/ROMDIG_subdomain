import type { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Cookie from 'js-cookie'

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

import styles from '../styles/scss/Authentication/Login.module.scss'
import { server, dev } from '../config/server'


const Home: NextPage = () => {
  const router = useRouter()

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ id, setId ] = useState('')

  const [ showPassword, setShowPassword ] = useState(false)

  const [ error, setError ] = useState(false)
  const [ loading, setLoading ] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const auth = { email, password, id }
    setLoading(true)

    if(!email.length || password.length < 8) {
      setError(true)
      setLoading(false)
      return;
    }

    const result = await axios.post(`${server}/api/sd/authentication/login`, auth, { withCredentials: true })
                          .then(res => res.data)
                          .catch(err => {
                            console.log(err);
                            setError(true)
                            setLoading(false)
                          })
      
    if(result && result.message === 'User Authenticated') {
        Cookie.set('Allow-Authorization', result.token, { expires: 30, sameSite: dev ? 'lax' : 'none', secure: !dev })
        router.push('/menu')
    }

  }

  return (
    <div className={styles.flex_container}>
      <form className={styles.form} onSubmit={(e: any) => handleSubmit(e)}>

          <h2>Autentifică-te</h2>

          <div className={styles.input_container}>

            <div className={`${styles.input} ${error ? styles.wrong_input : ''}`}>
              <label htmlFor='email'>Email</label>
              <input type='string' maxLength={321} autoComplete='email' placeholder='Adresa de email' id='email' name='email' value={email} onChange={e => { setError(false); setEmail(e.target.value) } } />
              <div className={styles.svg_container}>
                  <EmailIcon style={{ color: 'rgb(150, 150, 150)'}} />
              </div>
            </div>

            <div className={`${styles.input} ${error ? styles.wrong_input : ''}`}>
              <label htmlFor='id'>Cod de autentificare</label>
              <input type='string' maxLength={321} autoComplete='id' placeholder='ID-ul personalizat' id='od' name='id' value={id} onChange={e => { setError(false); setId(e.target.value) } } />
              <div className={styles.svg_container}>
                  <VpnKeyIcon style={{ color: 'rgb(150, 150, 150)'}} />
              </div>
            </div>
            
            <div className={`${styles.input} ${error ? styles.wrong_input : ''}`}>
              <label htmlFor='password'>Parolă</label>
              <input type={!showPassword ? 'password' : 'text'} autoComplete='password' minLength={8} placeholder='Parola' id='password' name='password' value={password} onChange={e => { setError(false); setPassword(e.target.value) } } />
              <div className={styles.svg_container}>
                  {!showPassword ? <LockOutlinedIcon style={{ color: 'rgb(150, 150, 150)'}} id='pass' onClick={() => setShowPassword(!showPassword)}/> : <LockOpenOutlinedIcon style={{ color: 'rgb(150, 150, 150)'}} id='pass' onClick={() => setShowPassword(!showPassword)}/> }
              </div>
              {error && <label style={{ color: 'red' }}>Parola, emailul sau ID-ul este incorect</label> }
            </div>

            <div className={styles.submit_button}>
              {!loading ?
                <button type='submit'>Loghează-te</button>
              :
                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1649873008/FIICODE/Spinner-1s-200px_1_aifrmm.svg' width={100} height={100} />
              }
            </div>

          </div>


          <div className={styles.logo}>
              <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1647443140/FIICODE/city-icon-png-19_nwzbj1.png' width={30} height={30} alt='Logo' />
          </div>

      </form>
      
      <div className={styles.copyright}>Drepturi de autor © 2022, ROMDIG</div>
    </div>
  )
}

export default Home;


// const getServerSideProps: GetServerSideProps = async (ctx: any) => {

// }