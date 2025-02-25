import type { NextPage, GetServerSideProps } from 'next';
import Image from 'next/image'
import { useState, useEffect } from 'react'
import * as React from 'react'
import axios from 'axios'

import styles from '../../styles/scss/CreateMod/Preview.module.scss'
import CreateModSection from '../../components/CreateMod/CreateMod'
import { server } from '../../config/server'
import formatDate from '../../utils/formatDate'
import GoogleInput from '../../components/Posts/GoogleInput'
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
    _total: number;
}

const CreateMod: NextPage<Moderators> = ({ _moderators, load = false, numberOfPages, _coming = false, _total }) => {
    const auth = useAuth()

    const [ coming, setComing ] = useState(_coming)

    const [ total, setTotal ] = useState(_total)
    const [ moderators, setModerators ] = useState<any>(_moderators || [])
    const [ createMod, setCreateMod ] = useState(false)
    const [ error, setError ] = useState(false)
    const [ fullExactPosition, setFullExactPosition ] = useState<any>(null)
    const [ location, setLocation ] = useState('')
    const [ search, setSearch ] = useState<null | boolean>(null)
    const [ searchedName, setSearchedName ] = useState('Toate')
    const [ loading, setLoading ] = useState(false)

    const [ more, setMore ] = useState(0)
    const [ loadingForMore, setLoadingForMore ] = useState(false)
    const [ pages, setPages ] = useState(numberOfPages)
    const [ isLocationChanged, setIsLocationChanged ] = useState(true)

    const [ isComuna, setIsComuna ] = useState(false)
    const [ isComunaName, setIsComunaName ] = useState(false)

    const FlexItemProfile = ({ name, profilePicture, authorization, county, city, comuna, created }: FlexItemProfile) => {
        return (
            <div className={styles.flex_item_profile}>
                <Image src={profilePicture} width={80} height={80} priority/>
                <div style={{ textAlign: 'center' }} className={styles.name_profile}>
                    <span>{name}</span>
                </div>  
                <div className={styles.profile_info}>
                    <div style={{ marginLeft: 10, display: 'flex', flexFlow: 'column wrap', gap: '.5em' }}>
                        <span>Autorizație: <div>{authorization}</div></span>
                        <span>Județ: <div>{county}</div></span>
                        {comuna === '' ?
                            <>
                                { city !== '' && <span>Oraș: <div>{city}</div></span> }
                            </>
                        :
                            <>
                                {comuna !== '' && <span>Comună: <div>{comuna}</div></span> }
                                {city !== '' && <span>Sat: <div>{city}</div></span> }
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
        if(search === null && more === 0) return;
        let locationError = false;
        setError(false)
        setLoading(true)

        if(location === '') {
            if(isLocationChanged) {
                setMore(0)
            }

            
            if(isComuna) {
                setError(true)
                setLoading(false)
                setLoadingForMore(false)
                return;
            }

            const getNewModerators = async () => {
                const result = await axios.get(`${server}/api/sd/mod/get-all-per-region?all=true&skip=${isLocationChanged ? 0 : more}`, { withCredentials: true })
                                        .then(res => res.data)
                                        .catch(err => {
                                            console.log(err)
                                            setError(true)
                                            setLoading(false)
                                            setLoadingForMore(false)
                                        })
    
                if(result) {
                    setPages(result.numberOfPages)
                        
                    if(isLocationChanged) {
                        setModerators(result.moderators)
                    } else {
                        const newModerators: any = [...moderators, ...result.moderators]
                        setModerators(newModerators)
                    }

                    setTotal(result.total)
                    setComing(result.coming)
                    setLoading(false)
                    setLoadingForMore(false)
                    setSearchedName('Toate')
                }

                setLoading(false)
                setLoadingForMore(false)
                setIsLocationChanged(false)
            }
    
            getNewModerators()
            return;
        }

        if(!fullExactPosition || (fullExactPosition.address_components && fullExactPosition.address_components.length <= 0) || fullExactPosition.name !== location || !fullExactPosition.address_components) {
            setError(true)
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
                setError(true)
                return;
            }

            let specialName = false
            if(isComuna) {
                setIsComunaName(true)
                specialName = true
            } else setIsComunaName(false)

            const result = await axios.get(`${server}/api/sd/mod/get-all-per-region?county=${county}&comuna=${comuna}&location=${isWithoutCity ? '' : location}&all=false&isComuna=${isComuna ? 'true' : 'false'}&skip=${ isLocationChanged ? 0 : more }&isWithoutCity=${isWithoutCity ? 'true' : 'false'}`, { withCredentials: true })
                                    .then(res => res.data)
                                    .catch(err => {
                                        console.log(err)
                                        setError(true)
                                        setLoading(false)
                                        setLoadingForMore(false)
                                    })

            if(result) {
                if(isLocationChanged) {
                    setModerators(result.moderators)
                } else {
                    const newModerators: any = [...moderators, ...result.moderators]
                    setModerators(newModerators)
                }

                setTotal(result.total)
                setLoadingForMore(false)
                setComing(result.coming)
                setLoading(false)
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
        <>
            {(((auth.type === 'General' || auth.type === 'Judetean' || auth.type === 'Comunal') || !auth.done) && load) ?
            <>
                {auth.done &&
                    <>
                        {!createMod ?
                            <div className={styles.fcontainer}>
                                <div className={styles.tools}>
                                <h2>Moderatori: {total}</h2>
                                <div className={styles.search_tool}>
                                    <GoogleInput isComuna={isComuna} setIsComuna={setIsComuna} setFullExactPosition={setFullExactPosition} location={location} setLocation={setLocation} error={error} setError={setError} />
                                    <div className={styles.button_search}>
                                        <button onClick={() => { setIsLocationChanged(true); setSearch(!search) } }>Caută</button>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.results_headline}>
                                <h1>Rezultate pentru: {searchedName}</h1>
                            </div>
                            {(!loading || (loading && loadingForMore)) ?
                                <div className={styles.profile_grid}>
                                    <div className={styles.flex_item_create}>
                                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1650265407/FIICODE/green-add-button-12023_oesrh1.svg' width={100} height={100} onClick={() => setCreateMod(true)} />
                                        <p>Creează un nou moderator</p>
                                    </div>

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
                                    
                                </div>
                            :
                                <div className={styles.loader}></div>
                            }
                            </div>
                        :
                            <CreateModSection setCreateMod={setCreateMod} />
                        }
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
                    </>
                    }
                </>
            :
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: 'calc(100vh - 207px)', gap: '2em' }} className={styles.unauthorized}>
                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1650705631/FIICODE/warning-sign-9762_bt1ag6.svg' width={150} height={150} />
                    <h3 style={{ width: 400 }}>Acces neautorizat. Nu aveți un nivel destul de înalt pentru accesarea acestei secțiuni</h3>
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

    const moderators = await axios.get(`${server}/api/sd/mod/get-all-per-region?skip=0&all=true`, { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' }})
                                .then(res => res.data)
                                .catch(err => {
                                    console.log(err)
                                })

    return { 
        props: {
            _moderators: (moderators && !moderators.low && moderators.moderators) ? moderators.moderators : [],
            load: (moderators && !moderators.low) ? true : false,
            numberOfPages: (moderators && moderators.numberOfPages) ? moderators.numberOfPages : 0,
            _coming: (moderators &&  moderators.coming) ? moderators.coming : false,
            _total: (moderators && moderators.total) ? moderators.total : 0,
        }
    }
}   