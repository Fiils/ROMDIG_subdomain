import type { FC, Dispatch, SetStateAction} from 'react';
import { useState, useEffect } from 'react'
import Image from 'next/image'
import axios from 'axios'

import styles from '../../styles/scss/ReportedPosts/Options.module.scss'
import { server } from '../../config/server'
import useWindowSize from '../../utils/useWindowSize'

interface Options {
    reports: any;
    url: string;
    id: string;
    setSearch: Dispatch<SetStateAction<boolean>>;
    setIsLocationChanged: Dispatch<SetStateAction<boolean>>;
    search: boolean;
    upVoted: any;
    downVoted: any;
    originalPostId: string;
    menu: null | boolean;
}

const OptionsSection: FC<Options> = ({ upVoted, downVoted, setSearch, setIsLocationChanged, search, reports, url, id, originalPostId, menu }) => {

    const [ hoverDelete, setHoverDelete ] = useState(false)
    const [ deleteAction, setDeleteAction ] = useState(false)

    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(false)

    const [ width ] = useWindowSize()

    const Reason = ({ text, total }: { text: string, total: number }) => {

        return (
            <div style={{ listStyleType: 'disc' }}>
                <span>{text}: </span>
                <span>{total}</span>
            </div>
        )
    }

    const handleDelete = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        setError(false)

        const result = await axios.delete(`${server}/api/sd/post/delete-comment/${originalPostId}/${id}`, { withCredentials: true })
                                .then(res => res.data)
                                .catch(err => {
                                    console.log(err)
                                    setError(true)
                                    setLoading(false)
                                })

        if(result && result.message === 'Comment deleted') {
            setLoading(false)
            setIsLocationChanged(true)
            setSearch(!search)
        } else {
            setLoading(false)
            setError(true)
        }
    }

    const [ show, setShow ] = useState(false)

    useEffect(() => {
        setShow(true)

        let menuTimeout: any;
        if(!menu) {
            menuTimeout = setTimeout(() => {
                setShow(false)
            }, 200)
        }

        return () => {
            clearTimeout(menuTimeout)
        }
    }, [menu])

    return (
        <div className={`${styles.options_container} ${(width <= 1000 && menu !== null) ? (menu ? styles.appear : styles.disappear) : ''} ${(!show && width <= 1000) ? styles.nodisplay : ''}`}>
            <div className={styles.actions}>
                <Image onClick={() => setDeleteAction(true)} onMouseOver={() => setHoverDelete(true)} onMouseOut={() => setHoverDelete(false)} src={ !hoverDelete ? 'https://res.cloudinary.com/multimediarog/image/upload/v1651165241/FIICODE/red-delete-10437_1_flgrzd.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1651165239/FIICODE/red-delete-10437_xwdkzg.svg' } width={30} height={30} priority/>
            </div>
            <div className={styles.down_cont}>
                <h2>Motive pentru raportare</h2>

                <div className={styles.reasons_box}>
                    <Reason text='Localizare greșită' total={reports.reasons.filter((reason: string) => reason === 'Localizare greșită').length} />
                    <Reason text='Conținut irelevant' total={reports.reasons.filter((reason: string) => reason === 'Conținut irelevant').length} />
                    <Reason text='Ilegal' total={reports.reasons.filter((reason: string) => reason === 'Ilegal').length} />
                    <Reason text='Conținut ireverențios' total={reports.reasons.filter((reason: string) => reason === 'Conținut ireverențios').length} />
                    <Reason text='Dezinformare' total={reports.reasons.filter((reason: string) => reason === 'Dezinformare').length} />
                    <Reason text='Altceva' total={reports.reasons.filter((reason: string) => reason === 'Altceva').length} />
                </div>

                <h2 className={styles.mt_big}>Statistici</h2>

                <div className={styles.reasons_box}>
                    <Reason text='Aprecieri' total={upVoted.count} />
                    <Reason text='Down Votes' total={downVoted.count} />
                    <Reason text='Semnalări' total={reports.count} />
                </div>

                <div>

                </div>
            </div>

            {deleteAction &&
                <>
                    <div className={styles.overlay}></div>
                    <div className={styles.container_accept}>
                        <div className={styles.icon_modal}>
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1651165790/FIICODE/lined-circle-4078_rnctdy.svg' width={30} height={30} />
                        </div>
                        <div className={styles.close_modal}>
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1649333841/FIICODE/x-10327_1_larnxj.svg' onClick={() => setDeleteAction(false)} width={30} height={30} />
                        </div>

                        <div className={styles.content_modal}>
                            <h2>Ștergere</h2>
                            <p>
                                Ești sigur că vrei să ștergi postarea selectată? Această acțiune este <u>ireversibilă</u>
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                {!loading ?
                                    <div style={{ display: 'flex', flexFlow: 'column wrap', gap: 5 }}>
                                        <button onClick={e => handleDelete(e)}>Confirmare</button>
                                        {error && <span style={{ color: 'red' }}>Eroare</span> }
                                    </div>
                                :
                                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1650311259/FIICODE/Spinner-1s-200px_2_tjhrmw.svg' width={90} height={90} />
                                }
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default OptionsSection;