import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import axios from 'axios'
import Image from 'next/image'

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

import styles from '../styles/scss/Authentication/Login.module.scss'
import { server } from '../config/server'


const Home: NextPage = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ id, setId ] = useState('')

  const [ showPassword, setShowPassword ] = useState(false)

  const [ error, setError ] = useState(false)
  const [ loading, setLoading ] = useState(false)

  const handleSubmit = async () => {
    const auth = { email, password }
    setLoading(true)

    if(!email.length || password.length < 8) {
      setError(true)
      setLoading(false)
      return;
    }

    const result = await axios.post(`${server}/api/sd/login`, auth, { withCredentials: true })

  }

  return (
    <div className={styles.flex_container}>
      <form className={styles.form}>

          <h2>Autentifică-te</h2>

          <div className={styles.input_container}>

            <div className={styles.input}>
              <label htmlFor='email'>Email</label>
              <input type='string' maxLength={321} autoComplete='email' placeholder='Adresa de email' id='email' name='email' value={email} onChange={e => setEmail(e.target.value)} />
              <div className={styles.svg_container}>
                  <EmailIcon style={{ color: 'rgb(150, 150, 150)'}} />
              </div>
            </div>

            <div className={styles.input}>
              <label htmlFor='id'>Cod de autentificare</label>
              <input type='string' maxLength={321} autoComplete='id' placeholder='ID-ul personalizat' id='od' name='id' value={id} onChange={e => setId(e.target.value)} />
              <div className={styles.svg_container}>
                  <VpnKeyIcon style={{ color: 'rgb(150, 150, 150)'}} />
              </div>
            </div>
            
            <div className={styles.input}>
              <label htmlFor='password'>Parolă</label>
              <input type={!showPassword ? 'password' : 'text'} autoComplete='password' minLength={8} placeholder='Parola' id='password' name='password' value={password} onChange={e => setPassword(e.target.value) } />
              <div className={styles.svg_container}>
                  {!showPassword ? <LockOutlinedIcon style={{ color: 'rgb(150, 150, 150)'}} id='pass' onClick={() => setShowPassword(!showPassword)}/> : <LockOpenOutlinedIcon style={{ color: 'rgb(150, 150, 150)'}} id='pass' onClick={() => setShowPassword(!showPassword)}/> }
              </div>
            </div>

            <div className={styles.submit_button}>
              <button type='submit'>Loghează-te</button>
            </div>

          </div>


          {/* <div className={styles.logo}>
              <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1647443140/FIICODE/city-icon-png-19_nwzbj1.png' width={30} height={30} alt='Logo' />
              <span>ROMDIG</span>
          </div> */}

      </form>
      
      <div className={styles.copyright}>Drepturi de autor © 2022, ROMDIG</div>
    </div>
  )
}

export default Home
