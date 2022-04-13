import React, { useState, useContext, useEffect } from "react"
import axios from 'axios'
import { server } from '../config/server'

interface User {
    user: {
        isLoggedIn: boolean;
        userId: string;
    }
    setUser: any;
}


const AuthContext = React.createContext<any>({})

export function AuthProvider(props: any) {
    const [ user, setUser ] = useState({ isLoggedIn: false, userId: '', type: '' })

    async function login() {
        const response = await axios.get(`${server}/api/functionalities/cookie-ax`, { withCredentials: true })
                            .then(res => res.data)
                            .catch(err => err.response)    
        if(response){
            setUser({ isLoggedIn: response.isLoggedIn, userId: response.userId, type: response.type  })
        }
    }
    useEffect(() => {
        const source = axios.CancelToken.source()
        
        login()

        return () => {
            source.cancel()
        }
    }, [])

    const value: User = {user, setUser}
    return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
}

export function useAuth(): User {
    return useContext<User>(AuthContext)
}