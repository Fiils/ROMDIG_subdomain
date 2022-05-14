import type { NextPage, GetServerSideProps } from 'next'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'

import { server } from '../../config/server'
import styles from '../../styles/scss/RegistrationForms/ContainerReg.module.scss'
import { useAuth } from '../../utils/useAuth'
import GoogleInput from '../../components/Posts/GoogleInput'
import { NoSSR } from '../../utils/NoSsr'


interface Forms {
    _users: any;
    _coming: boolean;
    _total: number;
}

const User = dynamic(() => import('../../components/ManageUsers/User'),
    { ssr: false }
)


const RegistrationForms: NextPage<Forms> = ({ _users, _coming, _total  }) => {
    const auth = useAuth()

    const [ total, setTotal ] = useState(_total)
    const [ users, setUsers ] = useState<any>(_users || [])
    const [ coming, setComing ] = useState(_coming)

    const [ more, setMore ] = useState(0)
    const [ loadingForMore, setLoadingForMore ] = useState(false)
    const [ isLocationChanged, setIsLocationChanged ] = useState(false) 


    const [ errorLocation, setErrorLocation ] = useState(false)
    const [ fullExactPosition, setFullExactPosition ] = useState<any>(null)
    const [ location, setLocation ] = useState('')
    const [ search, setSearch ] = useState<boolean | null>(null)
    const [ searchedName, setSearchedName ] = useState('Toate')

    const [ isComuna, setIsComuna ] = useState(false)
    const [ isComunaName, setIsComunaName ] = useState(false)


    const [ loading, setLoading ] = useState(false)

    //For changing location and for managing the addition of other mods when there are too many to show at once
    useEffect(() => {
        if(search === null && more === 0) return;
        let locationError = false;
        setErrorLocation(false)
        setLoading(true)

        if(location === '') {
            if(isLocationChanged) {
                setMore(0)
            }

            if(isComuna) {
                setErrorLocation(true)
                setLoading(false)
                setLoadingForMore(false)
                return;
            }
            
            const getNewModerators = async () => {
                const result = await axios.get(`${server}/api/sd/normal-user/get-users?level=all&skip=${isLocationChanged ? 0 : more}`, { withCredentials: true })
                                        .then(res => res.data)
                                        .catch(err => {
                                            console.log(err)
                                            setErrorLocation(true)
                                            setLoading(false)
                                            setLoadingForMore(false)
                                        })
    
                if(result) {
                        
                    if(isLocationChanged) {
                        setUsers(result.users)
                    } else {
                        const newUsers: any = [...users, ...result.users]
                        setUsers(newUsers)
                    }

                    setTotal(result.total)
                    setComing(result.coming)
                    setLoading(false)
                    setLoadingForMore(false)
                    setSearchedName('Toate')
                }

                setLoading(false)
                setLoadingForMore(false)
                setIsComunaName(false)
                setIsLocationChanged(false)
            }
    
            getNewModerators()
            return;
        }

        if(!fullExactPosition || (fullExactPosition.address_components && fullExactPosition.address_components.length <= 0) || fullExactPosition.name !== location || !fullExactPosition.address_components) {
            setErrorLocation(true)
            locationError = true
            setLoading(false)
            setLoadingForMore(false)
            return;
        }

        let county: any = [];
        if(fullExactPosition && fullExactPosition.address_components) {
            for(let i = 0; i < fullExactPosition.address_components.length; i++) {
                if(fullExactPosition.address_components[i].types.includes('administrative_area_level_1')) {
                    for(let j = 0; j < (fullExactPosition.address_components[i].long_name.split(' ').length > 1 ? fullExactPosition.address_components[i].long_name.split(' ').length - 1 :  fullExactPosition.address_components[i].long_name.split(' ').length); j++){
                        county = [ ...county, fullExactPosition.address_components[i].long_name.split(' ')[j] ]
                    }
                    county = county.join(" ")
                    break;
                }
                if(i === fullExactPosition.address_components.length - 1) {
                    setErrorLocation(true)
                    locationError = true
                }
            }
        } else {
            setErrorLocation(true)
            locationError = true
        }
    
        let comuna: any = [];
        if(fullExactPosition && fullExactPosition.address_components) {
            for(let i = 0; i < fullExactPosition.address_components.length; i++) {
                if(fullExactPosition.address_components[i].types.includes('administrative_area_level_2')) {
                    for(let j = 0; j < fullExactPosition.address_components[i].long_name.split(' ').length; j++){
                        comuna = [ ...comuna, fullExactPosition.address_components[i].long_name.split(' ')[j] ]
                    }
                    comuna = comuna.join(" ")
                    break;
                }
            }
        }

        let isWithoutCity = false, city = location;
        for(let i = 0; i < fullExactPosition.address_components.length; i++) {
            if(fullExactPosition.address_components[i].types.includes('locality')) {
                break;
            } else if(i === fullExactPosition.address_components.length - 1) {
                isWithoutCity = true
                city = ''
            }
        }
    
        if(Array.isArray(comuna)) {
            comuna = ''
        }

        if(comuna === '' && isComuna) {
            setErrorLocation(true)
            setLoading(false)
            setLoadingForMore(false)
            return;
        }

        const getNewModerators = async (county: string, comuna: string, location: string, city: string) => {
            if(isLocationChanged) {
                setMore(0)
            }

            if(isWithoutCity && (auth.type === 'Comunal' || auth.type === 'Satesc' || auth.type === 'Orasesc')) {
                setLoading(false)
                setLoadingForMore(false)
                setErrorLocation(true)
                return;
            }
            
            let specialName = false
            if(isComuna) {
                setIsComunaName(true)
                specialName = true
            } else setIsComunaName(false)

            const result = await axios.get(`${server}/api/sd/normal-user/get-users?county=${county}&comuna=${comuna}&location=${isWithoutCity ? '' : location}&isComuna=${isComuna ? 'true' : 'false'}&skip=${ isLocationChanged ? 0 : more }&isWithoutCity=${isWithoutCity ? 'true' : 'false'}`, { withCredentials: true })
                                    .then(res => res.data)
                                    .catch(err => {
                                        console.log(err)
                                        setErrorLocation(true)
                                        setLoading(false)
                                        setLoadingForMore(false)
                                    })

            if(result) {
                if(isLocationChanged) {
                    setUsers(result.users)
                } else {
                    const newUsers: any = [...users, ...result.users]
                    setUsers(newUsers)
                }

                setTotal(result.total)
                setComing(result.coming)
                setLoading(false)
                setLoadingForMore(false)
                setSearchedName(`${county} County${comuna !== '' ? `, ${comuna}${(!specialName) ? `, ${city}` : ''}` : ((city !== '' && !isComunaName && !specialName) ?  `, ${city}` : '')}`)
            }
            
            setLoading(false)
            setLoadingForMore(false)
            setIsLocationChanged(false)
        }

        if(!locationError) {
            getNewModerators(county, comuna, location, city)
        }

        setLoading(false)
        setLoadingForMore(false)
        setIsLocationChanged(false)
    }, [search, more])

    return (
        <NoSSR fallback={<div style={{ width: '100vw', height: '100vh' }}></div>}>
        {((auth.type === 'General' || auth.type === 'Judetean') || !auth.done) ?
            <>
                {auth.done &&
                    <div style={{ paddingBottom: 50 }}>
                        <div className={styles.fcontainer}>
                            <div className={styles.tools}>
                                <h2>Utilizatori: {total}</h2>
                                <div className={styles.search_tool}>
                                    <GoogleInput isComuna={isComuna} setIsComuna={setIsComuna} setFullExactPosition={setFullExactPosition} location={location} setLocation={setLocation} error={errorLocation} setError={setErrorLocation} />
                                    <div className={styles.button_search}>
                                        <button onClick={() => { setIsLocationChanged(true); setSearch(!search); } }>Caută</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className={styles.full_wrapper}>
                            <div className={styles.results_headline}>
                                <h1>Rezultate pentru: {searchedName}</h1>
                            </div>

                            {(!loading || (loading && loadingForMore)) ?
                                <div className={styles.container_forms}>
                                    {(users && users.length > 0) ?
                                        <>
                                            {users.map((user: any, index: number) => {
                                                return <User key={index} _user={user} setSearch={setSearch} search={search} setIsLocationChanged={setIsLocationChanged} />
                                            })}
                                        </>
                                        :
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '2em', marginTop: 50 }} className={styles.no_content}>
                                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1650708973/FIICODE/no-data-7713_1_s16twd.svg' width={150} height={150} />
                                                <h3 style={{ width: 400, color: 'rgb(200, 200, 200)' }}>Nu a fost găsit niciun utilizator conform cerințelor</h3>
                                            </div>
                                        </div>
                                    }
                                </div>
                            :
                                <div className={styles.loader}></div>
                            }
                        </div>

                        {(coming && !loading) &&
                            <>
                            {!loadingForMore ?
                                <div className={styles.more} style={{ marginBottom: 15 }}>
                                    <button onClick={() => { setLoadingForMore(true); setIsLocationChanged(false); setMore(prev => prev + 15) } }>Mai mult...</button>
                                </div>
                            :
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 15 }}>
                                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1650311259/FIICODE/Spinner-1s-200px_2_tjhrmw.svg' width={100} height={100} priority/>
                                </div>
                            }
                            </>
                        } 
                    </div>
                }
            </>
        :
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: 'calc(100vh - 207px)', gap: '2em' }} className={styles.unauthorized}>
                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1650705631/FIICODE/warning-sign-9762_bt1ag6.svg' width={150} height={150} />
                <h3 style={{ width: 400 }}>Acces neautorizat. Nu aveți un nivel destul de înalt pentru accesarea acestei secțiuni</h3>
            </div>
        }
            
        </NoSSR>
    )
}

export default RegistrationForms;

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
    const { req } = ctx;

    const token = req.cookies['Allow-Authorization']
    let redirect = false
  
    if(!token) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            },
            props: {}
        }
    }
  
    const user = await axios.post(`${server}/api/sd/authentication/login-status`, {}, { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' } })
                        .then(res => res.data)
                        .catch(err => {
                            console.log(err);
                            redirect = true
                        })
  
    if(redirect)  {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            },
            props: {}
        }
    }

    const result = await axios.get(`${server}/api/sd/normal-user/get-users?level=all&skip=0`, { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' } })
                         .then(res => res.data)
                         .catch(err => {
                            console.log(err);
                        })

    return {
        props: {
            _users: result ? result.users : [],
            _coming: result ? result.coming : false,
            _total: result ? result.total : 0,
        }
    }
}