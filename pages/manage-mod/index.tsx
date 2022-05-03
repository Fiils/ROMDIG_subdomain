import type { NextPage, GetServerSideProps } from 'next'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Image from 'next/image'

import styles from '../../styles/scss/ManageMod/ManageModContainer.module.scss'
import GoogleInput from '../../components/CreateMod/GoogleInput'
import { server } from '../../config/server'
import { useAuth } from '../../utils/useAuth'
import Moderator from '../../components/ManageMod/Moderator'


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
    _users: [{
        gender: string;
        cnp: string;
        street: string;
    }]
    load: boolean;
    numberOfPages: number;
    _coming: boolean;
}



const ManageMod: NextPage<Moderators> = ({ _moderators, _users, load = false, numberOfPages, _coming }) => {    
    const [ moderators, setModerators ] = useState<any>(_moderators || [])
    const [ users, setUsers ] = useState<any>(_users || [])
    const [ pages, setPages ] = useState(numberOfPages)
    const [ coming, setComing ] = useState(_coming)

    const [ more, setMore ] = useState(0)
    const [ isLocationChanged, setIsLocationChanged ] = useState(false) 

    const auth = useAuth()

    const [ errorLocation, setErrorLocation ] = useState(false)
    const [ fullExactPosition, setFullExactPosition ] = useState<any>(null)
    const [ location, setLocation ] = useState('')
    const [ search, setSearch ] = useState<boolean | null>(null)
    const [ searchedName, setSearchedName ] = useState('Toate')
    const [ url, setUrl ] = useState(`${server}/api/sd/mod/get-all-per-region?all=true&skip=0`)

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
                const result = await axios.get(`${server}/api/sd/mod/get-all-per-region?all=true&skip=${isLocationChanged ? 0 : more}`, { withCredentials: true })
                                        .then(res => res.data)
                                        .catch(err => {
                                            console.log(err)
                                            setErrorLocation(true)
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
                    setUrl(`${server}/api/sd/mod/get-all-per-region?all=true&skip=0`)
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

            const result = await axios.get(`${server}/api/sd/mod/get-all-per-region?county=${county}&comuna=${comuna}&location=${isWithoutCity ? '' : location}&all=false&isComuna=${isComuna ? 'true' : 'false'}&skip=${ isLocationChanged ? 0 : more }`, { withCredentials: true })
                                    .then(res => res.data)
                                    .catch(err => {
                                        console.log(err)
                                        setErrorLocation(true)
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
                setUrl(`${server}/api/sd/mod/get-all-per-region?county=${county}&comuna=${comuna}&location=${isWithoutCity ? '' : location}&all=false&isComuna=${isComuna ? 'true' : 'false'}&skip=0`)
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
        {(((auth.type === 'General' || auth.type === 'Judetean' || auth.type === 'Comunal') || !auth.done) && load) ?
            <div style={{ paddingBottom: 50 }}>
                <div className={styles.fcontainer}>
                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                        <h2>Moderatori: {moderators.length}</h2>
                        <div style={{ width: '40%', position: 'absolute', right: 0, display: 'flex', alignItems: 'center', gap: '1em' }}>
                            <GoogleInput isComuna={isComuna} setIsComuna={setIsComuna} index={2} setFullExactPosition={setFullExactPosition} location={location} setLocation={setLocation} error={errorLocation} setError={setErrorLocation} />
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
                    <div className={styles.container_moderators}>
                        {(moderators.length > 0) ?
                            <>
                                {moderators.map((moderator: any, index: number) => {
                                    return <Moderator key={moderator._id} _id={moderator._id} _lastName={moderator.lastName} _firstName={moderator.firstName} _profilePicture={moderator.profilePicture}
                                                    _asId={moderator.asId} _email={moderator.email} _type={moderator.authorization.type} _county={moderator.authorization.location.county} 
                                                    _comuna={moderator.authorization.location.comuna} _city={moderator.authorization.location.city} _gender={users[index].gender}
                                                    _cnp={users[index].cnp} _street={users[index].street} url={url} setLoading_={setLoading} setModerators={setModerators} setUsers={setUsers} />
                                })}
                            </>
                            :
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '2em', marginTop: 50 }}>
                                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1650708973/FIICODE/no-data-7713_1_s16twd.svg' width={150} height={150} />
                                    <h3 style={{ width: 400, color: 'rgb(200, 200, 200)' }}>Nu a fost găsit niciun moderator conform cerințelor</h3>
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

export default ManageMod;


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

    const moderators = await axios.get(`${server}/api/sd/mod/get-all-per-region?all=true&skip=0`, { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' }})
                                .then(res => res.data)
                                .catch(err => {
                                    console.log(err)
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

    return { 
        props: {
            _moderators: !moderators.low ? moderators.moderators : [],
            _users: !moderators.low ? moderators.users : [],
            load: !moderators.low,
            numberOfPages: moderators.numberOfPages,
            _coming: moderators.coming,
        }
    }
}   