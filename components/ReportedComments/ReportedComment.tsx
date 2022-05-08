import type { FC } from 'react';
import Image from 'next/image'
import { useState } from 'react'

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
    const [ width ] = useWindowSize()

    const [ menu, setMenu ] = useState<boolean | null>(null)

    return (

        <div className={styles.reported_comment_grid}>
            <div style={{ position: 'relative' }}>
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
                {width < 1000 && 
                    <div className={styles.menu_status}>
                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1651320804/FIICODE/app-11173_topbz6.svg' width={25} height={33} onClick={() => setMenu(!menu)} />
                    </div>
                }
            </div>

            {width > 1000 ? 
                <Options menu={menu} originalPostId={originalPostId} upVoted={upVoted} downVoted={downVoted} setSearch={setSearch} search={search} setIsLocationChanged={setIsLocationChanged} reports={reports} url={url} id={_id} />
            :  
                <>
                    <Options menu={menu} originalPostId={originalPostId} upVoted={upVoted} downVoted={downVoted} setSearch={setSearch} search={search} setIsLocationChanged={setIsLocationChanged} reports={reports} url={url} id={_id} />
                </>
            }
        </div>

    )
}

export default Post;