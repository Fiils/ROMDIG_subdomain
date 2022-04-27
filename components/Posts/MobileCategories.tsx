import type { FC } from 'react'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Image from 'next/image'

import styles from '../../styles/scss/Posts/Grid.module.scss';
import StatusSelect from './StatusSelect'

interface ListItems {
    text: string;
    index: number;
    category: string;
}

interface Props {
    changeCategory: (category: string) => Promise<void>
    status: string[];
    handleChange: (e: any) => void;
}


const CategoriesForMobile: FC<Props> = ({ changeCategory, status, handleChange }) => {
    const router = useRouter()

    const [ menu, setMenu ] = useState(false)

    useEffect(() => {
        if(menu) document.body.style.overflow = 'hidden';
        if(!menu) document.body.style.overflow = 'unset';
     }, [menu]);

    const ListItem = ({ text, category, index, }: ListItems) => {
        const active = index === 1 ? router.query.category === 'popular' : ( index === 2 ? router.query.category === 'apreciate' : ( index === 3 ? router.query.category === 'vizionate' : ( index === 4 ? router.query.category === 'comentarii' : (index === 5 ? router.query.category === 'noi' : router.query.category === 'vechi' ))))
        
                
        return (
                <li key={index} className={active ? styles.active : ''} onClick={() => { setMenu(false); changeCategory(category) }}>
                    <p key={index}>
                        {text}
                    </p>
                </li>
        )
    }

    return (
        <>
            <div className={styles.menu_options_butttons}>
                <button onClick={() => setMenu(true)}>Categorii</button>
                <StatusSelect status={status} handleChange={handleChange} />
            </div>
                <div className={`${styles.menu} ${!menu ? styles.close_menu : styles.open_menu}`}>
                    <div className={styles.close_icon}>
                        <Image onClick={() => setMenu(false)} src='https://res.cloudinary.com/multimediarog/image/upload/v1649333841/FIICODE/x-10327_1_larnxj.svg' width={15} height={15} alt='Inchidere' />
                    </div>
                        
                    <h2>
                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1649334950/FIICODE/category-872_cc1beq.svg' width={30} height={30} alt='Icon' />
                        Categorii
                    </h2>
                    
                    <ul className={styles.menu_list}>
                        <ListItem text='Populare' category='popular' index={1} />
                        <ListItem text='Cele mai apreciate' category='apreciate' index={2} />
                        <ListItem text='Cele mai vizionate' category='vizionate' index={3} />
                        <ListItem text='Cele mai multe comentarii' category='comentarii' index={4} />
                        <ListItem text='Cele mai noi' category='noi' index={5} />
                        <ListItem text='Cele mai vechi' category='vechi' index={6} />
                    </ul>
                </div>
            {menu && <div className={styles.overlay}></div>}
        </>
    )
}

export default CategoriesForMobile;