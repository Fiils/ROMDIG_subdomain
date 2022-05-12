import type { NextPage } from 'next'
import Image from 'next/image'

import styles from '../styles/scss/Layout/Error.module.scss'
import useWindowSize from '../utils/useWindowSize'
import { NoSSR } from '../utils/NoSsr'


const ErrorPage: NextPage = () => {
    const [ width ] = useWindowSize()

    return (
        <NoSSR fallback={<div style={{ width: '100vw', height: '100vh' }}></div>}>
            <div className={styles.container}>
                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1652386203/FIICODE/no-data-7717_hxkpjz.svg' width={width < 500 ? 100 : 200} height={width < 500 ? 100 : 200} />
                <div className={styles.info}>
                    <h1>EROARE 404</h1>
                    <p>Pagina cerută nu a putut fi găsită. Verifică din nou dacă ai introdus URL-ul corect.</p>
                </div>
            </div>
        </NoSSR>
    )
}

export default ErrorPage;