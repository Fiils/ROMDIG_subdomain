import type { NextPage, GetServerSideProps } from 'next'
import axios from 'axios'
import Image from 'next/image'
import { useState, useEffect } from 'react'

import styles from '../../styles/scss/ReportedPosts/RContainer.module.scss'
import { useAuth } from '../../utils/useAuth'
import { server } from '../../config/server'
import GoogleInput from '../../components/CreateMod/GoogleInput'
import ReportedPost from '../../components/ReportedPosts/ReportedPost'

interface Posts {
    _posts: any;
    _coming: boolean;
}

const ReportedPosts: NextPage<Posts> = ({ _posts, _coming }) => {
    const auth = useAuth()

    const [ coming, setComing ] = useState(_coming)
    const [ isLocationChanged, setIsLocationChanged ] = useState(false)
    const [ isComuna, setIsComuna ] = useState(false)
    const [ posts, setPosts ] = useState(_posts)
    const [ search, setSearch ] = useState<boolean | null>(null)
    const [ fullExactPosition, setFullExactPosition ] = useState<any>()
    const [ location, setLocation ] = useState('')
    const [ errorLocation, setErrorLocation ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const [ more, setMore ] = useState(0)
    const [ isComunaName, setIsComunaName ] = useState(false)
    const [ searchedName, setSearchedName ] = useState('Toate')

    const [ url, setUrl ] = useState(`${server}/api/sd/post/get-reported-posts?level=all&skip=0`)

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
                const result = await axios.get(`${server}/api/sd/post/get-reported-posts?level=all&skip=${isLocationChanged ? 0 : more}`, { withCredentials: true })
                                        .then(res => res.data)
                                        .catch(err => {
                                            console.log(err)
                                            setErrorLocation(true)
                                            setLoading(false)
                                        })
    
                if(result) {                            
                    if(isLocationChanged) {
                        setPosts(result.posts)
                    } else {
                        const newPosts: any = [...posts, ...result.posts]
                        setPosts(newPosts)
                    }

                    setComing(result.coming)
                    setLoading(false)
                    setSearchedName('Toate')
                    setUrl(`${server}/api/sd/post/get-reported-posts?level=all&skip=0`)
                }

                setIsComunaName(false)
                setIsLocationChanged(false)
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

        if(comuna === '' && isComuna) {
            setErrorLocation(true)
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

            const result = await axios.get(`${server}/api/sd/post/get-reported-posts?county=${county}&comuna=${comuna}&location=${isWithoutCity ? '' : location}&all=false&isComuna=${isComuna ? 'true' : 'false'}&skip=${ isLocationChanged ? 0 : more }`, { withCredentials: true })
                                    .then(res => res.data)
                                    .catch(err => {
                                        console.log(err)
                                        setErrorLocation(true)
                                        setLoading(false)
                                    })

            if(result) {
                if(isLocationChanged) {
                    setPosts(result.posts)
                } else {
                    const newPosts: any = [...posts, ...result.posts]
                    setPosts(newPosts)
                }

                setUrl(`${server}/api/sd/post/get-reported-posts?county=${county}&comuna=${comuna}&location=${isWithoutCity ? '' : location}&all=false&isComuna=${isComuna ? 'true' : 'false'}&skip=0`)
                setLoading(false)
                setSearchedName(`${county} County${comuna !== '' ? `, ${comuna}${(!isComunaName && !specialName) ? `, ${city}` : ''}` : ((city !== '' && !isComunaName && !specialName) ?  `, ${city}` : '')}`)
            }
            
            setComing(result.coming)
            setIsLocationChanged(false)
        }

        if(!locationError) {
            getNewModerators(county, comuna, location, city)
        } else setLoading(false)

        setIsLocationChanged(false)
    }, [search, more])

    return (
        <>
            <div style={{ paddingBottom: 50 }}> 
                {((auth.type === 'General' || auth.type === 'Judetean' || auth.type === 'Comunal') || !auth.done) &&
                    <div className={styles.fcontainer}>
                        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                            <h2>Postări: {posts ? posts.length : 0}</h2>
                            <div style={{ width: '40%', position: 'absolute', right: 0, display: 'flex', alignItems: 'center', gap: '1em' }}>
                                <GoogleInput isComuna={isComuna} setIsComuna={setIsComuna} index={2} setFullExactPosition={setFullExactPosition} location={location} setLocation={setLocation} error={errorLocation} setError={setErrorLocation} />
                                <div className={styles.button_search}>
                                    <button onClick={() => { setIsLocationChanged(true); setSearch(!search); } }>Caută</button>
                                </div>
                            </div>
                        </div>  
                    </div>
                }
                <div className={styles.results_headline}>
                    <h1>Rezultate pentru: {searchedName}</h1>
                </div>
            </div>

            {!loading ?
                    <>
                        {(posts.length > 0) ?
                            <div className={styles.container_moderators}>
                                {posts.map((post: any, index: number) => {
                                    return <ReportedPost key={index} index={index} _id={post._id} title={post.title} authorId={post.authorId} nameAuthor={post.nameAuthor} city={post.city}
                                                         county={post.county} description={post.description} downVoted={post.downVoted} upVoted={post.upVoted} reports={post.reports}
                                                         favorites={post.favorites} firstNameAuthor={post.firstNameAuthor} media={post.media} status={post.status} views={post.views}
                                                         comments={post.comments} creationDate={post.creationDate} authorProfilePicture={post.authorProfilePicture} url={url} 
                                                         setSearch={setSearch} search={search} setIsLocationChanged={setIsLocationChanged} />
                                })}
                            </div>
                            :
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '2em', marginTop: 50 }}>
                                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1650708973/FIICODE/no-data-7713_1_s16twd.svg' width={150} height={150} />
                                    <h3 style={{ width: 400, color: 'rgb(200, 200, 200)' }}>Nu a fost găsit niciun moderator conform cerințelor</h3>
                                </div>
                            </div>
                        }
                    </>
                :
                    <div className={styles.loader}></div>
            }

            {coming &&
                <div className={styles.more}>
                    <button onClick={() => setMore(prev => prev + 15)}>Mai mult...</button>
                </div>
            } 
        </>
    )
}

export default ReportedPosts;

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

    const result = await axios.get(`${server}/api/sd/post/get-reported-posts?level=all&skip=0`, { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' } })
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
            _posts: result.posts,
            _coming: result.coming
        }
    }
}