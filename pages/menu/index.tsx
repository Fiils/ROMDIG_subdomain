import type { NextPage } from 'next';
import type { GetServerSideProps } from 'next'
import axios from 'axios'

import { server } from '../../config/server'


const Menu: NextPage = () => {

    return (
        <div>

        </div>
    )
}

export default Menu;

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
    const { req } = ctx;
  
    let redirect = 0;
  
    const response = await axios.post(`${server}/api/sd/authentication/login-status`, {}, { headers: { Cookies: req.headers.cookie || 'a' } })
                            .then(res => res.data)
                            .catch(err => {
                                redirect = 1
                            })
  
    if(redirect === 1 || (response && !response.isLoggedIn)) {
        return {
            redirect: {
                permanent: true,
                destination: '/'
            }
        }
    } else return { props: {} }
  }   