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

    const user = useAuth()

    useEffect(() => {
        if(menu) document.body.style.overflow = 'hidden';
        if(!menu) document.body.style.overflow = 'unset';
     }, [menu]);

     useEffect(() => {
        if(!subSec) {
            setTimeout(() => {
                setBorder(false)
            }, 500)
        } else setBorder(true)
     }, [subSec])

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
            <div className={styles.container}>
                <div style={{ paddingTop: 10, paddingLeft: 10, display: 'flex', alignItems: 'center', gap: '.1em' }} className={styles.logo_icon}>
                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1649946541/FIICODE/list-6225_kdxr8j.svg' alt='Menu' width={30} height={30} onClick={() => {  setMenu(!menu); if(subSec !== null) { setTimeout(() => setSubSec(false), 300); } }} />
                    <span id='#title'>Dashboard ROMDIG</span>
                    <div className={styles.profile_picture}>
                        <Image id='#profile-picture' src={(user.user.profilePicture === '/' || !user.user.profilePicture) ? 'https://res.cloudinary.com/multimediarog/image/upload/v1650018340/FIICODE/manage-260_dfu9dg.svg' : user.user.profilePicture } width={40} height={40} onBlur={() => setPpBox(false)} onClick={() => setPpBox(!ppBox) } alt='Profile Pciture' />
                            <div className={`${styles.pp_box} ${ppBox ? styles.open_box : styles.close_box }`}>
                                <h3>Bună, Alex!</h3>
                                {/* O sa inlocuiesc cu numele administratorului */}
                                <div style={{ marginInline: 10}} className={styles.info_admin}>
                                    <h5>Autorizatie: General</h5>
                                    <h5>Judet: Iasi</h5>
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
                        <Link href='/statistics' passHref><li>Statistici</li></Link>
                        <Link href='/moderators' passHref><li>Gestionare moderatori*</li></Link>
                        <Link href='/create-mod' passHref><li>Creare moderatori</li></Link>
                        <li onClick={() => setSubSec(!subSec)} style={{ display: 'flex', alignItems: 'center', gap: '.3em'}}>
                            <span>Postări Utilizatori</span>
                            <Image src={ !subSec ? 'https://res.cloudinary.com/multimediarog/image/upload/v1649594121/FIICODE/arrow-down-3101_hgf5ei.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1649594123/FIICODE/arro-up-3100_otqmq5.svg' } alt='Icon' width={15} height={15} />
                        </li>
                        {subSec !== null && 
                            <div className={`${styles.sub_sec} ${subSec ? styles.open_sec : styles.close_sec }`}>
                                <Link href='/set-status' passHref><li>Setare Status</li></Link>
                                <Link href='/posts' passHref><li>Toate</li></Link>
                                <Link href='/reported-posts' passHref><li>Raportate</li></Link>
                            </div>
                        }
                        <Link href='/reported-comments' passHref><li>Comentarii raportate</li></Link>
                        <Link href='/registration-forms' passHref><li>Cereri de înregistrare</li></Link>
                    </ul> 
                </div>
                }
            </div>
        </div>
    )
}
export default Header;