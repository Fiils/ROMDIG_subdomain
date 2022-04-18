import type { NextPage } from 'next';
import Image from 'next/image'
import { useState } from 'react'

import styles from '../../styles/scss/CreateMod/Preview.module.scss'
import CreateModSection from '../../components/CreateMod/CreateMod'

interface FlexItemProfile {
    name: string;
    profilePicture: string;
    authorization: string;
    county: string;
    city: string;
    comuna: string;
    created: string;
}

const CreateMod: NextPage = () => {

    const [ createMod, setCreateMod ] = useState(false)

    const FlexItemProfile = ({ name, profilePicture, authorization, county, city, comuna, created }: FlexItemProfile) => {
        
        return (
            <div className={styles.flex_item_profile}>
            <Image src={profilePicture} width={80} height={80} priority/>
            <div style={{ textAlign: 'center' }}>
                <span>{name}</span>
            </div>  
            <div className={styles.profile_info}>
                <div style={{ marginLeft: 10, display: 'flex', flexFlow: 'column wrap', gap: '.5em' }}>
                    <span>Autorizatie: {authorization}</span>
                    <span>Judet: {county}</span>
                    {comuna === '' ?
                        <span>Oras: {city}</span>
                    :
                        <>
                            <span>Comuna: {comuna}</span>
                            <span>Sat: {city}</span>
                        </>
                    }
                    <span>Creat: {created}</span>
                </div>
            </div>
        </div>
        )
    }

    return (
        <>
            {!createMod ?
                <div className={styles.fcontainer}>
                        <h2>Moderatori: 22784</h2>
                    <div className={styles.profile_grid}>
                        <div className={styles.flex_item_none}>
                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1650267008/FIICODE/warning-3092_2_en7rba.svg' width={100} height={100} onClick={() => setCreateMod(true)} />
                            <p>Niciun moderator creat</p>
                        </div>

                        <FlexItemProfile name='Ipatov Ioan Alexandru' profilePicture='https://res.cloudinary.com/multimediarog/image/upload/v1650018340/FIICODE/manage-260_dfu9dg.svg' 
                                         authorization='General' county='Iasi' city='Iasi' comuna='' created='24 Mar 2022' />

                        <FlexItemProfile name='Ipatov Ioan Alexandru' profilePicture='https://res.cloudinary.com/multimediarog/image/upload/v1650018340/FIICODE/manage-260_dfu9dg.svg' 
                                         authorization='General' county='Iasi' city='Iasi' comuna='' created='24 Mar 2022' />

                        <FlexItemProfile name='Ipatov Ioan Alexandru' profilePicture='https://res.cloudinary.com/multimediarog/image/upload/v1650018340/FIICODE/manage-260_dfu9dg.svg' 
                                         authorization='General' county='Iasi' city='Iasi' comuna='' created='24 Mar 2022' />

                        <FlexItemProfile name='Ipatov Ioan Alexandru' profilePicture='https://res.cloudinary.com/multimediarog/image/upload/v1650018340/FIICODE/manage-260_dfu9dg.svg' 
                                         authorization='General' county='Iasi' city='Iasi' comuna='' created='24 Mar 2022' />
                        
                        <div className={styles.flex_item_create}>
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1650265407/FIICODE/green-add-button-12023_oesrh1.svg' width={100} height={100} onClick={() => setCreateMod(true)} />
                            <p>Creează un nou moderator</p>
                        </div>
                    </div>
                </div>
            :
                <CreateModSection setCreateMod={setCreateMod} />
             }
        </>
    )
}

export default CreateMod;