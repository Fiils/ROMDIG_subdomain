import type { FC, Dispatch, SetStateAction } from 'react';
import { useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

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


import styles from '../../styles/scss/CreateMod/CreateModContainer.module.scss'
import GoogleInput from './GoogleInput'
import { server } from '../../config/server'


interface InitialProps {
    setCreateMod: Dispatch<SetStateAction<boolean>>
}

const CreateMod: FC<InitialProps> = ({ setCreateMod }) => {
    const router = useRouter()

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
    const [ location, setLocation ] = useState('')
    const [ type, setType ] = useState('Judetean')
    const [ gender, setGender ] = useState('Bărbat')
    const [ cnp, setCnp ] = useState('')
    const [ street, setStreet ] = useState('')
    const [ fullExactPosition, setFullExactPosition ] = useState<any>()

    const handleDeleteImage = (e: any) => {
        e.preventDefault();
        setImage('')
    }

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
        for(let i = 0; i < 19; i++) {
            id.push(allowedValues[Math.floor(Math.random() * allowedValues.split('').length)])
        }

        setId(id.join('')) 
    }

    const handleCreateUser = async (e: any) => {
        e.preventDefault()
        setLoading(true)

        let county: any = [];
        if(fullExactPosition && fullExactPosition.address_components) {
            for(let i = 0; i < fullExactPosition.address_components.length; i++) {
                if(fullExactPosition.address_components[i].types.includes('administrative_area_level_1')) {
                    for(let j = 0; j < (fullExactPosition.address_components[i].long_name.split(' ').length > 1 ? fullExactPosition.address_components[i].long_name.split(' ').length - 1 :  fullExactPosition.address_components[i].long_name.split(' ').length); j++){
                        county = [ ...county, fullExactPosition.address_components[i].long_name.split(' ')[j] ]
                    }
                    console.log(county)
                    county = county.join(" ")
                    break;
                }
                // if(i === fullExactPosition.address_components.length - 1) {
                //     setError({ ...error, city: true })
                //     setErrorMessages({ ...errorMessages, city: 'Localitate invalidă' })
                //     setLoading(false)
                //     return;
                // }
            }
        } else {
            // setError({ ...error, city: true })
            // setErrorMessages({ ...errorMessages, city: 'Localitate invalidă' })
            // setLoading(false)
            // return;
        }
    
        let comuna: any = [], ok = 0;
        if(fullExactPosition && fullExactPosition.address_components) {
            for(let i = 0; i < fullExactPosition.address_components.length; i++) {
                if(fullExactPosition.address_components[i].types.includes('administrative_area_level_2')) {
                    ok = 1;
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
        const city = location
        const profilePicture = image
        const user = { firstName, lastName, id, email, password, userPassword, type, profilePicture, city, county, comuna, gender, cnp, rural, street }

        const result = await axios.post(`${server}/api/sd/authentication/create-user`, user, { withCredentials: true })
                                .then(res => res.data)
                                .catch(err => {
                                    console.log(err.response)
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
            setType('Judetean')
            setGender('Bărbat')
            setCnp('')
            setStreet('')
            setFullExactPosition(null)
            setLoading(false)
            router.reload()
        }
    }
    



    return (
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

                    <TextField id='name' label='Nume' variant='standard' value={lastName} onChange={e => setLastName(e.target.value)} />
                    <TextField id='lastName' label='Prenume' variant='standard' value={firstName} onChange={e => setFirstName(e.target.value)} />

                    <div style={{ width: '100%', display: 'flex', gap: 10 }}>
                        <FormControl variant='standard' fullWidth>
                        <InputLabel htmlFor='id'>Cod de autentificare</InputLabel>
                        <Input id='id' type='text' value={id} onChange={e => setId(e.target.value)}  inputProps={{ readOnly: true }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    onClick={() => generateId()}
                                    edge="end"
                                    >
                                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1650305034/FIICODE/manage-1170_qyjf3b.svg' width={20} height={20} style={{ cursor: 'pointer' }} />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    </div>
                    <TextField id='email' label='Email' variant='standard' value={email} onChange={e => setEmail(e.target.value)} />

                    <FormControl variant='standard' fullWidth>
                        <InputLabel htmlFor='password'>Parolă</InputLabel>
                        <Input id='password' type={showAdminPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} 
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
                    </FormControl>

                    <GoogleInput setLocation={setLocation} location={location} setFullExactPosition={setFullExactPosition} />
                    
                    <FormControl variant='standard' fullWidth>

                        <InputLabel id="authorization-label">Autorizație</InputLabel>
                        <Select
                        labelId="authorization-label"
                        id="authorization"
                        value={type}
                        label="Autorizație"
                        onChange={(e: any) => setType(e.target.value)}
                        >
                            <MenuItem value={'Judetean'}>Județean</MenuItem>
                            <MenuItem value={'Orasesc'}>Orășesc</MenuItem>
                            <MenuItem value={'Satesc'}>Sătesc</MenuItem>
                        </Select>

                    </FormControl>
                </div>
            </div>


            <div className={styles.account_title} style={{ marginTop: 100 }}> 
                <h2>Cont Utilizator:</h2>
            </div>

            <div style={{ backgroundColor: 'rgb(250, 250, 250)', paddingTop: 1, paddingBottom: 100  }}>
                <div className={styles.profile}>

                    <FormControl variant='standard' fullWidth>
                        <InputLabel htmlFor='userPassword'>Parolă</InputLabel>
                        <Input name='userPassword' id='userPassword' type={showPassword ? 'text' : 'password'} value={userPassword} onChange={e => setUserPassword(e.target.value)} 
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
                    </FormControl>

                    <FormControl variant='standard' fullWidth>

                        <InputLabel id="gender-label">Sex</InputLabel>
                        <Select
                        labelId="gender-label"
                        id="gender"
                        value={gender}
                        label="Sex"
                        onChange={(e: any) => setGender(e.target.value)}
                        >
                            <MenuItem value={'Bărbat'}>Bărbat</MenuItem>
                            <MenuItem value={'Femeie'}>Femeie</MenuItem>
                        </Select>

                    </FormControl>
                    <TextField id='cnp' label='Cod Numeric Personal' variant='standard' value={cnp} onChange={e => setCnp(e.target.value)} />

                    <TextField id='street' label='Stradă' variant='standard' value={street} onChange={e => setStreet(e.target.value)} />
                </div>
            </div>

            <div className={styles.container_button}>
                {!loading ?
                    <button onClick={e => handleCreateUser(e)}>Creează moderatorul</button>
                :
                    <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1650311259/FIICODE/Spinner-1s-200px_2_tjhrmw.svg' width={100} height={100} />
                }
            </div>
        </div>
    )
}

export default CreateMod;