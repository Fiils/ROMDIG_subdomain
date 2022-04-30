import type { FC } from 'react';
import { useState, useEffect } from 'react'
import Image from 'next/image'
import axios from 'axios'

import styles from '../../styles/scss/RegistrationForms/Form.module.scss'
import { server } from '../../config/server'


interface User { 
    form: any;
    setSearch: any;
    search: null | boolean;
    setIsLocationChanged: any;
}


const ReqForm: FC<User> = ({ form, setSearch, setIsLocationChanged, search}) => {
    const [ user, setUser ] = useState(form)

    const [ photoSelect, setPhotoSelect ] = useState(false)
    const [ photo, setPhoto ] = useState('/')

    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(false)

    useEffect(() => {
        if(photo !== '/') document.body.style.overflow = 'hidden'
        if(photo === '/') document.body.style.overflow = 'unset'
    }, [photo])

    const acceptAccount = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        setError(false)

        const result = await axios.post(`${server}/api/sd/normal-user/accept-account/${user._id}`, {}, { withCredentials: true })
                                .then(res => res.data)
                                .catch(err => {
                                    console.log(err)
                                    setError(true)
                                    setLoading(false)
                                })

        if(result.message === 'User accepted') {
            setLoading(false)
            setSearch(!search)
            setIsLocationChanged(true)
            setError(false)
        } else setError(true)
    }

    const refuseAccount = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        setError(false)

        const result = await axios.post(`${server}/api/sd/normal-user/refuse-account/${user._id}`, {}, { withCredentials: true })
                                .then(res => res.data)
                                .catch(err => {
                                    console.log(err)
                                    setError(true)
                                    setLoading(false)
                                })

        if(result && result.message === 'User deleted') {
            setLoading(false)
            setSearch(!search)
            setIsLocationChanged(true)
            setError(false)
        } else setError(true)
    }


    return (
        <>
            <div className={styles.wrapper_form}>
                <div className={styles.image}>
                    <h3>Buletin</h3>
                    <Image src={user.buletin} layout='fill' onClick={() => { setPhoto(user.buletin); setPhotoSelect(true) } } />
                </div>

                <div className={styles.image}>
                    <h3>Domiciliu</h3>
                    <Image src={user.domiciliu} layout='fill' onClick={() => { setPhoto(user.domiciliu); setPhotoSelect(true) } } />
                </div>

                <div className={styles.info}>
                    <h2>{user.name} {user.firstName}</h2>

                    <div className={styles.personal}>
                        <span>Email: {user.email}</span>
                        <span>CNP: {user.cnp}</span>
                        <span>Strada: {user.street}</span>
                        <span>Județ: {user.county}</span>
                        {user.comuna !== '' ?
                            <>
                                <span>Comuna: {user.comuna}</span>
                                <span>Sat: {user.city}</span>
                            </>
                            :
                            <>
                                <span>Oraș: {user.city}</span>
                            </>
                        }
                        <span>Sex: {user.gender}</span>
                    </div>

                    <div className={styles.submit_buttons}>
                        {!loading ?
                            <>
                                <button onClick={e => acceptAccount(e)}>Acceptă contul</button>
                                <button onClick={e => refuseAccount(e)}>Refuză contul</button>
                            </>
                        :
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1650311259/FIICODE/Spinner-1s-200px_2_tjhrmw.svg' width={80} height={80} />
                        }
                    </div>
                </div>
            </div>

            {photoSelect && 
                <>
                    <div className={styles.overlay}></div>
                    <div className={styles.fullscreen_image}>
                        <Image src={photo} layout='fill' />
                        <p onClick={() => { setPhoto('/'); setPhotoSelect(false) }}>Înapoi</p>
                    </div>
                </>
            }
        </>
    )
}

export default ReqForm;