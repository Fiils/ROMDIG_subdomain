import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'


import styles from '../../styles/scss/Layout/Header.module.scss';
import { useAuth } from '../../utils/useAuth'


const Header = () => {
    const router = useRouter()

    const [ menu, setMenu ] = useState<null | boolean>(null)
    const [ subSec, setSubSec ] = useState<null | boolean>(null)
    const [ border, setBorder ] = useState(false)
    const [ ppBox, setPpBox ] = useState<null | boolean>(null)

    const [ showBox, setShowBox ] = useState(false)

    const user = useAuth()

    useEffect(() => {
        const documentWidth = document.documentElement.clientWidth;
        const windowWidth = window.innerWidth;
        const scrollBarWidth = windowWidth - documentWidth;
        if(menu) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollBarWidth}px`
        }
        if(!menu) {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = `0px`
        }
     }, [menu]);


     useEffect(() => {
        if(!subSec) {
            setTimeout(() => {
                setBorder(false)
            }, 500)
        } else setBorder(true)
     }, [subSec])

     useEffect(() => {
        if(ppBox) {
            setShowBox(true)
        }
        setTimeout(() => {
            if(!ppBox) {
                setShowBox(false)
            }
        }, 450)
     }, [ppBox])

     const Logout = async (e: any) => {
         e.preventDefault()

         if(Cookies.get('Allow-Authorization')) {
            Cookies.remove('Allow-Authorization')
         }
         router.reload()
     }

    return (
        <div>
            {menu && <div className={styles.overlay}></div> }
            <div className={`${styles.container} ${menu ? styles.fullwidth : ''}`}>
                <div style={{ paddingTop: 10, paddingLeft: 10, display: 'flex', alignItems: 'center', gap: '.1em' }} className={styles.logo_icon}>
                        <div className={styles.icon_menu}>
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1649946541/FIICODE/list-6225_kdxr8j.svg' alt='Menu' width={30} height={30} onClick={() => {  setMenu(!menu); if(subSec !== null) { setTimeout(() => setSubSec(false), 300); } }} />
                        </div>
                        <span id='#title'>Dashboard ROMDIG</span>
                    <div className={styles.profile_picture}>
                        <Image id='#profile-picture' src={(user.profilePicture === '/' || !user.profilePicture) ? 'https://res.cloudinary.com/multimediarog/image/upload/v1651419562/FIICODE/skill-8804_ibppuw.svg' : user.profilePicture } width={40} height={40} onBlur={() => setPpBox(false)} onClick={() => setPpBox(!ppBox) } alt='Profile Pciture' />
                            <div className={`${styles.pp_box} ${ppBox ? styles.open_box : styles.close_box } ${!showBox ? styles.nodisplay : ''}`}>
                                <h3>Bună, {user.name}!</h3>
                                <div style={{ marginInline: 10}} className={styles.info_admin}>
                                    <h5>Autorizatie: {user.type}</h5>
                                    <h5>Judet: {user.county}</h5>
                                </div>
                                <div className={styles.logout}>
                                    <button onClick={(e) => Logout(e)}>Deconectează-te</button>
                                </div>
                            </div>
                    </div>
                </div>

                {menu !== null &&
                <div className={`${styles.sidemenu} ${menu ? styles.open_menu : styles.close_menu} ${border ? styles.bb_none : ''}`}>
                    <ul>
                        <Link href='/statistics'><a onClick={() => setMenu(false)}><li>Statistici</li></a></Link>
                        <Link href='/manage-mod'><a onClick={() => setMenu(false)}><li>Gestionare moderatori*</li></a></Link>
                        <Link href='/create-mod'><a onClick={() => setMenu(false)}><li>Creare moderatori</li></a></Link>
                        <li onClick={() => setSubSec(!subSec)} style={{ display: 'flex', alignItems: 'center', gap: '.3em'}}>
                            <span>Postări Utilizatori</span>
                            <Image src={ !subSec ? 'https://res.cloudinary.com/multimediarog/image/upload/v1649594121/FIICODE/arrow-down-3101_hgf5ei.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1649594123/FIICODE/arro-up-3100_otqmq5.svg' } alt='Icon' width={15} height={15} />
                        </li>
                        {subSec !== null && 
                            <div className={`${styles.sub_sec} ${subSec ? styles.open_sec : styles.close_sec }`}>
                                <Link href='/set-status/p1'><a onClick={() => setMenu(false)}><li className={styles.first}>Setare Status</li></a></Link>
                                <Link href='/posts/p1'><a onClick={() => setMenu(false)}><li>Toate</li></a></Link>
                                <Link href='/reported-posts'><a onClick={() => setMenu(false)}><li className={styles.last}>Raportate</li></a></Link>
                            </div>
                        }
                        <Link href='/reported-comments'><a onClick={() => setMenu(false)}><li>Comentarii raportate</li></a></Link>
                        <Link href='/registration-forms'><a onClick={() => setMenu(false)}><li>Cereri de înregistrare</li></a></Link>
                        <Link href='/manage-users'><a onClick={() => setMenu(false)}><li>Gestionare utilizatori</li></a></Link>
                    </ul> 
                </div>
                }
            </div>
        </div>
    )
}
export default Header;