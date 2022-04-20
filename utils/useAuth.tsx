import React, { useState, useContext, useEffect } from "react"
import axios from 'axios'
import { server } from '../config/server'

interface User {
    user: {
        isLoggedIn: boolean;
        userId: string;
        profilePicture: string;
        type: string;
        name: string;
        county: string;
    }
    setUser: any;
}


const AuthContext = React.createContext<any>({})

export function AuthProvider(props: any) {
    const [ user, setUser ] = useState({ isLoggedIn: false, userId: '', type: '', profilePicture: '/', name: '', county: '' })

    async function login() {
        const response = await axios.post(`${server}/api/sd/authentication/login-status`, {}, { withCredentials: true })
                            .then(res => res.data)
                            .catch(err => err.response)    
        if(response){
            setUser({ isLoggedIn: response.isLoggedIn, userId: response.userId, type: response.type, profilePicture: response.profilePicture, name: response.name, county: response.county  })
        }
    }
    useEffect(() => {
        const source = axios.CancelToken.source()
        
        login()

        return () => {
            source.cancel()
        }
    }, [])

    const isLoggedIn = user.isLoggedIn
    const userId = user.userId
    const type = user.type
    const profilePicture = user.profilePicture
    const name = user.name
    const county = user.county
    const value = {county, name, isLoggedIn, userId, type, profilePicture, setUser}
    return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext)
}