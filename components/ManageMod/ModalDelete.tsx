import type { Dispatch, SetStateAction, FC } from 'react'
import { useState } from 'react'
import axios from 'axios'

import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

import styles from '../../styles/scss/ManageMod/ModalDelete.module.scss';
import { server } from '../../config/server';


interface Props {
    setModal: Dispatch<SetStateAction<boolean>>;
    setUsers: Dispatch<SetStateAction<any>>;
    setModerators: Dispatch<SetStateAction<any>>;
    setLoading_: Dispatch<SetStateAction<boolean>>;
    url: string;
    _id: string;
    _asId: string;
    _name: string;
}

const ModalDelete: FC<Props> = ({ _id, _asId, setModal, _name, url, setLoading_, setModerators, setUsers }) => {
    const [ name, setName ] = useState('')
    const [ error, setError ] = useState(false)
    const [ loading, setLoading ] = useState(false)

    const deleteProfile = async (e: any) => {
        e.preventDefault()
        setLoading(true)

        const result = await axios.delete(`${server}/api/sd/authentication/delete-user/${_id}/${_asId}`, { data: { name }, withCredentials: true })
                                .then(res => res.data)
                                .catch(err => {
                                    console.log(err)
                                    setError(true)
                                    setLoading(false)
                                })

        if(result && result.message === 'User deleted') {
            setLoading_(true)
            setModal(false)
            setLoading(false)

            const admins = await axios.get(url, { withCredentials: true })
                                    .then(res => res.data)
                                    .catch(err => {
                                        console.log(err)
                                        setLoading_(false)
                                    })

            if(result)  {
                setModerators(admins.moderators)
                setUsers(admins.users)
                setLoading_(false)
            }
        } else {
            setLoading(false)
            setError(true)
        }
    }

    return (
        <>
            <div className={styles.overlay}></div>

            <div className={styles.modal_container}>
                <div className={styles.icon_modal}>
                    <CloseIcon onClick={() => setModal(false)} />
                </div>
                <div className={styles.title}>
                    <DeleteIcon />
                    <h2>Șterge moderatorul</h2>
                </div>
                <div className={styles.description}>
                    <p>Pentru autorizarea modificării, introduceți numele exact al moderatorului în căsuța de mai jos.</p>
                </div>
                <div className={`${styles.input} ${(error || (_name !== name && name !== '')) ? styles.error : ''}`}>
                    <input id='name' autoComplete='off' placeholder='Numele...' value={name} onChange={e => setName(e.target.value)} />
                    {(error || (_name !== name && name !== '')) && <label htmlFor='name'>Numele nu se aseamănă</label> }
                </div>
                <div className={styles.button}>
                    <button onClick={e => deleteProfile(e)} disabled={_name !== name}>Șterge</button>
                </div>
            </div>
        </>
    )
}

export default ModalDelete;