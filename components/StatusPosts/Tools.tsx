import type { FC, Dispatch, SetStateAction } from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

import Status from '../Posts/StatusSelect' 
import styles from '../../styles/scss/Posts/Tools.module.scss'
import GoogleInput from '../Posts/GoogleInput'
import { server } from '../../config/server'
import Category from '../Posts/CategorySelect'
import { useAuth } from '../../utils/useAuth'
import useWindowSize from '../../utils/useWindowSize'


interface Tools {
    errorLocation: boolean;
    setErrorLocation: Dispatch<SetStateAction<boolean>>;
    setPages: Dispatch<SetStateAction<number>>;
    setPosts: Dispatch<SetStateAction<any>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    changePageBool: boolean;
    setChangePage: Dispatch<SetStateAction<boolean>>;
    loading: boolean;
}


const Tools: FC<Tools> = ({ errorLocation, setErrorLocation, setPosts, setPages, setLoading, changePageBool, setChangePage, loading }) => {
    const router = useRouter()
    const auth = useAuth()

    const [ width ] = useWindowSize()
    const [ locationChanged, setLocationChanged ] = useState({ value: false, text: ''})
    
    const [ status, setStatus ] = useState<any>((Cookies.get('url_status_s') && Cookies.get('url_status_s') !== '') ? JSON.parse(Cookies.get('url_status_s') || '[]') || [] : [])

    const [ search, setSearch ] = useState<null | boolean>(null)
    const [ location, setLocation ] = useState((Cookies.get('url_location_s') && Cookies.get('url_location_s') !== '') ? Cookies.get('url_location_s') || '' : '')
    const [ isComuna, setIsComuna ] = useState((Cookies.get('url_comuna_s') && Cookies.get('url_comuna_s') !== '') ? (Cookies.get('url_comuna_s') === 'true' ? true : false) : false)
    const [ fullExactPosition, setFullExactPosition ] = useState<any>((Cookies.get('url_fex_s') && Cookies.get('url_fex_s') !== '') ? JSON.parse(Cookies.get('url_fex_s') || '') : null)

    const [ url, setUrl ] = useState(`${server}/api/sd/post/get-posts${Cookies.get('url_s') ? Cookies.get('url_s') : `?page=${parseInt(router.query.page!.toString().split('p')[1]) - 1}&level=all&category=popular`}`)

    const [ category, setCategory ] = useState((Cookies.get('url_cat_s') && Cookies.get('url_cat_s') !== '') ? Cookies.get('url_cat_s') || 'Populare' : 'Populare')

    const [ onlyLocation, setOnlyLocation ] = useState(false)

    const [ changeStatusBool, setChangeStatus ] = useState(false)
    const [ changeCategoryBool, setChangeCategory ] = useState(false)

    const handleChange = async (e: any) => {
        e.preventDefault()

        if(!status.includes(e.target.value)) {
            setStatus([ ...status, e.target.value ])
        } else {
            setStatus(status.filter((status: string) => !status.includes(e.target.value)))
        }
        setChangeStatus(true)
    };

    const handleChangeCategory = async (e: any) => { 
        e.preventDefault()
        setCategory(e.target.value)
        setChangeCategory(true)
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
        if(search !== null && !loading) {
            let errorLocation = false
            setErrorLocation(false)
            setLoading(true)
            setOnlyLocation(true)
            router.replace({
                pathname: router.pathname,
                query: { ...router.query, page: 'p1' }
            })

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
                        setLoading(false)
                    } else {
                        setLoading(false)
                    }
                        Cookies.set('url_s', `?page=0&page_size=14&level=all&category=${chooseCategoryServer(category)}`)
                        Cookies.set('url_status_s', [])
                        Cookies.set('url_fex_s', '')
                        Cookies.set('url_location_s', '')
                        Cookies.set('url_comuna_s', 'false')
                }
        
                getNewModerators()
                setOnlyLocation(false)
                return;
            }

            if(typeof fullExactPosition === 'undefined' || !fullExactPosition || (fullExactPosition.address_components && fullExactPosition.address_components.length <= 0) || fullExactPosition.name !== location || !fullExactPosition.address_components) {
                setErrorLocation(true)
                setLoading(false)
                setOnlyLocation(false)
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
                        errorLocation = true
                    }
                }
            } else {
                setErrorLocation(true)
                errorLocation = true;
                return;
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
                setOnlyLocation(false)
                setLoading(false)
                return;
            }

            const getNewModerators = async (county: string, comuna: string, location: string) => {
                const result = await axios.get(`${server}/api/sd/post/get-posts?page=0&page_size=14&county=${county}&comuna=${comuna}&location=${isWithoutCity ? '' : location}&isComuna=${isComuna ? 'true': 'false'}&category=${chooseCategoryServer(category)}`, { withCredentials: true })
                                        .then(res => res.data)
                                        .catch(err => {
                                            console.log(err)
                                            setErrorLocation(true)
                                            setLoading(false)
                                        })

                if(result) {
                    setPages(result.numberOfPages)
                    setPosts(result.posts)
                    setLoading(false)
                    setUrl(`${server}/api/sd/post/get-posts?page=0&page_size=14&county=${county}&comuna=${comuna}&location=${isWithoutCity ? '' : location}&isComuna=${isComuna ? 'true': 'false'}&category=${chooseCategoryServer(category)}`)
                    Cookies.set('url_status_s', [])
                    Cookies.set('url_location_s', location)
                    Cookies.set('url_comuna_s', isComuna.toString())
                    Cookies.set('url_fex_s', JSON.stringify(fullExactPosition))
                    Cookies.set('url_s', `?page=0&page_size=14&county=${county}&comuna=${comuna}&location=${isWithoutCity ? '' : location}&isComuna=${isComuna ? 'true': 'false'}&category=${chooseCategoryServer(category)}`)
                } else {
                    setLoading(false)
                }

            }

            if(errorLocation) {
                setLoading(true)
                setErrorLocation(true)
                setOnlyLocation(false)
                return;
            }

            getNewModerators(county, comuna, location)
            setOnlyLocation(false)
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

            const newCategoryArray = url.split('=')
            newCategoryArray.pop()
            const newCategoryArray2 = newCategoryArray.join('=')
            const newCategoryArray3 = newCategoryArray2.split('&')
            newCategoryArray3.pop()
            const newCategoryArray4 = newCategoryArray3.join('&')
            let searchParams: any;
            if ('URLSearchParams' in window) {
                searchParams = new URLSearchParams(newCategoryArray4.split('?')[1]);
                searchParams.set("page", `0`);
                searchParams.delete('statusa')
                searchParams.delete('statusb')
                searchParams.delete('statusc')
                searchParams.delete('statusd')
            }

            const result = await axios.get(`${url.split('?')[0]}?${searchParams!.toString()}${urlPart}&category=${chooseCategoryServer(category)}`, { withCredentials: true })
                            .then(res => res.data)
                            .catch(err => {
                                console.log(err); 
                                return;
                            })
    
            setLoading(false)
            setUrl(`${url.split('?')[0]}?${searchParams!.toString()}${urlPart}&category=${chooseCategoryServer(category)}`)
            setPosts(result ? result.posts : [])
            setPages(result ? result.numberOfPages : 1)
            setChangeStatus(false)

            const cookiesStatuses: string[] | null = []
            if(urlPart.split('&')[1] && urlPart.split('&')[1].split('=')[1] !== '') {
                cookiesStatuses.push(urlPart.split('&')[1].split('=')[1])
            } 
            if(urlPart.split('&')[2] && urlPart.split('&')[2].split('=')[1] !== '') {
                cookiesStatuses.push(urlPart.split('&')[2].split('=')[1])
            } 
            if(urlPart.split('&')[3] && urlPart.split('&')[3].split('=')[1] !== '') {
                cookiesStatuses.push(urlPart.split('&')[3].split('=')[1])
            }
            if(urlPart.split('&')[4] && urlPart.split('&')[4].split('=')[1] !== '') {
                cookiesStatuses.push(urlPart.split('&')[4].split('=')[1])
            } 

            Cookies.set('url_s', `?${searchParams!.toString()}${urlPart}&category=${chooseCategoryServer(category)}`)
            Cookies.set('url_status_s', JSON.stringify(cookiesStatuses))
        }

        useEffect(() => {
            if(changeStatusBool) {
                changeStatus(status)
            }
        }, [status])

    

        const changeCategory = async (newCategory: string) => {
            router.push({
                pathname: router.pathname,
                query: { ...router.query, page: 'p1' }
            })
            setLoading(true)
            setPosts([])
            setPages(0)

            const newCategoryArray = url.split('=')
            newCategoryArray.pop()
            const newCategoryArray2 = newCategoryArray.join('=')
            let searchParams: any;
            if ('URLSearchParams' in window) {
                searchParams = new URLSearchParams(newCategoryArray2.split('?')[1]);
                searchParams.set("page", `0`);
            }
            const result = await axios.get(`${url.split('?')[0]}?${searchParams!.toString()}${chooseCategoryServer(newCategory)}`, { withCredentials: true })
                            .then(res => res.data)
                            .catch(err => {
                                console.log(err); 
                            })
            
            setUrl(`${url.split('?')[0]}?${searchParams!.toString()}=${chooseCategoryServer(newCategory)}`)
            setLoading(false)
            setPosts(result ? result.posts : [])
            setPages(result ? result.numberOfPages : 0)
            setChangeCategory(false)

            Cookies.set('url_s', `?${searchParams!.toString()}${chooseCategoryServer(newCategory)}`)
            Cookies.set('url_cat_s', newCategory)
        }

        useEffect(() => {
            if(!onlyLocation && changeCategoryBool) {
                changeCategory(category)
            }
        }, [category])

        
    const changePage = async (category: string | undefined | string[]) => {
        const page = router.query.page!.toString().split('')
        let number = '';

        if(page.length > 1) {
            page.map((value: string) => {
                if(value !== 'p'){
                    number += value
                }
            })
        }

        setLoading(true)
        setPosts([])
        setPages(0)

        let searchParams;
        if ('URLSearchParams' in window) {
            searchParams = new URLSearchParams(url.split('?')[1]);
            searchParams.set("page", `${parseInt(number) - 1}`);
        }
        const result = await axios.get(`${url.split('?')[0]}?${searchParams?.toString()}`, { withCredentials: true })
                        .then(res => res.data)
                        .catch(err => {
                            console.log(err); 
                            return;
                        })

        setLoading(false)
        setPosts(result ? result.posts : [])
        setPages(result ? result.numberOfPages : 1)
        setChangePage(false)

        Cookies.set('url_s', `?${searchParams?.toString()}`)
        Cookies.set('url_page_s', number)
    }



    useEffect(() => {
        if(changePageBool) {
            changePage(router.query.category)
        }
    }, [router.query.page])
    

    return (
        <div className={styles.tools} style={{ position: 'relative' }}>
            <h1 style={{ position: width >= 1250 ? 'absolute' : 'relative', left: 0, display: 'flex', alignItems: 'center', gap: '.2em' }} className={styles.title_cat}>
                <span>Postări:</span>
                <Category category={category} handleChange={handleChangeCategory} />
            </h1>
            <Status status={status} handleChange={handleChange} />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '1em' }} className={styles.search_inp}>
                {(auth.type === 'General' || auth.type === 'Judetean' || auth.type === 'Comunal') &&
                    <>
                        <GoogleInput error={errorLocation} setError={setErrorLocation} setFullExactPosition={setFullExactPosition} location={location} setLocation={setLocation}
                                    isComuna={isComuna} setIsComuna={setIsComuna} />
                        <div className={styles.button_search}>
                            <button onClick={() => { setOnlyLocation(true); setSearch(!search); } }>Caută</button>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}


export default Tools;