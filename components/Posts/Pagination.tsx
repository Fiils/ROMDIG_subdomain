import type { FC, Dispatch, SetStateAction } from 'react'
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
        setChangePage(true)
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
    setChangePage(true)
}

const[ arrCurBtn, setArrCurBtn] = useState<any[]>([])

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


let numberPages: number[] = []
for(let i = 1; i <= numberOfPages; i++)
   numberPages.push(i)

let dotsInitial: string = '...'
let dotsLeft: string = '... '
let dotsRight: string = ' ...'
useEffect(() => {
  let tempNumberOfPages: any = [...numberPages]

  if(numberPages.length <= 6){
    const sliced = numberPages.slice(0, 6)
    tempNumberOfPages = [...sliced]
  }
  else if(currentButton >= 1 && currentButton < 3){
    tempNumberOfPages = [1, 2, 3, dotsInitial, numberPages.length]
  }
  else if(currentButton >= 3 && currentButton <= 4){
    const sliced = numberPages.slice(0, 5)
    tempNumberOfPages = [...sliced, dotsInitial, numberPages.length]
  }
  else if(currentButton > 4 && currentButton < numberPages.length - 2){
    const sliced1 = numberPages.slice(currentButton - 2, currentButton)
    const sliced2 = numberPages.slice(currentButton, currentButton + 1)
    tempNumberOfPages = ([1, dotsLeft, ...sliced1, ...sliced2, dotsRight, numberPages.length])
  }
  else if(currentButton > numberPages.length - 3){
    const sliced = numberPages.slice(numberPages.length - 4)
    tempNumberOfPages = ([1,  dotsLeft, ...sliced])
  }
    
  setArrCurBtn(tempNumberOfPages)
}, [currentButton, dotsLeft, dotsRight, dotsInitial, numberOfPages])

const change_first_page = (page: string) => {
    router.replace({
        query: { ...router.query, page: `p${page}` }
    })

    setChangePage(true)
}

const changePage = (value: number) => {
    setCurrentButton(value)
    if(currentButton !== value){
        change_first_page(value.toString());  
    }
    setChangePage(true)
}


    return (
        <div className={styles.container_flex}>
        <button onClick={prevPage} style={{opacity: `${currentButton <= 1 ? '0.5' : '1'}`}} disabled={currentButton <= 1}>
            <Image
                src="https://res.cloudinary.com/multimediarog/image/upload/v1647954309/FIICODE/left-arrow-6404_sg9u3r.svg" width={15} height={15} alt='Stanga' priority/>
        </button>
        {arrCurBtn.map((value: number, index: number) => 
                    <div key={index}>
                        {value.toString() !== dotsInitial && value.toString() !== dotsRight && value.toString() !== dotsLeft ?
                            <button type="button" key={index}
                                    className={currentButton !== value ? styles.disactivated : styles.activated}
                                    onClick={e => changePage(value)} disabled={currentButton === value}>{value}</button>
                            : <span key={index}>{value}</span>}
                    </div>
                )
        }
        <button onClick={nextPage} style={{opacity: `${currentButton >= numberOfPages ? '0.5' : '1'}`, }} disabled={currentButton >= numberOfPages}>
            <Image
                src="https://res.cloudinary.com/multimediarog/image/upload/v1647954361/FIICODE/right-arrow-6405_ww5mk2.svg" width={15} height={15} alt='Dreapta' priority/>
        </button>
    </div>
    )
}

export default Pagination;