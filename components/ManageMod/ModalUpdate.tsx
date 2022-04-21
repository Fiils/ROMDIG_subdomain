import { Dispatch, SetStateAction, FC, useEffect } from 'react'
import { useState } from 'react'
import Image from 'next/image'

import CloseIcon from '@mui/icons-material/Close';
import UpdateIcon from '@mui/icons-material/Update';

import styles from '../../styles/scss/ManageMod/ModalDelete.module.scss';


interface Props {
    setModal: Dispatch<SetStateAction<boolean>>;
    setStartUpdating: Dispatch<SetStateAction<boolean>>;
    _name: string;
    error: boolean;
    loading: boolean;
    setError: Dispatch<SetStateAction<boolean>>;
}

const ModalUpdate: FC<Props> = ({ setModal, _name, setStartUpdating, error, loading, setError }) => {
    const [ name, setName ] = useState('')

    useEffect(() => {
        if(error && name !== '') {
            setError(_name !== name && name !== '')
        }
    }, [name, error])

    return (
        <>
            <div className={styles.overlay}></div>

            <div className={styles.modal_container}>
                <div className={styles.icon_modal}>
                    <CloseIcon onClick={() => setModal(false)} />
                </div>
                <div className={styles.title}>
                    <UpdateIcon />
                    <h2>Modifică datele</h2>
                </div>
                <div className={styles.description}>
                    <p>Pentru autorizarea actualizării, introduceți numele inițial exact al moderatorului în căsuța de mai jos.</p>
                </div>
                <div className={`${styles.input} ${(error || (_name !== name && name !== '')) ? styles.error : ''}`}>
                    <input id='name' autoComplete='off' placeholder='Numele...' value={name} onChange={e => setName(e.target.value)} />
                    {(error || (_name !== name && name !== '')) && <label htmlFor='name'>Numele nu se aseamănă</label> }
                </div>
                <div className={styles.button}>
                    {!loading ?
                        <button onClick={e => setStartUpdating(true)} disabled={_name !== name}>Actualizează</button>
                    :
                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1649873008/FIICODE/Spinner-1s-200px_1_aifrmm.svg' width={70} height={70} />
                    } 
                </div>
            </div>
        </>
    )
}

export default ModalUpdate;