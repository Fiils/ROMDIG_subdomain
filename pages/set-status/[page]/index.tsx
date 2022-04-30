import type { NextPage, GetServerSideProps } from 'next'
import axios from 'axios'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import * as cookie from 'cookie'

import { server } from '../../../config/server'
import styles from '../../../styles/scss/Posts/PostsContainer.module.scss'
import Pagination from '../../../components/Posts/Pagination'
import MobilePagination from '../../../components/Posts/MobilePagination'
import Post from '../../../components/StatusPosts/PostGrid'
import Tools from '../../../components/Posts/Tools'
import { NoSSR } from '../../../utils/NoSsr'


interface Posts {
    _posts: any,
    numberOfPages: number
}


const Posts: NextPage<Posts> = ({ _posts, numberOfPages }) => {
    const router = useRouter()

    const [ posts, setPosts ] = useState(_posts || [])
    const [ pages, setPages ] = useState(numberOfPages || 1)


    const [ changePage, setChangePage ] = useState(false)

    const [ errorLocation, setErrorLocation ] = useState(false)


    const [ loading, setLoading ] = useState(false)

    return (
        <NoSSR fallback={<div style={{ height: '100vh'}}></div>}>
        <div>   
            <Tools changePageBool={changePage} setChangePage={setChangePage} errorLocation={errorLocation} setErrorLocation={setErrorLocation} 
                   setPosts={setPosts} setPages={setPages} setLoading={setLoading} />

                {(pages > 0 && posts.length > 0 && !loading) ?
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

            {(pages > 0 && posts.length > 0) && <Pagination numberOfPages={pages} setChangePage={setChangePage} /> }
        </div>
        </NoSSR>
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


    const result = await axios.get(`${server}/api/sd/post/get-posts${cookie.parse(req.headers.cookie).url ? cookie.parse(req.headers.cookie).url : `?level=all&category=popular&page=${parseInt(ctx.query.page.split('p')[1]) - 1}`}`, { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' }})
                                .then(res => res.data)
                                .catch(err => {
                                    console.log(err.response)
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
            numberOfPages: result.numberOfPages
        }
    }
}   