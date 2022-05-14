import type { NextPage, GetServerSideProps } from 'next';
import { PieChart } from 'react-minimal-pie-chart'
import axios from 'axios'
import { useState } from 'react'

import { server } from '../../config/server'
import styles from '../../styles/scss/Statistics/Container.module.scss';
import useWindowSize from '../../utils/useWindowSize'
import { NoSSR } from '../../utils/NoSsr'

interface Statistics {
    _statistics: any;
}


const Statistics: NextPage<Statistics> = ({ _statistics }) => {
    const [ statistics, setStatistics ] = useState(_statistics)

    const [ width ] = useWindowSize()

    const defaultLabelStyle = {
        fontSize: '10px',
        fontFamily: 'sans-serif',
      };

    return (
        <NoSSR fallback={<div style={{ height: '100vh', width: '100vw'}}></div>}>
        <div style={{ paddingBottom: 40}}>
            <div className={styles.grid}>
                <div className={styles.basic_info}>
                    <h1>Statistici sumative (utilizatori)</h1>
                    <div>
                        <PieChart 
                            data={[
                                { title: 'Orașe', value: statistics.summative.cities, color: '#E38627' },
                                { title: 'Comune', value: statistics.summative.comune, color: '#C13C37' },
                                { title: 'Sate', value: statistics.summative.villages, color: '#6A2135' },
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
                    <div className={styles.flex_info_container}>
                        <div className={styles.flex_info}>
                            <h3>Total moderatori: {statistics.summative.mods}</h3>
                            <h3>Total județe: {statistics.summative.counties}</h3>
                            <h3>Total orașe: {statistics.summative.cities}</h3>
                        </div>
                        <div className={styles.flex_info}>
                            <h3>Total sate: {statistics.summative.villages}</h3>
                            <h3>Total comune: {statistics.summative.comune}</h3>
                            <h3>Total localități: {statistics.summative.localities}</h3>
                        </div>
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
                                { title: 'Trimise', value: statistics.status.sent, color: '#E38627' },
                                { title: 'Vizionate', value: statistics.status.seen, color: '#C13C37' },
                                { title: 'În lucru', value: statistics.status.work, color: '#6A2135' },
                                { title: 'Efectuate', value: statistics.status.done, color: '#BA5A31' }
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

                    <div className={`${styles.flex_info} ${styles.status_grid}`}>
                        <h3>Trimise: {statistics.status.sent}</h3>
                        <h3>Vizionate: {statistics.status.seen}</h3>
                        <h3>În lucru: {statistics.status.work}</h3>
                        <h3>Efectuate: {statistics.status.done}</h3>
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
                        <div>
                            <PieChart 
                                data={[
                                    { title: 'Rural', value: statistics.geoUsers.rural, color: '#E38627' },
                                    { title: 'Urban', value: statistics.geoUsers.urban, color: '#C13C37' },
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
                            <h3>Total utilizatori: {statistics.geoUsers.total}</h3>
                            <h3>Rural: {statistics.geoUsers.rural}</h3>
                            <h3>Urban: {statistics.geoUsers.urban}</h3>
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
                                    { title: 'Județ', value: statistics.geoPosts.county, color: '#E38627' },
                                    { title: 'Oraș', value: statistics.geoPosts.city, color: '#C13C37' },
                                    { title: 'Comună', value: statistics.geoPosts.comuna, color: '#6A2135' },
                                    { title: 'Sat', value: statistics.geoPosts.village, color: '#BA5A31' }
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
                        <div className={styles.flex_info_container}>
                            <div className={styles.flex_info}>
                                <h3>Total postări: {statistics.geoPosts.total}</h3>
                                <h3>Mediul urban: {statistics.geoPosts.urban}</h3>
                                <h3>Mediul rural: {statistics.geoPosts.rural}</h3>
                            </div>
                            <div className={styles.flex_info}>
                                <h3>Penrtu județ: {statistics.geoPosts.county}</h3>
                                <h3>Pentru oraș: {statistics.geoPosts.city}</h3>
                                <h3>Pentru comună: {statistics.geoPosts.comuna}</h3>
                                <h3>Pentru sat: {statistics.geoPosts.village}</h3>
                            </div>
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
                                    { title: 'Bărbați', value: statistics.users.men, color: '#E38627' },
                                    { title: 'Femei', value: statistics.users.women, color: '#C13C37' },
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
                        <div className={styles.flex_info_container}>
                            <div className={styles.flex_info}>
                                <h3>Bărbați: {statistics.users.men}</h3>
                                <h3>Femei: {statistics.users.women}</h3>
                            </div>
                            <div className={styles.flex_info}>
                                <h3>30 zile: {statistics.users.days30}</h3>
                                <h3>14 zile: {statistics.users.days14}</h3>
                                <h3>7 zile: {statistics.users.days7}</h3>
                                <h3>Ultima zi: {statistics.users.day1}</h3>
                            </div>
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
                                    { title: 'Active', value: statistics.users.active, color: '#E38627' },
                                    { title: 'Inactive', value: statistics.users.inactive, color: '#C13C37' },
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
                        {width > 500 ?
                        <div className={styles.flex_info}>
                            <h3>Conturi active: {statistics.users.active}</h3>
                            <h3>Conturi inactive: {statistics.users.inactive}</h3>
                            <br />
                            <h3>Au comentat: {statistics.users.usersCommented}</h3>
                            <h3>N-au comentat: {statistics.users.usersNotCommented}</h3>
                        </div>
                        :
                            <div className={styles.flex_info_container}>
                                <div className={styles.flex_info}>
                                    <h3>Conturi active: {statistics.users.active}</h3>
                                    <h3>Conturi inactive: {statistics.users.inactive}</h3>
                                </div>
                                <div className={styles.flex_info}>
                                    <h3>Au comentat: {statistics.users.usersCommented}</h3>
                                    <h3>N-au comentat: {statistics.users.usersNotCommented}</h3>
                                </div>
                            </div>
                        }

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

                        <div>
                            <PieChart 
                                data={[
                                    { title: 'Cu poze', value: statistics.posts.withMedia, color: '#E38627' },
                                    { title: 'Fără poze', value: statistics.posts.noMedia, color: '#C13C37' },
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
                            <h3>Total postări: {statistics.posts.total}</h3>
                            <h3>Au poze: {statistics.posts.withMedia}</h3>
                            <h3>N-au poze: {statistics.posts.noMedia}</h3>
                            <h3>Au video: {statistics.posts.withVideo}</h3>
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
                                    { title: 'Au comentarii', value: statistics.posts.withComments, color: '#E38627' },
                                    { title: 'Nu au comentarii', value: statistics.posts.withNoComments, color: '#C13C37' },
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

                        <div className={styles.flex_info_container}>
                            <div className={styles.flex_info}>
                                <div style={{ position: 'relative' }}>
                                    <h3 className={styles.com}>Au comentarii: {statistics.posts.withComments}</h3>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <h3 className={styles.ncom}>Nu au comentarii: {statistics.posts.withNoComments}</h3>
                                </div>
                            </div>
                            <div className={styles.flex_info}>
                                <h3>30 zile: {statistics.posts.days30}</h3>
                                <h3>14 zile: {statistics.posts.days14}</h3>
                                <h3>7 zile: {statistics.posts.days7}</h3>
                                <h3>1 zi: {statistics.posts.day1}</h3>
                            </div>
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
        </NoSSR>
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
    }

    const result = await axios.get(`${server}/api/sd/mod/statistics`, { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' } })
                            .then(res => res.data)
                            .catch(err => {
                                console.log(err)
                                redirect = true
                            })
                
    if(redirect)  {
        return {
            notFound: true,
            props: {}
        }
    }

    return {
        props: {
            _statistics: result.statistics
        }
    }
}   