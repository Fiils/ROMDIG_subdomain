import type { FC, Dispatch, SetStateAction} from 'react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Image from 'next/image'

import styles from '../../styles/scss/Posts/Pagination.module.scss'


interface Pagination { 
    numberOfPages: number;
    setChangePage: Dispatch<SetStateAction<boolean>>;
}

const Pagination: FC<Pagination> = ({ numberOfPages, setChangePage }) => {
    const router = useRouter()

    const nextPage = () => {
        const page = router.query.page ? router.query.page.toString().split('') : ['p', '1']
        let number = '';
        page.map((value: string) => {
            if(value !== 'p'){
                number += value
            }
        })

        if(router.query.page && parseInt(number) < numberOfPages) {
            router.replace({
                query: { ...router.query, page: `p${parseInt(number) + 1}` }
            })
            setCurrentButton(parseInt(number) + 1)
        }
    }

const prevPage = () => {
    const page = router.query.page ? router.query.page.toString().split('') : ['p', '1']
    let number = '';
    page.map((value: string) => {
        if(value !== 'p'){
            number += value
        }
    })
    
    if(router.query.page && parseInt(number) > 1) {
        router.replace({
            query: { ...router.query, page: `p${parseInt(number) - 1}` }
        })
        setCurrentButton(parseInt(number) - 1)
    }
}

const [currentButton, setCurrentButton] = useState<number>(parseInt(router.query.page!.toString() || '1'))
useEffect(() => {
    const page = router.query.page ? router.query.page.toString().split('') : ['p', '1']
    let number = '';
    page.map((value: string) => {
        if(value !== 'p'){
            number += value
        }
    })
    setCurrentButton(parseInt(number))
}, [router.query.page])


    return (
        <div className={styles.container_flex}>
        <button onClick={prevPage} style={{opacity: `${currentButton <= 1 ? '0.5' : '1'}`}} disabled={currentButton <= 1}>
            <Image
                src="https://res.cloudinary.com/multimediarog/image/upload/v1647954309/FIICODE/left-arrow-6404_sg9u3r.svg" width={15} height={15} alt='Stanga' priority/>
        </button>

        <button type="button" className={styles.current} disabled={true}>{currentButton} din {numberOfPages}</button>
                
        <button onClick={nextPage} style={{opacity: `${currentButton >= numberOfPages ? '0.5' : '1'}`, }} disabled={currentButton >= numberOfPages}>
            <Image
                src="https://res.cloudinary.com/multimediarog/image/upload/v1647954361/FIICODE/right-arrow-6405_ww5mk2.svg" width={15} height={15} alt='Dreapta' priority/>
        </button>
    </div>
    )
}

export default Pagination;