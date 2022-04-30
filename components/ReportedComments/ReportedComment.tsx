import type { FC } from 'react';
import Image from 'next/image'
import Link from 'next/link'

import styles from '../../styles/scss/ReportedComments/Comment.module.scss';
import formatDate from '../../utils/formatDate'
import useWindowSize from '../../utils/useWindowSize'
import { client } from '../../config/server'
import Options from './OptionsSection'

interface Post { 
    index: number;
    _id: string;
    authorId: string;
    text: string;
    originalPostId: string;
    nameAuthor: string;
    city: string;
    county: string;
    downVoted: {
        count: number;
        people: Array<any>
    },
    upVoted: {
        count: number;
        people: Array<any>
    },
    reports: {
        count: number,
        people: Array<any>
    };
    firstNameAuthor: string;
    creationDate: Date;
    authorProfilePicture: string;
    url: string;
    setSearch: any;
    setIsLocationChanged: any;
    search: any;
}

const Post: FC<Post> = ({ setSearch, index, setIsLocationChanged, search, _id, text, originalPostId, downVoted, upVoted, firstNameAuthor, reports, creationDate, nameAuthor, authorProfilePicture, url }) => {
    const [ width, height ] = useWindowSize()
console.log(authorProfilePicture)
    return (
        <div style={{ display: 'flex', gap: '40px', height: '100%', width: '100%' }}>
            <a href={`${client}/postari/${originalPostId}`} target="_blank" rel="noreferrer">
               <div className={styles.comment}>
               <div className={styles.numbered} style={{ position: 'absolute', top: 10, left: 10 }}>
                   <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1651306601/FIICODE/text-message-4653_1_c6vcge.svg' width={40} height={40} />
                   <span>Comment #{index + 1}</span>
                </div>
                   <div className={styles.profile}>
                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648486559/FIICODE/user-4250_psd62d_xrxxhu_urnb0i.svg' width={50} height={50} />
                        <div style={{ display: 'flex', flexFlow: 'column wrap' }}>
                            <span>{nameAuthor} {firstNameAuthor}</span>
                            <span>{formatDate(creationDate)}</span>
                        </div>
                   </div>
                   <div className={styles.comment_wrapper}>
                        <p>{text}</p>
                    </div>
               </div>
            </a>

            <Options upVoted={upVoted} originalPostId={originalPostId} downVoted={downVoted} setSearch={setSearch} search={search} setIsLocationChanged={setIsLocationChanged} reports={reports} url={url} id={_id} />
        </div>
    )
}

export default Post;