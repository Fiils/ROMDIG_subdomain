import type { NextPage, GetServerSideProps } from 'next'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

import { server } from '../../../config/server'
import styles from '../../../styles/scss/Posts/PostsContainer.module.scss'
import Pagination from '../../../components/Posts/Pagination'
import MobilePagination from '../../../components/Posts/MobilePagination'
import Post from '../../../components/Posts/PostGrid'
import Tools from '../../../components/Posts/Tools'


interface Posts {
    _posts: any,
    numberOfPages: number
}


const Posts: NextPage<Posts> = ({ _posts, numberOfPages }) => {
    const router = useRouter()

    const [ posts, setPosts ] = useState(_posts)
    const [ pages, setPages ] = useState(numberOfPages)

    const [ status, setStatus ] = useState<string[]>([])

    const [ errorLocation, setErrorLocation ] = useState(false)


    const [ loading, setLoading ] = useState(false)

    // const changePage = async (category: string | undefined | string[]) => {
    //     const page = router.query.page!.toString().split('')
    //     let number = '';

    //     if(page.length > 1) {
    //         page.map((value: string) => {
    //             if(value !== 'p'){
    //                 number += value
    //             }
    //         })
    //     }

    //     setLoading(true)
    //     setPosts([])
    //     setPages(0)
    //     const result = await axios.get(`${server}/api/post/show${chooseCategoryServer(category)}?page=${parseInt(number) - 1}&level=tot&age=${category === 'vechi' ? '1' : '-1'}`, { withCredentials: true })
    //                     .then(res => res.data)
    //                     .catch(err => {
    //                         console.log(err); 
    //                         return;
    //                     })

    //     if(!result) {
    //         router.replace({
    //             pathname: router.pathname,
    //             query: { ...router.query, page: 'p1' }
    //         })
    //     }

    //     if(result.posts.length === 0) {
    //         setLoading(false)
    //         return router.replace({
    //             pathname: router.pathname,
    //             query: { ...router.query, page: 'p1' }
    //         })
    //     } else {
    //         setLoading(false)
    //         setPosts(result.posts)
    //         setPages(result.numberOfPages)
    //     }
    // }




    // useEffect(() => {
    //     changePage(router.query.category)
    // }, [router.query.page])
    



    // useEffect(() => {
    //     changeStatus(status)
    // }, [status])


    return (
        <div>   
            <Tools status={status} setStatus={setStatus} errorLocation={errorLocation} setErrorLocation={setErrorLocation} setPosts={setPosts} setPages={setPages} setLoading={setLoading} />

                {(pages > 0 && posts.length > 0) ?
                    <div className={styles.posts_container}>
                        {posts.map((post: any, index: number) => {
                            return <Post key={index} _id={post._id} index={index} title={post.title} description={post.description} upVoted={post.upVoted} downVoted={post.downVoted} firstNameAuthor={post.firstNameAuthor}
                                        media={post.media} favorites={post.favorites} reports={post.reports} views={post.views} creationDate={post.creationDate} nameAuthor={post.nameAuthor} 
                                        authorProfilePicture={post.authorProfilePicture} comments={post.comments} authorId={post.authorId} city={post.city} county={post.county} status={post.status} />
                            })
                        }
                    </div>

                : 
                <> 
                    {!loading &&
                        <div style={{ display: 'flex', flexFlow: 'column wrap', alignItems: 'center', justifyContent: 'center', mixBlendMode: 'multiply', marginTop: 200 }}>
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648493816/FIICODE/photos-10608_1_ewgru0.svg' alt='Fara Postari' width={200} height={200} />
                            <h2 style={{ width: '100%', color: '#808080', textAlign: 'center' }}>Nicio postare nu a fost găsită.</h2>
                        </div>
                    }
                </>
            }
            
            {loading && <div className={styles.loader}></div> }

            {(pages > 0 && posts.length > 0) && <Pagination numberOfPages={pages} /> }
        </div>
    )
}

export default Posts;

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

    const result = await axios.get(`${server}/api/sd/post/get-posts?level=all&category=popular`, { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' }})
                                .then(res => res.data)
                                .catch(err => {
                                    console.log(err.response)
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
            _posts: result.posts,
            numberOfPages: result.numberOfPages
        }
    }
}   