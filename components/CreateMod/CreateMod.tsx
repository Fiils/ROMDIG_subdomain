import { FC, Dispatch, SetStateAction, useEffect } from 'react';
import { useState } from 'react'
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


import styles from '../../styles/scss/CreateMod/CreateModContainer.module.scss'
import GoogleInput from './GoogleInput'
import UserGoogleInput from './UserGoogleInput'
import { server } from '../../config/server'
import { useAuth } from '../../utils/useAuth'


interface InitialProps {
    setCreateMod: Dispatch<SetStateAction<boolean>>
}

const CreateMod: FC<InitialProps> = ({ setCreateMod }) => {
    const router = useRouter()
    const auth = useAuth()

    const [ showPassword, setShowPassword ] = useState(false)
    const [ showAdminPassword, setShowAdminPassword ] = useState(false)
    const [ loading, setLoading ] = useState(false)


    const [ firstName, setFirstName ] = useState('')
    const [ lastName, setLastName ] = useState('')
    const [ id, setId ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ userPassword, setUserPassword ] = useState('')
    const [ image, setImage ] = useState('https://res.cloudinary.com/multimediarog/image/upload/v1651419562/FIICODE/skill-8804_ibppuw.svg')
    const [ location, setLocation ] = useState('')
    const [ gender, setGender ] = useState('Bărbat')
    const [ cnp, setCnp ] = useState('')
    const [ street, setStreet ] = useState('')
    const [ fullExactPosition, setFullExactPosition ] = useState<any>()
    const [ isComuna, setIsComuna ] = useState(false)


    const [ userFullExactPosition, setUserFullExactPosition ] = useState<any>()
    const [ userLocation, setUserLocation ] = useState('')


    const [ error, setError ] = useState({
        firstName: false,
        lastName: false,
        id: false,
        email: false,
        password: false,
        userPassword: false,
        location: false,
        userLocation: false,
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

    const [ fullError, setFullError ] = useState(false)

    const [ callCallback, setCallCallback ] = useState(false)

    useEffect(() => {
        const loadScript = () => {
            const url = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`
          let script = document.createElement("script");
          script.type = "text/javascript";
      
          let scripts = Array.from(document.querySelectorAll('script')).map(scr => scr.src);
      
      
      
          if ((script as any).readyState) {
            (script as any).onreadystatechange = function() {
              if ((script as any).readyState === "loaded" || (script as any).readyState === "complete") {
                (script as any).onreadystatechange = null;
                setCallCallback(true)
              }
            };
          } else {
            script.onload = () => setCallCallback(true)
          }
      
          script.src = url;  
          document.getElementsByTagName("head")[0].appendChild(script);
      };

      loadScript()
    }, [])



    const convertToBase64 = (file: any): any => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader()
          fileReader.readAsDataURL(file)
          fileReader.onload = () => {
            resolve(fileReader.result)
          }
          fileReader.onerror = (error) => {
            reject(error)
          }
        })
    }

    const uploadPhoto = async (e: any) => {
        if(e.target.files[0] && e.target.files[0].size / 1000000 < 10) {
            const base64: string = await convertToBase64(e.target.files[0])
            setImage(base64)
        }
    }

    const generateId = () => {
        const allowedValues = '0123456789abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        const id = []
        for(let i = 0; i < 20; i++) {
            id.push(allowedValues[Math.floor(Math.random() * allowedValues.split('').length)])
        }

        setId(id.join('')) 
    }

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
            userLocation: false 
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
        

        // Verifying the validity of the GoogleInput for the admin
        let locationError = false
        let county: any = [];
        let comuna: any = [], ok = 0;
        let rural = true
        let city = location, isWithoutCity = false;
        if(true) {

            if(!fullExactPosition || (fullExactPosition.address_components && fullExactPosition.address_components.length <= 0) || fullExactPosition.name !== location || !fullExactPosition.address_components) {
                setError({ ...error, location: true })
                setErrorMessages({ ...errorMessages, location: 'Localitate invalidă'})
                locationError = true
                setLoading(false)
                return;
            }
            
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
            
            if(Array.isArray(comuna)) {
                comuna = ''
                rural = false
            }

            if(ok === 1 && !comuna){
                setError({ ...error, location: true })
                setErrorMessages({ ...errorMessages, location: 'Localitate invalidă' })
                locationError = true
            }

            if(isComuna && comuna === '') {
                setError({ ...error, location: true })
                setErrorMessages({ ...errorMessages, location: 'Localitate invalidă' })
                locationError = true
                setLoading(false)
                return;
            }
        
            for(let i = 0; i < fullExactPosition.address_components.length; i++) {
                if(fullExactPosition.address_components[i].types.includes('locality')) {
                    city = location
                    break;
                } else if(i === fullExactPosition.address_components.length - 1) {
                    city = ''
                    isWithoutCity = true
                }
            }
        }

        let userLocationError = false
        let userCounty: any = [];
        let userComuna: any = [], userOk = 0;
        let userRural = false
        let userCity = userLocation, userIsWithoutCity = false;
        // Verifying the validity of the GoogleInput for the user of admin
        if(true) {

            if(userFullExactPosition && userFullExactPosition.address_components) {
                for(let i = 0; i < userFullExactPosition.address_components.length; i++) {
                    if(userFullExactPosition.address_components[i].types.includes('administrative_area_level_1')) {
                        for(let j = 0; j < (userFullExactPosition.address_components[i].long_name.split(' ').length > 1 ? userFullExactPosition.address_components[i].long_name.split(' ').length - 1 :  userFullExactPosition.address_components[i].long_name.split(' ').length); j++){
                            userCounty = [ ...userCounty, userFullExactPosition.address_components[i].long_name.split(' ')[j] ]
                        }
                        userCounty = userCounty.join(" ")
                        break;
                    }
                    if(i === userFullExactPosition.address_components.length - 1) {
                        setError({ ...error, userLocation: true })
                        userLocationError = true
                    }
                }
            } else {
                setError({ ...error, userLocation: true })
                userLocationError = true
            }
    
            if(userFullExactPosition && userFullExactPosition.address_components) {
                for(let i = 0; i < userFullExactPosition.address_components.length; i++) {
                    if(userFullExactPosition.address_components[i].types.includes('administrative_area_level_2')) {
                        userOk = 1;
                        for(let j = 0; j < userFullExactPosition.address_components[i].long_name.split(' ').length; j++){
                            userComuna = [ ...userComuna, userFullExactPosition.address_components[i].long_name.split(' ')[j] ]
                        }
                        userComuna = userComuna.join(" ")
                        break;
                    }
                }
            }
    
            if(Array.isArray(userComuna)) {
                userComuna = ''
                userRural = false
            }
            
            if(userOk === 1 && !userComuna){
                setError({ ...error, userLocation: true })
                userLocationError = true
            }

            if(userComuna && userComuna !== '') {
                userRural = true
            }

            for(let i = 0; i < userFullExactPosition.address_components.length; i++) {
                if(userFullExactPosition.address_components[i].types.includes('locality')) {
                    userCity = location
                    break;
                } else if(i === userFullExactPosition.address_components.length - 1) {
                    userCity = ''
                    userIsWithoutCity = true
                    setError({ ...error, userLocation: true })
                }
            }
        }
        
        console.log(userFullExactPosition.address_components)
        const profilePicture = image
        const type = (comuna === '' && isWithoutCity) ? 'Judetean' : ((comuna != '' && comuna === location) ? 'Comunal' : ((comuna === '' && location !== '') ? 'Orasesc' : (comuna !== '' && location !== '' ? 'Satesc' : '')))
        const user = { firstName, lastName, id, email, password, userPassword, type, profilePicture, city, county, comuna, gender, cnp, rural, street, userCounty, userComuna, userLocation, userRural, userIsWithoutCity }
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
            id: id.length !== 20,
            userLocation: !userLocation.length || userIsWithoutCity,
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
        
        if(!lastName.length || !firstName.length || !userPassword.length || userPassword.length < 8 || !regex.test(userPassword) || !email.length || !password.length || !gender.length || !cnp.length || (!city.length &&  !isWithoutCity) || !location.length || !county.length || !street.length || id.length !== 20 || !email.match(emailRegex) || password.length < 8 || !cnpRegex.test(cnp) || !regex.test(password) || cnp.length !== 13 || locationError || userLocationError || error.userLocation || userIsWithoutCity){
            setLoading(false);
            return;
        } 

        if(user.type !== 'General') {
            if(type === 'Judetean' || (type === 'Comunal' && user.type !== 'Judetean') || (type === 'Orasesc' && user.type !== 'Judetean') ) {
                setError({ ...error, location: true })
                setErrorMessages({ ...errorMessages, location: 'Locație neautorizată' })
            }
        }

        const result = await axios.post(`${server}/api/sd/authentication/create-user?isComuna=${(isComuna && (auth.type === 'General' || auth.type === 'Judetean')) ? 'true' : 'false'}`, user, { withCredentials: true })
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
                                    } else if(err.response && err.response.data && err.response.data.type === 'userLocation') {
                                        setError({ ...error, userLocation: true })
                                    }else setFullError(true)

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
            setUserLocation('')
            setUserFullExactPosition(null)
            setStreet('')
            setFullExactPosition(null)
            setLoading(false)
            router.reload()
        }
    }    

    return (
        <>
                <div className={styles.container}>
                    <div className={styles.go_back}>
                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1650268110/FIICODE/left-arrow-7360_vff2lx.svg' width={40} height={20} />
                        <span id='#text' onClick={() => setCreateMod(false)}>Înapoi</span>
                    </div>

                    <div className={styles.account_title} style={{ marginTop: 50, display: 'flex', alignItems: 'center', gap: 5 }}> 
                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1650303545/FIICODE/pencil-9435_7_t5ht4m.svg' width={30} height={30} />
                        <h2>Creare moderator</h2>
                    </div>

                    <div className={styles.profile_picture}>
                        <span>Poză de profil:</span>
                        <input style={{ display: 'none' }} onChange={uploadPhoto} type='file' id='file' name='file' onClick={e => { const target = e.target as HTMLInputElement; target.value = '' } } accept='image/*'></input>
                        <label htmlFor='file' style={{ display: 'flex', alignItems: 'center', gap: '2em' }}>
                            <Image src={image} width={120} height={120} />
                        </label>
                    </div>
                    <div className={styles.account_title}> 
                        <h2>Cont Admin:</h2>
                    </div>
                    <div style={{ backgroundColor: 'rgb(250, 250, 250)', paddingTop: 1, paddingBottom: 100  }}>
                        <div className={styles.profile}>

                            <TextField id='name' label='Nume' variant='standard' value={lastName} onChange={e => { setError({ ...error, lastName: false}); setErrorMessages({ ...errorMessages, lastName: '' }); setLastName(e.target.value) } } error={error.lastName} helperText={errorMessages.lastName} />
                            <TextField id='firstName' label='Prenume' variant='standard' value={firstName} onChange={e => { setError({ ...error, firstName: false}); setErrorMessages({ ...errorMessages, firstName: '' }); setFirstName(e.target.value) } } error={error.firstName} helperText={errorMessages.firstName} />

                            <div style={{ width: '100%', display: 'flex', gap: 10 }}>
                                <FormControl variant='standard' fullWidth error={error.id}>
                                    <InputLabel htmlFor='id'>Cod de autentificare</InputLabel>
                                    <Input id='id' type='text'  value={id} onChange={e => { setError({ ...error, id: false}); setErrorMessages({ ...errorMessages, id: '' }); setId(e.target.value) } } inputProps={{ readOnly: true }}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                onClick={() => { setError({ ...error, id: false}); setErrorMessages({ ...errorMessages, id: '' }); generateId() } }
                                                edge="end"
                                                >
                                                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1650305034/FIICODE/manage-1170_qyjf3b.svg' width={20} height={20} style={{ cursor: 'pointer' }} />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        />
                                    <FormHelperText>{errorMessages.id}</FormHelperText>
                                </FormControl>
                            </div>

                            <TextField id='email' label='Email' variant='standard' value={email} onChange={e => { setError({ ...error, email: false}); setErrorMessages({ ...errorMessages, email: '' }); setEmail(e.target.value) } } error={error.email} helperText={errorMessages.email} />

                            <FormControl variant='standard' error={error.password} fullWidth>
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

                            {(auth.type === 'General' || auth.type === 'Judetean' || auth.type === 'Comunal') && <GoogleInput callCallback={callCallback} isComuna={isComuna} setIsComuna={setIsComuna} index={1} setLocation={setLocation} error={error} setError={setError} errorMessages={errorMessages} setErrorMessages={setErrorMessages} location={location} setFullExactPosition={setFullExactPosition} /> }

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

                            <TextField id='cnp' inputProps={{ maxLength: 13 }} label='Cod Numeric Personal' error={error.cnp} variant='standard' value={cnp} onChange={e => { setError({ ...error, cnp: false}); setErrorMessages({ ...errorMessages, cnp: '' }); setCnp(e.target.value) } } helperText={errorMessages.cnp} />

                            {(auth.type === 'General' || auth.type === 'Judetean' || auth.type === 'Comunal') && <UserGoogleInput callCallback={callCallback} setLocation={setUserLocation} error={error} setError={setError} location={userLocation} setFullExactPosition={setUserFullExactPosition} /> }

                            <TextField id='street' label='Stradă' variant='standard' error={error.street} value={street} onChange={e => { setError({ ...error, street: false}); setErrorMessages({ ...errorMessages, street: '' }); setStreet(e.target.value) } } helperText={errorMessages.street} />
                        </div>
                    </div>

                    <div className={styles.container_button}>
                        {!loading ?
                            <>
                                {fullError ? <span id='#text'>EROARE</span> : ''}
                                <button onClick={e => handleCreateUser(e)}>Creează moderatorul</button>
                            </>
                        :
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1650311259/FIICODE/Spinner-1s-200px_2_tjhrmw.svg' width={100} height={100} />
                        }
                    </div>
                </div>
        </>
    )
}

export default CreateMod;