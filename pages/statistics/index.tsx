import type { NextPage, GetServerSideProps } from 'next';
import { PieChart } from 'react-minimal-pie-chart'
import axios from 'axios'

import { server } from '../../config/server'
import styles from '../../styles/scss/Statistics/Container.module.scss';


const Statistics: NextPage = () => {

    const defaultLabelStyle = {
        fontSize: '10px',
        fontFamily: 'sans-serif',
      };

    return (
        <div style={{ paddingBottom: 40}}>
            <div className={styles.grid}>
                <div className={styles.basic_info}>
                    <h1>Statistici sumative</h1>
                    <div>
                        <PieChart 
                            data={[
                                { title: 'Orase', value: 28, color: '#E38627' },
                                { title: 'Comune', value: 32, color: '#C13C37' },
                                { title: 'Sate', value: 40, color: '#6A2135' },
                            ]}
                            segmentsShift={3}
                            radius={PieChart.defaultProps.radius - 3}
                            style={{ height: 150, width: 150 }} 
                            label={({ dataEntry }) => `${Math.round(dataEntry.percentage) + '%'}`}
                            labelStyle={{
                                ...defaultLabelStyle,
                            }}
                            lengthAngle={-360} 
                            animate
                        />
                    </div>
                    <div className={styles.flex_info}>
                        <h3>Total moderatori: 35</h3>
                        <h3>Total județe: 35</h3>
                        <h3>Total orașe: 432</h3>
                    </div>
                    <div className={styles.flex_info}>
                        <h3>Total sate: 4628</h3>
                        <h3>Total comune: 2475</h3>
                        <h3>Total localități: 7628</h3>
                    </div>
                    <div className={styles.legend}>
                        <div style={{ position: 'relative'}}>
                            <span className={styles.city}>Orașe</span>
                        </div>
                        <div style={{ position: 'relative'}}>
                            <span className={styles.comuna}>Comune</span>
                        </div>
                        <div style={{ position: 'relative'}}>
                            <span className={styles.village}>Sate</span>
                        </div>
                    </div>
                </div>

                <div className={styles.basic_info}>
                    <h1>Statistici statusuri</h1>
                    <div>
                        <PieChart 
                            data={[
                                { title: 'Trimise', value: 28, color: '#E38627' },
                                { title: 'Vizionate', value: 32, color: '#C13C37' },
                                { title: 'În lucru', value: 40, color: '#6A2135' },
                                { title: 'Efectuate', value: 53, color: '#BA5A31' }
                            ]}
                            segmentsShift={3}
                            radius={PieChart.defaultProps.radius - 3}
                            style={{ height: 150, width: 150 }} 
                            label={({ dataEntry }) => `${Math.round(dataEntry.percentage) + '%'}`}
                            labelStyle={{
                                ...defaultLabelStyle,
                            }}
                            animate
                        />
                    </div>

                    <div className={styles.flex_info}>
                        <h3>Trimise: 35</h3>
                        <h3>Vizionate: 35</h3>
                        <h3>În lucru: 432</h3>
                        <h3>Efectuate: 438</h3>
                    </div>

                    <div className={styles.legend}>
                        <div style={{ position: 'relative' }}>
                            <span className={styles.county_2}>Trimise</span>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <span className={styles.city_2}>Vizionate</span>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <span className={styles.comuna_2}>În lucru</span>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <span className={styles.village_2}>Efectuate</span>
                        </div>
                    </div>
                </div>
                
            </div>
                
                <div className={`${styles.grid} ${styles.grid_reverse} `}>
                    <div className={styles.basic_info}>
                        <h1>Statistici geografice - utilizatori</h1>
                        <div className={styles.flex_info}>
                            <h3>Total utilizatori: 33425</h3>
                            <h3>Rural: 23435</h3>
                            <h3>Urban: 9990</h3>
                        </div>
                        <div>
                            <PieChart 
                                data={[
                                    { title: 'Rural', value: 23435, color: '#E38627' },
                                    { title: 'Urban', value: 9990, color: '#C13C37' },
                                ]}
                                segmentsShift={3}
                                radius={PieChart.defaultProps.radius - 3}
                                style={{ height: 150, width: 150 }} 
                                label={({ dataEntry }) => `${Math.round(dataEntry.percentage) + '%'}`}
                                labelStyle={{
                                    ...defaultLabelStyle,
                                }}
                                lengthAngle={-360} 
                                animate
                            />
                        </div>

                        <div className={styles.legend}>
                            <div style={{ position: 'relative' }}>
                                <span className={styles.urban}>Urban</span>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <span className={styles.rural}>Rural</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.basic_info}>
                        <h1>Statistici geografice - postări</h1>
                        <div>
                            <PieChart 
                                data={[
                                    { title: 'Județ', value: 1428, color: '#E38627' },
                                    { title: 'Oraș', value: 312, color: '#C13C37' },
                                    { title: 'Comună', value: 430, color: '#6A2135' },
                                    { title: 'Sat', value: 532, color: '#BA5A31' }
                                ]}
                                segmentsShift={3}
                                radius={PieChart.defaultProps.radius - 3}
                                style={{ height: 150, width: 150 }} 
                                label={({ dataEntry }) => `${Math.round(dataEntry.percentage) + '%'}`}
                                labelStyle={{
                                    ...defaultLabelStyle,
                                }}
                                animate
                            />
                        </div>
                        <div className={styles.flex_info}>
                            <h3>Total postări: 4628</h3>
                            <h3>Mediul urban: 2475</h3>
                            <h3>Mediul rural: 7628</h3>
                        </div>
                        <div className={styles.flex_info}>
                            <h3>Penrtu județ: 35</h3>
                            <h3>Pentru oraș: 35</h3>
                            <h3>Pentru comună: 35</h3>
                            <h3>Pentru sat: 432</h3>
                        </div>

                        <div className={styles.legend}>
                            <div style={{ position: 'relative' }}>
                                <span className={styles.county_2}>Județ</span>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <span className={styles.city_2}>Oraș</span>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <span className={styles.comuna_2}>Comună</span>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <span className={styles.village_2}>Sat</span>
                            </div>
                        </div>
                    </div>
                    
                </div>



                <div className={styles.grid}>
                    <div className={styles.basic_info}>
                        <h1>Statistici utilizatori</h1>
                        <div>
                            <PieChart 
                                data={[
                                    { title: 'Bărbați', value: 28, color: '#E38627' },
                                    { title: 'Femei', value: 32, color: '#C13C37' },
                                ]}
                                segmentsShift={3}
                                radius={PieChart.defaultProps.radius - 3}
                                style={{ height: 150, width: 150 }} 
                                label={({ dataEntry }) => `${Math.round(dataEntry.percentage) + '%'}`}
                                labelStyle={{
                                    ...defaultLabelStyle,
                                }}
                                lengthAngle={-360} 
                                animate
                            />
                        </div>
                        <div className={styles.flex_info}>
                            <h3>Bărbați: 43</h3>
                            <h3>Femei: 35</h3>
                        </div>
                        <div className={styles.flex_info}>
                            <h3>Au poză de profil: 304</h3>
                            <h3>Nu au poză de profil: 8374</h3>
                        </div>

                        <div className={styles.legend}>
                            <div style={{ position: 'relative' }}>
                                <span className={styles.men}>Bărbați</span>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <span className={styles.women}>Femei</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.basic_info}>
                        <h1>Statistici utilizatori</h1>
                        <div>
                            <PieChart 
                                data={[
                                    { title: 'Active', value: 202, color: '#E38627' },
                                    { title: 'Inactive', value: 322, color: '#C13C37' },
                                ]}
                                segmentsShift={3}
                                radius={PieChart.defaultProps.radius - 3}
                                style={{ height: 150, width: 150 }} 
                                label={({ dataEntry }) => `${Math.round(dataEntry.percentage) + '%'}`}
                                labelStyle={{
                                    ...defaultLabelStyle,
                                }}
                                animate
                            />
                        </div>
                        <div className={styles.flex_info}>
                            <h3>Conturi active: 35</h3>
                            <h3>Conturi inactive: 35</h3>
                            <br />
                            <h3>Au comentat: 432</h3>
                            <h3>N-au comentat: 438</h3>
                        </div>

                        <div className={styles.legend}>
                            <div style={{ position: 'relative' }}>
                                <span className={styles.active}>Active</span>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <span className={styles.inactive}>Inactive</span>
                            </div>
                        </div>
                    </div>
                    
                </div>



                <div className={`${styles.grid} ${styles.grid_reverse} `}>
                    <div className={styles.basic_info}>
                        <h1>Statistici postări</h1>
                        <div className={styles.flex_info}>
                            <h3>Total postări: 33425</h3>
                            <h3>Au poze: 3242</h3>
                            <h3>N-au poze: 9990</h3>
                            <h3>Au video: 8471</h3>
                        </div>
                        <div>
                            <PieChart 
                                data={[
                                    { title: 'Cu poze', value: 23435, color: '#E38627' },
                                    { title: 'Fără poze', value: 9990, color: '#C13C37' },
                                ]}
                                segmentsShift={3}
                                radius={PieChart.defaultProps.radius - 3}
                                style={{ height: 150, width: 150 }} 
                                label={({ dataEntry }) => `${Math.round(dataEntry.percentage) + '%'}`}
                                labelStyle={{
                                    ...defaultLabelStyle,
                                }}
                                lengthAngle={-360} 
                                animate
                            />
                        </div>

                        <div className={styles.legend}>
                            <div style={{ position: 'relative' }}>
                                <span className={styles.ph}>Cu poze</span>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <span className={styles.nph}>Fără poze</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.basic_info}>
                        <h1>Statistici postări</h1>
                        <div>
                            <PieChart 
                                data={[
                                    { title: 'Au comentarii', value: 328, color: '#E38627' },
                                    { title: 'Nu au comentarii', value: 32, color: '#C13C37' },
                                ]}
                                segmentsShift={3}
                                radius={PieChart.defaultProps.radius - 3}
                                style={{ height: 150, width: 150 }} 
                                label={({ dataEntry }) => `${Math.round(dataEntry.percentage) + '%'}`}
                                labelStyle={{
                                    ...defaultLabelStyle,
                                }}
                                animate
                            />
                        </div>
                        <div className={styles.flex_info}>
                            <div style={{ position: 'relative' }}>
                                <h3 className={styles.com}>Au comentarii: 7532</h3>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <h3 className={styles.ncom}>Nu au comentarii: 1236</h3>
                            </div>
                        </div>
                        <div className={styles.flex_info}>
                            <h3>30 zile: 4628</h3>
                            <h3>14 zile: 2475</h3>
                            <h3>7 zile: 7628</h3>
                            <h3>3 zile: 424</h3>
                            <h3>1 zi: 24</h3>
                        </div>


                        <div className={styles.legend}>
                        <div style={{ position: 'relative' }}>
                                <span className={styles.ph}>Au comentarii</span>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <span className={styles.nph}>Nu au comentarii</span>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
    )
}

export default Statistics;

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
    const { req } = ctx;

    const token = req.cookies['Allow-Authorization']
    let redirect = false
  
    if(!token) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            },
            props: {}
        }
    }
  
    const user = await axios.post(`${server}/api/sd/authentication/login-status`, {}, { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' } })
                        .then(res => res.data)
                        .catch(err => {
                            console.log(err);
                            redirect = true
                        })
  
    if(redirect)  {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            },
            props: {}
        }
    } else return { props: {} }
}   