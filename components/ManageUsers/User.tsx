import type { FC } from 'react';
import { useState, useEffect } from 'react'
import Image from 'next/image'
import axios from 'axios'

import styles from '../../styles/scss/RegistrationForms/Form.module.scss'
import { server } from '../../config/server'
import useWindowSize from '../../utils/useWindowSize'
import { NoSSR } from '../../utils/NoSsr'
import { useAuth } from '../../utils/useAuth'
                            

interface User { 
    _user: any;
    setSearch: any;
    search: null | boolean;
    setIsLocationChanged: any;
}


const ReqForm: FC<User> = ({ _user, setSearch, setIsLocationChanged, search}) => {
    const [ user, setUser ] = useState(_user)

    const auth = useAuth()

    const [ photoSelect, setPhotoSelect ] = useState(false)
    const [ photo, setPhoto ] = useState('/')

    const [ width ] = useWindowSize()

    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(false)

    useEffect(() => {
        if(photo !== '/') document.body.style.overflow = 'hidden'
        if(photo === '/') document.body.style.overflow = 'unset'
    }, [photo])

    const deleteAccount = async (e: any) => {
        e.preventDefault()

        if(auth.type !== 'General' && auth.type !== 'Judetean') return;

        setLoading(true)
        setError(false)

        const result = await axios.delete(`${server}/api/sd/normal-user/delete-account/${user._id}`, { withCredentials: true })
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
                {width > 1250 &&
                        <div className={styles.image}>
                            <h3>Buletin</h3>
                            <Image src={(user.buletin !== 'none' && user.buletin) ? user.buletin : 'https://res.cloudinary.com/multimediarog/image/upload/v1648493816/FIICODE/photos-10608_1_ewgru0.svg'} layout='fill' onClick={() => { setPhoto(user.buletin); setPhotoSelect(true) } } />
                        </div>
                }
                {width > 1250 &&
                    <div className={styles.image}>
                        <h3>Domiciliu</h3>
                        <Image src={(user.domiciliu && user.domiciliu !== 'none') ? user.domiciliu : 'https://res.cloudinary.com/multimediarog/image/upload/v1648493816/FIICODE/photos-10608_1_ewgru0.svg'} layout='fill' onClick={() => { setPhoto(user.domiciliu); setPhotoSelect(true) } } />
                    </div>
                }
                {width <= 1250 &&
                    <div className={styles.image_container}>
                        <div className={styles.image}>
                            <h3>Buletin</h3>
                            <Image src={(user.buletin && user.buletin !== 'none') ? user.buletin : 'https://res.cloudinary.com/multimediarog/image/upload/v1648493816/FIICODE/photos-10608_1_ewgru0.svg'} layout='fill' onClick={() => { setPhoto(user.buletin); setPhotoSelect(true) } } />
                        </div>

                        <div className={styles.image}>
                            <h3>Domiciliu</h3>
                            <Image src={(user.domiciliu && user.domiciliu !== 'none') ? user.domiciliu : 'https://res.cloudinary.com/multimediarog/image/upload/v1648493816/FIICODE/photos-10608_1_ewgru0.svg'} layout='fill' onClick={() => { setPhoto(user.domiciliu); setPhotoSelect(true) } } />
                        </div>
                    </div>
                }

                <div className={styles.info}>
                    <h2>{user.name} {user.firstName}</h2>

                    <div className={styles.personal}>
                        <span>Email: <span>{user.email}</span></span>
                        <span>CNP: <span>{user.cnp}</span></span>
                        <span>Strada: <span>{user.street}</span></span>
                        <span>Județ: <span>{user.county}</span></span>
                        {user.comuna !== '' ?
                            <>
                                <span>Comuna: <span>{user.comuna}</span></span>
                                <span>Sat: <span>{user.city}</span></span>
                            </>
                            :
                            <>
                                <span>Oraș: <span>{user.city}</span></span>
                            </>
                        }
                        <span>Sex: <span>{user.gender}</span></span>
                    </div>

                    <div className={styles.submit_buttons}>
                        {!loading ?
                            <>
                                {error && <span style={{ color: 'red' }}>EROARE</span>}
                                <button style={{ borderColor: 'green', color: 'green' }} onClick={e => deleteAccount(e)} disabled={auth.type !== 'General' && auth.type !== 'Judetean'}>Șterge contul (Admin Județean/General)</button>
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
                        <Image src={(photo && photo !== 'none') ? photo : 'https://res.cloudinary.com/multimediarog/image/upload/v1648493816/FIICODE/photos-10608_1_ewgru0.svg'} layout='fill' />
                        <p onClick={() => { setPhoto('/'); setPhotoSelect(false) }}>Înapoi</p>
                    </div>
                </>
            }
        </>
    )
}

export default ReqForm;