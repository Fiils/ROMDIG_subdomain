import type { NextPage, GetServerSideProps } from 'next'
import { useState, useEffect } from 'react'
import axios from 'axios'

import styles from '../../styles/scss/ManageMod/ManageModContainer.module.scss'
import GoogleInput from '../../components/CreateMod/GoogleInput'
import { server } from '../../config/server'
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
}



const ManageMod: NextPage<Moderators> = ({ _moderators, _users }) => {    
    const [ moderators, setModerators ] = useState<any>(_moderators)
    const [ users, setUsers ] = useState<any>(_users)

    const [ errorLocation, setErrorLocation ] = useState(false)
    const [ fullExactPosition, setFullExactPosition ] = useState<any>(null)
    const [ location, setLocation ] = useState('')
    const [ search, setSearch ] = useState<boolean | null>(null)
    const [ searchedName, setSearchedName ] = useState('Toate')
    const [ url, setUrl ] = useState(`${server}/api/sd/mod/get-all-per-region?all=true`)


    const [ loading, setLoading ] = useState(false)

    console.log(search)

    useEffect(() => {
        if(search !== null) {
            let locationError = false;
            setErrorLocation(false)
            setLoading(true)

            if(location === '') {
                const getNewModerators = async () => {
                    const result = await axios.get(`${server}/api/sd/mod/get-all-per-region?all=true`, { withCredentials: true })
                                            .then(res => res.data)
                                            .catch(err => {
                                                console.log(err)
                                                setErrorLocation(true)
                                                setLoading(false)
                                            })
        
                    if(result) {
                        setModerators(result.moderators)
                        setUsers(result.users)
                        setSearchedName('Toate')
                        setUrl(`${server}/api/sd/mod/get-all-per-region?all=true`)
                        setLoading(false)
                    } else {
                        setLoading(false)
                    }
                }
        
                getNewModerators()
                return;
            }

            if(!fullExactPosition || (fullExactPosition.address_components && fullExactPosition.address_components.length <= 0) || fullExactPosition.name !== location) {
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

            const getNewModerators = async (county: string, comuna: string, location: string, city: string) => {
                const result = await axios.get(`${server}/api/sd/mod/get-all-per-region?county=${county}&comuna=${comuna}&location=${isWithoutCity ? '' : location}&all=false`, { withCredentials: true })
                                        .then(res => res.data)
                                        .catch(err => {
                                            console.log(err)
                                            setErrorLocation(true)
                                            setLoading(false)
                                        })

                if(result) {
                    setModerators(result.moderators)
                    setLoading(false)
                    setUsers(result.users)
                    setUrl(`${server}/api/sd/mod/get-all-per-region?county=${county}&comuna=${comuna}&location=${isWithoutCity ? '' : location}&all=false`)
                    setSearchedName(`${county} County${comuna !== '' ? `, ${comuna}, ${city}` : (city !== '' ?  `, ${city}` : '')}`)
                } else {
                    setLoading(false)
                }
            }

            if(!locationError) {
                getNewModerators(county, comuna, location, city)
            }
            setLoading(false)
        }
    }, [search]) 

    return (
        <div style={{ paddingBottom: 50 }}>
            <div className={styles.fcontainer}>
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                    <h2>Moderatori: {moderators.length}</h2>
                    <div style={{ width: '40%', position: 'absolute', right: 0, display: 'flex', alignItems: 'center', gap: '1em' }}>
                        <GoogleInput index={2} setFullExactPosition={setFullExactPosition} location={location} setLocation={setLocation} error={errorLocation} setError={setErrorLocation} />
                        <div className={styles.button_search}>
                            <button onClick={() => setSearch(!search)}>Caută</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={styles.results_headline}>
                <h1>Rezultate pentru: {searchedName}</h1>
            </div>

            {!loading ?
                <div className={styles.container_moderators}>
                    {moderators.map((moderator: any, index: number) => {
                        return <Moderator key={moderator._id} _id={moderator._id} _lastName={moderator.lastName} _firstName={moderator.firstName} _profilePicture={moderator.profilePicture}
                                        _asId={moderator.asId} _email={moderator.email} _type={moderator.authorization.type} _county={moderator.authorization.location.county} 
                                        _comuna={moderator.authorization.location.comuna} _city={moderator.authorization.location.city} _gender={users[index].gender}
                                        _cnp={users[index].cnp} _street={users[index].street} url={url} setLoading_={setLoading} setModerators={setModerators} setUsers={setUsers} />
                    })}
                </div>
            :
                <div className={styles.loader}></div>
            }
        </div>
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

    const moderators = await axios.get(`${server}/api/sd/mod/get-all-per-region?all=true`, { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' }})
                                .then(res => res.data)
                                .catch(err => {
                                    console.log(err)
                                })

    return { 
        props: {
            _moderators: moderators.moderators,
            _users: moderators.users
        }
    }
}   