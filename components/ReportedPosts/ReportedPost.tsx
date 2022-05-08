import type { FC } from 'react';
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import styles from '../../styles/scss/ReportedPosts/Post.module.scss';
import formatDate from '../../utils/formatDate'
import useWindowSize from '../../utils/useWindowSize'
import { client } from '../../config/server'
import Options from './OptionsSection'

interface Post { 
    index: number;
    _id: string;
    title: string;
    authorId: string;
    nameAuthor: string;
    city: string;
    county: string;
    description: string;
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
    favorites: {
        count: number,
        people: Array<any>
    };
    firstNameAuthor: string;
    media: Array<any>;
    status: string;
    views: {
        count: number;
        people: Array<any>;
    };
    comments: {
        count: number;
        people: Array<any>;
    };
    creationDate: Date;
    authorProfilePicture: string;
    url: string;
    setSearch: any;
    setIsLocationChanged: any;
    search: any;
}

const Post: FC<Post> = ({ setSearch, setIsLocationChanged, search, _id, title, description, downVoted, upVoted, firstNameAuthor, media, status, favorites, reports, views, creationDate, nameAuthor, authorProfilePicture, comments, url }) => {
    const [ width ] = useWindowSize()

    const [ menu, setMenu ] = useState<null | boolean>(null)

    return (
        <div className={styles.reported_post_grid}>
            <div key={_id} className={styles.post}>
                <a href={`${client}/postari/${_id}`} target="_blank" rel="noreferrer">
                <div key={'k' + _id} className={styles.image} style={{ border: !media[0] ? '2px solid rgb(220, 220, 220)' : '0px' }}>
                    {media[0] && <Image src={media[0]} layout='fill' key={'l' + _id} alt='Poza Principala' /> }
                    {!media[0] && 
                        <div style={{ display: 'flex', flexFlow: 'column wrap', justifyContent: 'center', position: 'relative' }}>
                            <div style={{ marginTop: width >= 480 ? 55 : 55}}>
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1647938098/FIICODE/no-image-6663_bwocug.svg' height={120} width={120} alt='Fara Poze' />
                                <h3 style={{ color: 'rgb(186, 186, 186)'}}>Nicio imagine de afișat</h3>
                            </div>
                        </div>
                    }
                </div>
                <div>
                    <div className={styles.post_info}>
                        {width >= 480  && <Image src={authorProfilePicture === '/' ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648486559/FIICODE/user-4250_psd62d_xrxxhu_urnb0i.svg' : authorProfilePicture } alt='Poza Profil' width={40} height={40} /> }
                        <div>
                            {width >= 480 ?
                                <>
                                    <span>{nameAuthor} {firstNameAuthor}</span>
                                    <br />
                                </>
                                :
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1649261422/FIICODE/calendar-865_ydwmcu.svg' width={15} height={15} alt='Icon' />
                            }
                            <span>{formatDate(creationDate)}</span>
                        </div>
                        <div className={styles.status}>
                            <Image src={status === 'Trimis' ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648628565/FIICODE/paper-plane-2563_dlcylv.svg' : (status === 'Vizionat' ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648713682/FIICODE/check-7078_v85jcm.svg' : (status === 'În lucru' ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648713958/FIICODE/time-management-9651_fywiug.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1648714033/FIICODE/wrench-and-screwdriver-9431_hf7kve.svg' )) } height={120} width={width >= 520 ? 30 : 20} alt='Icon' />
                            <p>{status}</p>
                        </div>
                    </div>
                    <h3 key={'j' + _id} className={styles.title}>{title}</h3>
                        <div style={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'center' }} key={description}>
                            <div key={'a' + _id} className={styles.manip_section}>
                                <Link href={`${client}/postari/${_id}`}>
                                    <div className={styles.manip_item}>
                                        {width >= 480 && <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648474271/FIICODE/hearts-7890_2_maukcl.svg' width={20} height={20} alt='Reactii' /> }
                                        <span>{upVoted.count + downVoted.count} voturi</span>
                                    </div>
                                </Link>
                                <Link href={`${client}/postari/${_id}`}>
                                    <div className={styles.manip_item}>
                                        {width >= 480 && <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648474242/FIICODE/support-1091_1_smleyp.svg' width={20} height={20} alt='Comentarii' /> }
                                        <span>{comments.count} comentarii</span>
                                    </div>
                                </Link>
                            </div>
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
                <Options menu={menu} upVoted={upVoted} downVoted={downVoted} views={views} setSearch={setSearch} search={search} setIsLocationChanged={setIsLocationChanged} reports={reports} url={url} id={_id} />
            :  
                <>
                    <Options menu={menu} upVoted={upVoted} downVoted={downVoted} views={views} setSearch={setSearch} search={search} setIsLocationChanged={setIsLocationChanged} reports={reports} url={url} id={_id} />
                </>
            }
        </div>
    )
}

export default Post;