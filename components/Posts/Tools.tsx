import type { FC, Dispatch, SetStateAction } from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

import Status from './StatusSelect' 
import styles from '../../styles/scss/Posts/Tools.module.scss'
import GoogleInput from './GoogleInput'
import { server } from '../../config/server'
import Category from './CategorySelect'


interface Tools {
    status: any;
    setStatus: Dispatch<SetStateAction<any>>;
    errorLocation: boolean;
    setErrorLocation: Dispatch<SetStateAction<boolean>>;
    setPages: Dispatch<SetStateAction<number>>;
    setPosts: Dispatch<SetStateAction<any>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
}


const Tools: FC<Tools> = ({ status, setStatus, errorLocation, setErrorLocation, setPosts, setPages, setLoading }) => {
    const router = useRouter()

    const [ search, setSearch ] = useState<null | boolean>(null)
    const [ location, setLocation ] = useState('')
    const [ isComuna, setIsComuna ] = useState(false)
    const [ fullExactPosition, setFullExactPosition ] = useState<any>(null)

    const [ url, setUrl ] = useState(`${server}/api/sd/post/get-posts?level=all&category=popular`)

    const [ category, setCategory ] = useState('Populare')

    const handleChange = async (e: any) => {
        e.preventDefault()

        if(!status.includes(e.target.value)) {
            setStatus([ ...status, e.target.value ])
        } else {
            setStatus(status.filter((status: string) => !status.includes(e.target.value)))
        }
    };

    const handleChangeCategory = async (e: any) => { 
        e.preventDefault()
        setCategory(e.target.value)
    }

    const chooseCategoryServer = (categ: string | undefined | string[]) => {
        switch(categ) {
            case 'Apreciate':
                return 'positive';
            case 'Vizionate':
                return 'views';
            case 'Populare':
                return 'popular';
            case 'Comentate':
                return 'comment';
            case 'Noi':
                return 'new';
            case 'Vechi':
                return 'old';
            case 'Neapreciate':
                return 'negative';
            default:
                return 'popular'
        }
    }

    //For changing location of the posts
    useEffect(() => {
        if(search !== null) {
            let locationError = false;
            setErrorLocation(false)
            setLoading(true)

            if(location === '') {

                const getNewModerators = async () => {
                    const result = await axios.get(`${server}/api/sd/post/get-posts?page=0&page_size=14&level=all&category=${chooseCategoryServer(category)}`, { withCredentials: true })
                                            .then(res => res.data)
                                            .catch(err => {
                                                console.log(err)
                                                setErrorLocation(true)
                                                setLoading(false)
                                            })
        
                    if(result) {
                        setPages(result.numberOfPages)
                        setPosts(result.posts)
                        setUrl(`${server}/api/sd/post/get-posts?page=0&page_size=14&level=all&category=${chooseCategoryServer(category)}`)
                        // setSearchedName('Toate')
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

            if(isComuna && comuna === '') {
                setErrorLocation(true)
                return;
            }

            const getNewModerators = async (county: string, comuna: string, location: string, city: string) => {
                const result = await axios.get(`${server}/api/sd/post/get-posts?page=0&page_size=14&county=${county}&comuna=${comuna}&location=${isWithoutCity ? '' : location}&isComuna=${isComuna ? 'true': 'false'}&category=${chooseCategoryServer(category)}`, { withCredentials: true })
                                        .then(res => res.data)
                                        .catch(err => {
                                            console.log(err)
                                            setErrorLocation(true)
                                            setLoading(false)
                                        })

                if(result) {
                    setLoading(false)
                    setPages(result.numberOfPages)
                    setPosts(result.posts)
                    setUrl(`${server}/api/sd/post/get-posts?page=0&page_size=14&county=${county}&comuna=${comuna}&location=${isWithoutCity ? '' : location}&isComuna=${isComuna ? 'true': 'false'}&category=${chooseCategoryServer(category)}`)
                    // setSearchedName(`${county} County${comuna !== '' ? `, ${comuna}, ${city}` : (city !== '' ?  `, ${city}` : '')}`)
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

        const changeStatus = async (status: string[]) => {
            
            setLoading(true)
            setPosts([])
            setPages(0)
            let urlPart = '';
            router.replace({
                pathname: router.pathname,
                query: { ...router.query, page: 'p1' }
            })
    
            status.map((value: string, index: number) => {
                    if(index === 0) {
                        urlPart += `&statusa=${value}`
                    } else if(index === 1) {
                        urlPart += `&statusb=${value}`
                    } else if(index === 2) {
                        urlPart += `&statusc=${value}`
                    } else if(index === 3) {
                        urlPart += `&statusd=${value}`
                    }
            })
    // category=${chooseCategoryServer(router.query.category)}
            const result = await axios.get(`${url}${urlPart}`, { withCredentials: true })
                            .then(res => res.data)
                            .catch(err => {
                                console.log(err); 
                                return;
                            })
    
            setLoading(false)
            setPosts(result ? result.posts : [])
            setPages(result ? result.numberOfPages : 1)
        }

        // useEffect(() => {
        //     changeStatus(status)
        // }, [status])
    

        const changeCategory = async (category: string) => {
            router.push({
                pathname: router.pathname,
                query: { category: category, page: 'p1' }
            })
            setLoading(true)
            setPosts([])
            setPages(0)
            setStatus([])

            const result = await axios.get(`${server}/api/sd/post/get-posts?category=${chooseCategoryServer(category)}&page=0&page_size=14`, { withCredentials: true })
                            .then(res => res.data)
                            .catch(err => {
                                console.log(err); 
                                return;
                            })
                            setLoading(false)
            if(!result) {
                router.replace({
                    pathname: router.pathname,
                    query: { ...router.query, page: 'p1' }
                })
            }
            setPosts(result ? result.posts : [])
            setPages(result ? result.numberOfPages : 0)
        }

        useEffect(() => {
            changeCategory(category)
        }, [category])
    

    return (
        <div className={styles.tools} style={{ position: 'relative' }}>
            <h1 style={{ position: 'absolute', left: 0, display: 'flex', alignItems: 'center', gap: '.2em' }} className={styles.title_cat}>
                <span>Postări:</span>
                <Category category={category} handleChange={handleChangeCategory} />
            </h1>
            <Status status={status} handleChange={handleChange} />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '1em' }}>
                <GoogleInput error={errorLocation} setError={setErrorLocation} setFullExactPosition={setFullExactPosition} location={location} setLocation={setLocation}
                             isComuna={isComuna} setIsComuna={setIsComuna} />
                <div className={styles.button_search}>
                    <button onClick={() => { setSearch(!search); } }>Caută</button>
                </div>
            </div>
        </div>
    )
}


export default Tools;