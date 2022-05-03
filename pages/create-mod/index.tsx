import type { NextPage, GetServerSideProps } from 'next';
import Image from 'next/image'
import { useState, useEffect } from 'react'
import * as React from 'react'
import axios from 'axios'

import styles from '../../styles/scss/CreateMod/Preview.module.scss'
import CreateModSection from '../../components/CreateMod/CreateMod'
import { server } from '../../config/server'
import formatDate from '../../utils/formatDate'
import GoogleInput from '../../components/CreateMod/GoogleInput'
import { useAuth } from '../../utils/useAuth'


interface FlexItemProfile {
    name: string;
    profilePicture: string;
    authorization: string;
    county: string;
    city: string;
    comuna: string;
    created: string;
}

interface Moderators { 
    _moderators: [{
        _id: string;
        lastName: string;
        firstName: string;
        profilePicture: string;
        creationDate: Date;
        createdBy: string;
        asId: string;
        email: string;
        authorization: {
            type: string;
            location: {
                county: string;
                city: string;
                comuna: string;
            }
        },
        posts: {
            status: Array<string>;
        },
    }];
    load: boolean;
    numberOfPages: number;
    _coming: boolean;
}

const CreateMod: NextPage<Moderators> = ({ _moderators, load = false, numberOfPages, _coming }) => {
    const auth = useAuth()

    const [ coming, setComing ] = useState(_coming)

    const [ moderators, setModerators ] = useState<any>(_moderators || [])
    const [ createMod, setCreateMod ] = useState(false)
    const [ error, setError ] = useState(false)
    const [ fullExactPosition, setFullExactPosition ] = useState<any>(null)
    const [ location, setLocation ] = useState('')
    const [ search, setSearch ] = useState(false)
    const [ searchedName, setSearchedName ] = useState('Toate')
    const [ loading, setLoading ] = useState(false)

    const [ more, setMore ] = useState(0)
    const [ pages, setPages ] = useState(numberOfPages)
    const [ isLocationChanged, setIsLocationChanged ] = useState(false)

    const [ isComuna, setIsComuna ] = useState(false)
    const [ isComunaName, setIsComunaName ] = useState(false)

    const FlexItemProfile = ({ name, profilePicture, authorization, county, city, comuna, created }: FlexItemProfile) => {
        return (
            <div className={styles.flex_item_profile}>
                <Image src={profilePicture} width={80} height={80} priority/>
                <div style={{ textAlign: 'center' }}>
                    <span>{name}</span>
                </div>  
                <div className={styles.profile_info}>
                    <div style={{ marginLeft: 10, display: 'flex', flexFlow: 'column wrap', gap: '.5em' }}>
                        <span>Autorizatie: {authorization}</span>
                        <span>Judet: {county}</span>
                        {comuna === '' ?
                            <>
                                { city !== '' && <span>Oraș: {city}</span> }
                            </>
                        :
                            <>
                                {comuna !== '' && <span>Comuna: {comuna}</span> }
                                {city !== '' && <span>Sat: {city}</span> }
                            </>
                        }
                        <span>Creat: {created}</span>
                    </div>
                </div>
            </div>
        )
    }

    //For changing location and for managing the addition of other mods when there are too many to show at once
    useEffect(() => {
        let locationError = false;
        setError(false)
        setLoading(true)

        if(location === '') {
            if(isLocationChanged) {
                setMore(0)
            }
            const getNewModerators = async () => {
                const result = await axios.get(`${server}/api/sd/mod/get-all-per-region?all=true&skip=${isLocationChanged ? 0 : more}`, { withCredentials: true })
                                        .then(res => res.data)
                                        .catch(err => {
                                            console.log(err)
                                            setError(true)
                                            setLoading(false)
                                        })
    
                if(result) {
                    setPages(result.numberOfPages)
                        
                    if(isLocationChanged) {
                        setModerators(result.moderators)
                    } else {
                        const newModerators: any = [...moderators, ...result.moderators]
                        setModerators(newModerators)
                    }

                    setComing(result.coming)
                    setLoading(false)
                    setSearchedName('Toate')
                }

                setIsLocationChanged(false)
            }
    
            getNewModerators()
            return;
        }

        if(!fullExactPosition || (fullExactPosition.address_components && fullExactPosition.address_components.length <= 0) || fullExactPosition.name !== location || !fullExactPosition.address_components) {
            setError(true)
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
                    setError(true)
                    locationError = true
                }
            }
        } else {
            setError(true)
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
            setError(true)
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

            const result = await axios.get(`${server}/api/sd/mod/get-all-per-region?county=${county}&comuna=${comuna}&location=${isWithoutCity ? '' : location}&all=false&isComuna=${isComuna ? 'true' : 'false'}&skip=${ isLocationChanged ? 0 : more }`, { withCredentials: true })
                                    .then(res => res.data)
                                    .catch(err => {
                                        console.log(err)
                                        setError(true)
                                        setLoading(false)
                                    })

            if(result) {
                if(isLocationChanged) {
                    setModerators(result.moderators)
                } else {
                    const newModerators: any = [...moderators, ...result.moderators]
                    setModerators(newModerators)
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
            {!createMod ?
                <div className={styles.fcontainer}>
                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                        <h2>Moderatori: {moderators.length}</h2>
                        {(((auth.type === 'General' || auth.type === 'Judetean' || auth.type === 'Comunal') || !auth.done) && load) &&
                            <div style={{ width: '40%', position: 'absolute', right: 0, display: 'flex', alignItems: 'center', gap: '1em' }}>
                                <GoogleInput isComuna={isComuna} setIsComuna={setIsComuna} index={2} setFullExactPosition={setFullExactPosition} location={location} setLocation={setLocation} error={error} setError={setError} />
                                <div className={styles.button_search}>
                                    <button onClick={() => { setIsLocationChanged(true); setSearch(!search) } }>Caută</button>
                                </div>
                            </div>
                        }
                    </div>
                    <div className={styles.results_headline}>
                        <h1>Rezultate pentru: {searchedName}</h1>
                    </div>
                    {!loading ?
                        <div className={styles.profile_grid}>
                            {!(moderators.length > 0) &&
                                <div className={styles.flex_item_none}>
                                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1650267008/FIICODE/warning-3092_2_en7rba.svg' width={100} height={100} onClick={() => setCreateMod(true)} />
                                    <p>Niciun moderator creat</p>
                                </div>
                            }

                            <>
                                {moderators.map((value: any, key: number) => {
                                    return <FlexItemProfile key={key} name={`${value.lastName} ${value.firstName}`} profilePicture={value.profilePicture} 
                                                        authorization={value.authorization.type} county={value.authorization.location.county} city={value.authorization.location.city} 
                                                        comuna={value.authorization.location.comuna} created={formatDate(value.creationDate)} />
                                })}
                            </>
                            
                            <div className={styles.flex_item_create}>
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1650265407/FIICODE/green-add-button-12023_oesrh1.svg' width={100} height={100} onClick={() => setCreateMod(true)} />
                                <p>Creează un nou moderator</p>
                            </div>
                        </div>
                    :
                        <div className={styles.loader}></div>
                    }
                </div>
            :
                <>
                    {(((auth.type === 'General' || auth.type === 'Judetean' || auth.type === 'Comunal') || !auth.done) && load) ?

                        <CreateModSection setCreateMod={setCreateMod} />
                        
                        :

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: 'calc(100vh - 207px)', gap: '2em' }}>
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1650705631/FIICODE/warning-sign-9762_bt1ag6.svg' width={150} height={150} />
                            <h3 style={{ width: 400 }}>Acces neautorizat. Nu aveți un nivel destul de înalt pentru accesarea acestei secțiuni</h3>
                        </div>
                    }
                </>
             }
                {coming &&
                    <div className={styles.more}>
                        <button onClick={() => setMore(prev => prev + 15)}>Mai mult...</button>
                    </div>
                } 
        </>
    )
}

export default CreateMod;

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

    const moderators = await axios.get(`${server}/api/sd/mod/get-all-per-region?skip=0`, { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' }})
                                .then(res => res.data)
                                .catch(err => {
                                    console.log(err)
                                })

    return { 
        props: {
            _moderators: moderators.moderators,
            load: !moderators.low,
            numberOfPages: moderators.numberOfPages,
            _coming: moderators.coming,
        }
    }
}   