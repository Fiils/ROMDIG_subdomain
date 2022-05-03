import type { NextPage, GetServerSideProps } from 'next'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Image from 'next/image'

import { server } from '../../config/server'
import styles from '../../styles/scss/RegistrationForms/ContainerReg.module.scss'
import { useAuth } from '../../utils/useAuth'
import GoogleInput from '../../components/Posts/GoogleInput'
import UserForm from '../../components/RegistrationForms/ReqForm'


interface Forms {
    _forms: any;
    _coming: boolean;
}


const RegistrationForms: NextPage<Forms> = ({ _forms, _coming  }) => {
    const auth = useAuth()

    const [ forms, setForms ] = useState<any>(_forms || [])
    const [ coming, setComing ] = useState(_coming)

    const [ more, setMore ] = useState(0)
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
        if(search === null) return;
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
                return;
            }
            
            const getNewModerators = async () => {
                const result = await axios.get(`${server}/api/sd/normal-user/get-requests-registration?level=all&skip=${isLocationChanged ? 0 : more}`, { withCredentials: true })
                                        .then(res => res.data)
                                        .catch(err => {
                                            console.log(err)
                                            setErrorLocation(true)
                                            setLoading(false)
                                        })
    
                if(result) {
                        
                    if(isLocationChanged) {
                        setForms(result.inactiveAccounts)
                    } else {
                        const newForms: any = [...forms, ...result.inactiveAccounts]
                        setForms(newForms)
                    }

                    setComing(result.coming)
                    setLoading(false)
                    setSearchedName('Toate')
                }

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
            return;
        }

        const getNewModerators = async (county: string, comuna: string, location: string, city: string) => {
            if(isLocationChanged) {
                setMore(0)
            }
            
            let specialName = false
            if(isComuna) {
                setIsComunaName(true)
                specialName = true
            } else setIsComunaName(false)

            const result = await axios.get(`${server}/api/sd/normal-user/get-requests-registration?county=${county}&comuna=${comuna}&location=${isWithoutCity ? '' : location}&isComuna=${isComuna ? 'true' : 'false'}&skip=${ isLocationChanged ? 0 : more }`, { withCredentials: true })
                                    .then(res => res.data)
                                    .catch(err => {
                                        console.log(err)
                                        setErrorLocation(true)
                                        setLoading(false)
                                    })

            if(result) {
                if(isLocationChanged) {
                    setForms(result.inactiveAccounts)
                } else {
                    const newForms: any = [...forms, ...result.inactiveAccounts]
                    setForms(newForms)
                }

                setComing(result.coming)
                setLoading(false)
                setSearchedName(`${county} County${comuna !== '' ? `, ${comuna}${(!isComunaName && !specialName) ? `, ${city}` : ''}` : ((city !== '' && !isComunaName && !specialName) ?  `, ${city}` : '')}`)
            }
            
            setIsLocationChanged(false)
        }

        if(!locationError) {
            getNewModerators(county, comuna, location, city)
        } else setLoading(false)

        setIsLocationChanged(false)
    }, [search, more])


    return (
        <>
        {((auth.type === 'General' || auth.type === 'Judetean' || auth.type === 'Comunal') || !auth.done) ?
            <div style={{ paddingBottom: 50 }}>
                <div className={styles.fcontainer}>
                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                        <h2>Moderatori: {forms ? forms.length : 0}</h2>
                        <div style={{ width: '40%', position: 'absolute', right: 0, display: 'flex', alignItems: 'center', gap: '1em' }}>
                            <GoogleInput isComuna={isComuna} setIsComuna={setIsComuna} setFullExactPosition={setFullExactPosition} location={location} setLocation={setLocation} error={errorLocation} setError={setErrorLocation} />
                            <div className={styles.button_search}>
                                <button onClick={() => { setIsLocationChanged(true); setSearch(!search); } }>Caută</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className={styles.results_headline}>
                    <h1>Rezultate pentru: {searchedName}</h1>
                </div>

                {!loading ?
                    <div className={styles.container_forms}>
                        {(forms && forms.length > 0) ?
                            <>
                                {forms.map((form: any, index: number) => {
                                    return <UserForm key={index} form={form} setSearch={setSearch} search={search} setIsLocationChanged={setIsLocationChanged} />
                                })}
                            </>
                            :
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '2em', marginTop: 50 }}>
                                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1650708973/FIICODE/no-data-7713_1_s16twd.svg' width={150} height={150} />
                                    <h3 style={{ width: 400, color: 'rgb(200, 200, 200)' }}>Nu a fost găsit nicio cerere de activare a vreunui cont</h3>
                                </div>
                            </div>
                        }
                    </div>
                :
                    <div className={styles.loader}></div>
                }
                {coming &&
                    <div className={styles.more}>
                        <button onClick={() => setMore(prev => prev + 15)}>Mai mult...</button>
                    </div>
                }
            </div>
        :
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: 'calc(100vh - 207px)', gap: '2em' }}>
                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1650705631/FIICODE/warning-sign-9762_bt1ag6.svg' width={150} height={150} />
                <h3 style={{ width: 400 }}>Acces neautorizat. Nu aveți un nivel destul de înalt pentru accesarea acestei secțiuni</h3>
            </div>
        }
            
        </>
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

    const result = await axios.get(`${server}/api/sd/normal-user/get-requests-registration?level=all&skip=0`, { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' } })
                         .then(res => res.data)
                         .catch(err => {
                            console.log(err);
                            redirect = true
                        })

    if(redirect)  {
        return {    
            redirect: {
                permanent: false,
                destination: '/statistics'
            },
            props: {}
        }
    }

    return {
        props: {
            _forms: result.inactiveAccounts,
            _coming: result.coming
        }
    }
}