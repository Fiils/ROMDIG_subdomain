import type { NextPage } from 'next';

import styles from '../../styles/scss/CreateMod/Container.module.scss'

const CreateMod: NextPage = () => {

    return (
        <div className={styles.fcontainer}>
                <h2>Moderatori</h2>
            <div className={styles.info_statistics}>
                <div className={styles.grid_item}>
                    Total Moderatori:   
                    
                </div>
                <div className={styles.grid_item}>

                </div>
                <div className={styles.grid_item}>

                </div>
            </div>
        </div>
    )
}

export default CreateMod;