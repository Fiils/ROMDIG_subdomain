import type { FC } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import { useState, useEffect } from 'react'

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import styles from '../../styles/scss/StatusPosts/Post.module.scss';
import formatDate from '../../utils/formatDate'
import useWindowSize from '../../utils/useWindowSize'
import { client, server } from '../../config/server'


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
}


const Post: FC<Post> = ({ _id, title, description, downVoted, upVoted, firstNameAuthor, media, status, favorites, reports, views, creationDate, nameAuthor, authorProfilePicture, comments }) => {
    const [ width, height ] = useWindowSize()

    const [ menu, setMenu ] = useState(false)
    const [ statusChange, setStatusChange ] = useState(status)

    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(false)

    const [ statusPost, setStatusPost ] = useState(status)

    const changeStatus = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        setError(false)
        
        const newStatus = statusChange

        const result = await axios.patch(`${server}/api/sd/post/status-change/${_id}`, { newStatus }, { withCredentials: true })
                                .then(res => res.data)
                                .catch(err => {
                                    console.log(err)
                                    setError(true)
                                    setLoading(false)
                                })

        if(result && result.message === 'Status changed') {
            setLoading(false)
            setError(false)
            setMenu(false)
            setStatusPost(statusChange)
        } else {
            setError(false)
            setLoading(false)
        }
    }

    const [ displayMenuAnim, setDisplayMenuAnim ] = useState(false)

    useEffect(() => {
        if(menu) {
            setDisplayMenuAnim(true)
        }
        setTimeout(() => {
            if(!menu) {
                setDisplayMenuAnim(false)
                setStatusChange(statusPost)
            }
        }, 200)
    }, [menu])

    return (
        <div key={_id} className={styles.post}>
            <a href={`${client}/postari/${_id}`} target="_blank" rel="noreferrer">
                <div key={'k' + _id} className={styles.image} style={{ border: !media[0] ? '2px solid rgb(220, 220, 220)' : '0px' }}>
                    {media[0] && <Image src={media[0]} layout='fill' key={'l' + _id} alt='Poza Principala' /> }
                    {!media[0] && 
                        <div style={{ display: 'flex', flexFlow: 'column wrap', justifyContent: 'center', position: 'relative' }}>
                            <div style={{ marginTop: width >= 480 ? 95 : 60}}>
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
                            <Image src={statusPost === 'Trimis' ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648628565/FIICODE/paper-plane-2563_dlcylv.svg' : (statusPost === 'Vizionat' ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648713682/FIICODE/check-7078_v85jcm.svg' : (statusPost === 'În lucru' ? 'https://res.cloudinary.com/multimediarog/image/upload/v1648713958/FIICODE/time-management-9651_fywiug.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1648714033/FIICODE/wrench-and-screwdriver-9431_hf7kve.svg' )) } height={120} width={width >= 520 ? 30 : 20} alt='Icon' />
                            <p>{statusPost}</p>
                        </div>
                    </div>
                    <h3 key={'j' + _id} className={styles.title}>{title}</h3>
                    <div style={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'center' }} key={description}>
                        <div key={'a' + _id} className={styles.manip_section}>
                            <Link href={`/postari/${_id}`}>
                                <div className={styles.manip_item}>
                                    {width >= 480 && <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648474271/FIICODE/hearts-7890_2_maukcl.svg' width={20} height={20} alt='Reactii' /> }
                                    <span>{upVoted.count + downVoted.count} voturi</span>
                                </div>
                            </Link>
                            <Link href={`/postari/${_id}`}>
                                <div className={styles.manip_item}>
                                    {width >= 480 && <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648474242/FIICODE/support-1091_1_smleyp.svg' width={20} height={20} alt='Comentarii' /> }
                                    <span>{comments.count} comentarii</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </a>
            <div className={styles.menu_status}>
                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1651320804/FIICODE/app-11173_topbz6.svg' width={30} height={33} onClick={() => setMenu(true)} />
            </div>
            {menu && <div className={styles.overlay}></div>}
            <div className={`${styles.menu_cover} ${menu ? styles.appear : styles.disappear} ${!displayMenuAnim ? styles.nodisplay : ''}`}>
                <div className={styles.icon_change}>
                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1651323377/FIICODE/transfer-3816_xclhsl.svg' width={30} height={30} />
                </div>
                <div className={styles.close_icon}>
                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648734448/FIICODE/x-10327_z0xv5h.svg' width={30} height={30} onClick={() => setMenu(false)} />
                </div>
                <div className={styles.status_container}>
                    <h3>Setare Status</h3>
                    <RadioGroup
                        value={statusChange}
                        onChange={e => setStatusChange(e.target.value)}
                        name="radio-buttons-group"
                        className={styles.grid_status}
                    >
                        <FormControlLabel value="Trimis" control={<Radio />} label={<div style={{ display: 'flex', alignItems: 'center', gap: '.4em' }}> <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648628565/FIICODE/paper-plane-2563_dlcylv.svg' width={20} height={20} />Trimis</div>} />
                        <FormControlLabel value="Vizionat" control={<Radio />} label={<div style={{ display: 'flex', alignItems: 'center', gap: '.4em' }}> <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648713682/FIICODE/check-7078_v85jcm.svg' width={20} height={20} />Vizionat</div>} />
                        <FormControlLabel value="În lucru" control={<Radio />} label={<div style={{ display: 'flex', alignItems: 'center', gap: '.4em' }}> <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648713958/FIICODE/time-management-9651_fywiug.svg' width={20} height={20} />În lucru</div>} />
                        <FormControlLabel value="Efectuat" control={<Radio />} label={<div style={{ display: 'flex', alignItems: 'center', gap: '.4em' }}> <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648714033/FIICODE/wrench-and-screwdriver-9431_hf7kve.svg' width={20} height={20} />Efectuat</div>} />
                    </RadioGroup>
                    {!loading ?
                    <div style={{ display: 'flex', flexFlow: 'column wrap', alignItems: 'center', gap: '.3em', color: 'red', fontFamily: 'Baloo Bhai 2' }}>
                        <button onClick={e => changeStatus(e)}>Schimbă status</button>
                        {error && <div>Eroare</div>}
                    </div>
                    :
                        <Image style={{ marginTop: 10 }} src='https://res.cloudinary.com/multimediarog/image/upload/v1650311259/FIICODE/Spinner-1s-200px_2_tjhrmw.svg' width={80} height={80} />
                    }   
                </div>
            </div>
        </div>
    )
}

export default Post;