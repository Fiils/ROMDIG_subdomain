import type { NextPage, GetServerSideProps } from 'next'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'

import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';

import styles from '../../styles/scss/ManageMod/ManageModContainer.module.scss'
import GoogleInput from '../../components/CreateMod/GoogleInput'
import { server } from '../../config/server'


interface Moderators { 
    _moderators: [{
        lastName: string;
        firstName: string;
        profilePicture: string;
        creationDate: Date;
        authorization: {
            type: string;
            location: {
                county: string;
                city: string;
                comuna: string;
            }
        }
    }];
}



const ManageMod: NextPage<Moderators> = ({ _moderators }) => {
    const router = useRouter()

    const [ moderators, setModerators ] = useState<any>(_moderators)
    const [ createMod, setCreateMod ] = useState(false)
    const [ errorLocation, setErrorLocation ] = useState(false)
    const [ fullExactPosition, setFullExactPosition ] = useState<any>(null)
    const [ location, setLocation ] = useState('')
    const [ search, setSearch ] = useState(false)
    const [ searchedName, setSearchedName ] = useState('Toate')

    const [ showPassword, setShowPassword ] = useState(false)
    const [ showAdminPassword, setShowAdminPassword ] = useState(false)
    const [ loading, setLoading ] = useState(false)


    const [ firstName, setFirstName ] = useState('')
    const [ lastName, setLastName ] = useState('')
    const [ id, setId ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ userPassword, setUserPassword ] = useState('')
    const [ image, setImage ] = useState('https://res.cloudinary.com/multimediarog/image/upload/v1650018340/FIICODE/manage-260_dfu9dg.svg')
    const [ gender, setGender ] = useState('Bărbat')
    const [ cnp, setCnp ] = useState('')
    const [ street, setStreet ] = useState('')

    const [ fullError, setFullError ] = useState(false)

    const [ error, setError ] = useState({
        firstName: false,
        lastName: false,
        id: false,
        email: false,
        password: false,
        userPassword: false,
        location: false,
        gender: false,
        cnp: false,
        street: false, 
    })

    const [ errorMessages, setErrorMessages ] = useState({
        firstName: '',
        lastName: '',
        id: '',
        email: '',
        password: '',
        userPassword: '',
        location: '',
        gender: '',
        cnp: '',
        street: '', 
    })

    useEffect(() => {
        let locationError = false;
        setErrorLocation(false)

        if(location === '') {
            const getNewModerators = async () => {
                const result = await axios.get(`${server}/api/sd/mod/get-all-per-region?all=true`, { withCredentials: true })
                                        .then(res => res.data)
                                        .catch(err => {
                                            console.log(err)
                                            setErrorLocation(true)
                                        })
    
                if(result) {
                    setModerators(result.moderators)
                    setSearchedName('Toate')
                }
            }
    
            getNewModerators()
            return;
        }

        if(!fullExactPosition || (fullExactPosition.address_components && fullExactPosition.address_components.length <= 0) || fullExactPosition.name !== location) {
            setErrorLocation(true)
            locationError = true
            return;
        }

        let county: any = [];
        if(fullExactPosition && fullExactPosition.address_components) {
            for(let i = 0; i < fullExactPosition.address_components.length; i++) {
                if(fullExactPosition.address_components[i].types.includes('administrative_area_level_1')) {
                    for(let j = 0; j < (fullExactPosition.address_components[i].long_name.split(' ').length > 1 ? fullExactPosition.address_components[i].long_name.split(' ').length - 1 :  fullExactPosition.address_components[i].long_name.split(' ').length); j++){
                        county = [ ...county, fullExactPosition.address_components[i].long_name.split(' ')[j] ]
                    }
                    county = county.join(" ")
                    break;
                }
                if(i === fullExactPosition.address_components.length - 1) {
                    setErrorLocation(true)
                    locationError = true
                }
            }
        } else {
            setErrorLocation(true)
            locationError = true
        }
    
        let comuna: any = [];
        if(fullExactPosition && fullExactPosition.address_components) {
            for(let i = 0; i < fullExactPosition.address_components.length; i++) {
                if(fullExactPosition.address_components[i].types.includes('administrative_area_level_2')) {
                    for(let j = 0; j < fullExactPosition.address_components[i].long_name.split(' ').length; j++){
                        comuna = [ ...comuna, fullExactPosition.address_components[i].long_name.split(' ')[j] ]
                    }
                    comuna = comuna.join(" ")
                    break;
                }
            }
        }

        let isWithoutCity = false, city = location;
        for(let i = 0; i < fullExactPosition.address_components.length; i++) {
            if(fullExactPosition.address_components[i].types.includes('locality')) {
                break;
            } else if(i === fullExactPosition.address_components.length - 1) {
                isWithoutCity = true
                city = ''
            }
        }
    
        if(Array.isArray(comuna)) {
            comuna = ''
        }

        const getNewModerators = async (county: string, comuna: string, location: string, city: string) => {
            const result = await axios.get(`${server}/api/sd/mod/get-all-per-region?county=${county}&comuna=${comuna}&location=${isWithoutCity ? '' : location}&all=false`, { withCredentials: true })
                                    .then(res => res.data)
                                    .catch(err => {
                                        console.log(err)
                                        setErrorLocation(true)
                                    })

            if(result) {
                setModerators(result.moderators)
                setSearchedName(`${county} County${comuna !== '' ? `, ${comuna}, ${city}` : (city !== '' ?  `, ${city}` : '')}`)
            }
        }

        if(!locationError) {
            getNewModerators(county, comuna, location, city)
        }
    }, [search])

    const handleCreateUser = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        setFullError(false)

        setError({
            firstName: false,
            lastName: false,
            id: false,
            email: false,
            password: false,
            userPassword: false,
            location: false,
            gender: false,
            cnp: false,
            street: false, 
        })
    
        setErrorMessages({
            firstName: '',
            lastName: '',
            id: '',
            email: '',
            password: '',
            userPassword: '',
            location: '',
            gender: '',
            cnp: '',
            street: '', 
        })
        
        let locationError = false

        if(!fullExactPosition || (fullExactPosition.address_components && fullExactPosition.address_components.length <= 0) || fullExactPosition.name !== location) {
            setError({ ...error, location: true })
            setErrorMessages({ ...errorMessages, location: 'Localitate invalidă'})
            locationError = true
            setLoading(false)
            return;
        }
        
        let county: any = [];
        if(fullExactPosition && fullExactPosition.address_components) {
            for(let i = 0; i < fullExactPosition.address_components.length; i++) {
                if(fullExactPosition.address_components[i].types.includes('administrative_area_level_1')) {
                    for(let j = 0; j < (fullExactPosition.address_components[i].long_name.split(' ').length > 1 ? fullExactPosition.address_components[i].long_name.split(' ').length - 1 :  fullExactPosition.address_components[i].long_name.split(' ').length); j++){
                        county = [ ...county, fullExactPosition.address_components[i].long_name.split(' ')[j] ]
                    }

                    county = county.join(" ")
                    break;
                }
                if(i === fullExactPosition.address_components.length - 1) {
                    setError({ ...error, location: true })
                    setErrorMessages({ ...errorMessages, location: 'Localitate invalidă' })
                    locationError = true
                }
            }
        } else {
            setError({ ...error, location: true })
            setErrorMessages({ ...errorMessages, location: 'Localitate invalidă' })
            locationError = true
        }
    
        let comuna: any = [], ok = 0;
        if(fullExactPosition && fullExactPosition.address_components) {
            for(let i = 0; i < fullExactPosition.address_components.length; i++) {
                if(fullExactPosition.address_components[i].types.includes('administrative_area_level_2')) {
                    for(let j = 0; j < fullExactPosition.address_components[i].long_name.split(' ').length; j++){
                        comuna = [ ...comuna, fullExactPosition.address_components[i].long_name.split(' ')[j] ]
                    }
                    comuna = comuna.join(" ")
                    break;
                }
            }
        }
        
        let rural = true
        if(Array.isArray(comuna)) {
            comuna = ''
            rural = false
        }

        if(ok === 1 && !comuna){
            setError({ ...error, location: true })
            setErrorMessages({ ...errorMessages, location: 'Localitate invalidă' })
            locationError = true
        }
    
        let city = location, isWithoutCity = false;
        for(let i = 0; i < fullExactPosition.address_components.length; i++) {
            if(fullExactPosition.address_components[i].types.includes('locality')) {
                city = location
                break;
            } else if(i === fullExactPosition.address_components.length - 1) {
                city = ''
                isWithoutCity = true
            }
        }



        const profilePicture = image
        const type = county === location ? 'Judetean' : ((comuna != '' && comuna === location) ? 'Comunal' : (comuna === '' && location !== '') ? 'Orasesc' : (comuna !== '' && location !== '' ? 'Satesc' : ''))
        const user = { firstName, lastName, id, email, password, userPassword, type, profilePicture, city, county, comuna, gender, cnp, rural, street }
        const regex = /^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$/i
        const cnpRegex = /^\d+$/
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

        setError({ 
            lastName: !lastName.length,
            firstName: !firstName.length,
            email: !email.length ? !email.length : (!email.match(emailRegex) ? true : false ),
            password: !password.length ? !password.length : (password.length < 8 ? true : (!regex.test(password) ? true : false )),
            userPassword: !userPassword.length ? !userPassword.length : (userPassword.length < 8 ? true : (!regex.test(userPassword) ? true : false )),
            gender: !gender.length,
            cnp: !cnp.length ? !cnp.length : (!cnpRegex.test(cnp) ? true : (cnp.length !== 13 ? true : false )),
            location: !location.length,
            street: !street.length,
            id: id.length !== 20
        })

        setErrorMessages({
            lastName: !lastName.length ? 'Spațiul nu poate fi gol' : '',
            firstName: !firstName.length ? 'Spațiul nu poate fi gol' : '',
            email: !email.length ? 'Spațiul nu poate fi gol' : (!email.match(emailRegex) ? 'Email invalid' : '' ),
            password: !password.length ? 'Spațiul nu poate fi gol' : (password.length < 8 ? 'Parolă prea scurtă' : (!regex.test(password) ? 'Parola trebuie să conțină caractere alfanumerice' : '' )),
            gender: !gender.length ? 'Spațiul nu poate fi gol' : '',
            cnp: !cnp.length ? 'Spațiul nu poate fi gol' : (!cnpRegex.test(cnp) ? 'CNP-ul conține doar cifre' : (cnp.length !== 13 ? 'CNP-ul are doar 13 cifre' : '' )),
            location: !location.length ? 'Spațiul nu poate fi gol' : '',
            street: !street.length ? 'Spațiul nu poate fi gol' : '',
            id: id.length !== 20 ? 'Insuficiente caractere' : '',
            userPassword: !userPassword.length ? 'Spațiul nu poate fi gol' : (userPassword.length < 8 ? 'Parolă prea scurtă' : (!regex.test(userPassword) ? 'Parola trebuie să conțină caractere alfanumerice' : '' )),
        })
        
        if(!lastName.length || !firstName.length || !email.length || !password.length || !gender.length || !cnp.length || (!city.length &&  !isWithoutCity) || !location.length || !county.length || !street.length || id.length !== 20 || !email.match(emailRegex) || password.length < 8 || !cnpRegex.test(cnp) || !regex.test(password) || cnp.length !== 13 || locationError){
            setLoading(false);
            return;
        } 

        if(user.type !== 'General') {
            if(type === 'Judetean' || (type === 'Comunal' && user.type !== 'Judetean') || (type === 'Orasesc' && user.type !== 'Judetean') || (type === 'Comunal' && user.type !== 'Comunal' && user.type !== 'Judetean') ) {
                setError({ ...error, location: true })
                setErrorMessages({ ...errorMessages, location: 'Locație neautorizată' })
            }
        }

        const result = await axios.post(`${server}/api/sd/authentication/create-user`, user, { withCredentials: true })
                                .then(res => res.data)
                                .catch(err => {
                                    console.log(err)
                                    if(err.response && err.response.data && err.response.data.type === 'email') {
                                        setError({ ...error, email: true })
                                        setErrorMessages({ ...errorMessages,  email: err.response.data.message })
                                    } else if(err.response && err.response.data && err.response.data.type === 'cnp') {
                                        setError({ ...error, cnp: true })
                                        setErrorMessages({ ...errorMessages,  cnp: err.response.data.message })
                                    } else if(err.response && err.response.data && err.response.data.type === 'id') {
                                        setError({ ...error, id: true })
                                        setErrorMessages({ ...errorMessages,  id: err.response.data.message })
                                    } else if(err.response && err.response.data && err.response.data.type === 'location') {
                                        setError({ ...error, location: true })
                                        setErrorMessages({ ...errorMessages, location: 'Locație neautorizată' })
                                    } else setFullError(true)

                                    setLoading(false)
                                })

        if(result && result.message === 'Authorized user created') {
            setFirstName('')
            setLastName('')
            setId('')
            setEmail('')
            setPassword('')
            setUserPassword('')
            setImage('https://res.cloudinary.com/multimediarog/image/upload/v1650018340/FIICODE/manage-260_dfu9dg.svg')
            setLocation('')
            setGender('Bărbat')
            setCnp('')
            setStreet('')
            setFullExactPosition(null)
            setLoading(false)
            router.reload()
        }
    }    

    return (
        <div>
            <div className={styles.fcontainer}>
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                    <h2>Moderatori: {moderators.length}</h2>
                    <div style={{ width: '40%', position: 'absolute', right: 0, display: 'flex', alignItems: 'center', gap: '1em' }}>
                        <GoogleInput index={2} setFullExactPosition={setFullExactPosition} location={location} setLocation={setLocation} error={errorLocation} setError={setErrorLocation} />
                        <div className={styles.button_search}>
                            <button onClick={() => setSearch(!search)}>Caută</button>
                        </div>
                    </div>
                </div>
                <div className={styles.results_headline}>
                    <h1>Rezultate pentru: {searchedName}</h1>
                </div>
            </div>

                <div className={styles.container_moderators}>
                    <div className={styles.moderator_wrapper}>
                        <div className={styles.moderator_profile}>
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1648811329/FIICODE/tumblr-logo-2434_lr6qoq.svg' width={100} height={100} />
                            <span id='#text'>Ipatov Ioan Alexandru</span>
                        </div>
                        <div className={styles.moderator_info}>

                        <div style={{ backgroundColor: 'rgb(250, 250, 250)', paddingTop: 1, paddingBottom: 100  }}>
                            <div className={styles.profile}>

                                    <TextField id='name' label='Nume' variant='standard' value={lastName} onChange={e => { setError({ ...error, lastName: false}); setErrorMessages({ ...errorMessages, lastName: '' }); setLastName(e.target.value) } } error={error.lastName} helperText={errorMessages.lastName} />
                                    <TextField id='firstName' label='Prenume' variant='standard' value={firstName} onChange={e => { setError({ ...error, firstName: false}); setErrorMessages({ ...errorMessages, firstName: '' }); setFirstName(e.target.value) } } error={error.firstName} helperText={errorMessages.firstName} />


                                    <TextField id='email' label='Email' variant='standard' value={email} onChange={e => { setError({ ...error, email: false}); setErrorMessages({ ...errorMessages, email: '' }); setEmail(e.target.value) } } error={error.email} helperText={errorMessages.email} />

                                    <FormControl variant='standard' error={error.password}>
                                        <InputLabel htmlFor='password'>Parolă</InputLabel>
                                        <Input id='password' type={showAdminPassword ? 'text' : 'password'} value={password} onChange={e => { setError({ ...error, password: false}); setErrorMessages({ ...errorMessages, password: '' }); setPassword(e.target.value) } } 
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                onClick={() => setShowAdminPassword(!showAdminPassword)}
                                                edge="end"
                                                >
                                                    {showAdminPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        />
                                        <FormHelperText>{errorMessages.password}</FormHelperText>
                                    </FormControl>

                                <GoogleInput index={1} setLocation={setLocation} error={error} setError={setError} errorMessages={errorMessages} setErrorMessages={setErrorMessages} location={location} setFullExactPosition={setFullExactPosition} />

                            </div>
                        </div>


                        <div className={styles.account_title} style={{ marginTop: 100 }}> 
                            <h2>Cont Utilizator:</h2>
                        </div>

                        <div style={{ backgroundColor: 'rgb(250, 250, 250)', paddingTop: 1, paddingBottom: 100  }}>
                            <div className={styles.profile}>

                                <FormControl variant='standard' error={error.userPassword} fullWidth>
                                    <InputLabel htmlFor='userPassword'>Parolă</InputLabel>
                                    <Input name='userPassword' id='userPassword' type={showPassword ? 'text' : 'password'} value={userPassword} onChange={e => { setError({ ...error, userPassword: false}); setErrorMessages({ ...errorMessages, userPassword: '' }); setUserPassword(e.target.value) } } 
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end" 
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    />
                                    <FormHelperText>{errorMessages.userPassword}</FormHelperText>
                                </FormControl>

                                <FormControl variant='standard' error={error.gender} fullWidth>
                                    <InputLabel id="gender-label">Sex</InputLabel>
                                    <Select
                                    labelId="gender-label"
                                    id="gender"
                                    value={gender}
                                    label="Sex"
                                    onChange={(e: any) => { setError({ ...error, gender: false }); setErrorMessages({ ...errorMessages, gender: '' }); setGender(e.target.value) } }
                                    >
                                        <MenuItem value={'Bărbat'}>Bărbat</MenuItem>
                                        <MenuItem value={'Femeie'}>Femeie</MenuItem>
                                    </Select>
                                    <FormHelperText>{errorMessages.gender}</FormHelperText>
                                </FormControl>

                                <TextField id='cnp' label='Cod Numeric Personal' error={error.cnp} variant='standard' value={cnp} onChange={e => { setError({ ...error, cnp: false}); setErrorMessages({ ...errorMessages, cnp: '' }); setCnp(e.target.value) } } helperText={errorMessages.cnp} />

                                <TextField id='street' label='Stradă' variant='standard' error={error.street} value={street} onChange={e => { setError({ ...error, street: false}); setErrorMessages({ ...errorMessages, street: '' }); setStreet(e.target.value) } } helperText={errorMessages.street} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )   
}

export default ManageMod;


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

    const moderators = await axios.get(`${server}/api/sd/mod/get-all-per-region`, { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' }})
                                .then(res => res.data)
                                .catch(err => {
                                    console.log(err)
                                })

    return { 
        props: {
            _moderators: moderators.moderators
        }
    }
}   