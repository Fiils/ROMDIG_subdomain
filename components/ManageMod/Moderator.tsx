import type { FC, Dispatch, SetStateAction } from 'react';
import Image from 'next/image'
import { useState, useEffect } from 'react'
import axios from 'axios'

import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import EditIcon from '@mui/icons-material/Edit';

import styles from '../../styles/scss/ManageMod/ManageModContainer.module.scss'
import ModalDelete from '../../components/ManageMod/ModalDelete'
import ModalUpdate from '../../components/ManageMod/ModalUpdate'
import { server } from '../../config/server'


interface Moderator {
    _id: string;
    _lastName: string;
    _firstName: string;
    _profilePicture: string;
    _asId: string;
    _email: string;
    _type: string;
    _county: string;
    _city: string;
    _comuna: string;
    _gender: string;
    _cnp: string;
    _street: string;
    url: string;
    setLoading_: Dispatch<SetStateAction<boolean>>
    setUsers: Dispatch<SetStateAction<any>>
    setModerators: Dispatch<SetStateAction<any>>
}


const Moderator: FC<Moderator> = ({ _id, _lastName, _firstName, _profilePicture, _asId, _email, _type, _county, _city, _comuna, _cnp, _street, url, setLoading_, setUsers, setModerators }) => {
    
    const [ showPassword, setShowPassword ] = useState(false)
    const [ showAdminPassword, setShowAdminPassword ] = useState(false)

    const [ deleted, setDeleted ] = useState(false)
    const [ updated, setUpdated] = useState(false)
    const [ expand, setExpand ] = useState(false)
    const [ startUpdating, setStartUpdating ] = useState(false)
    
    const [ firstName, setFirstName ] = useState(_firstName)
    const [ lastName, setLastName ] = useState(_lastName)
    const [ email, setEmail ] = useState(_email)
    const [ userPassword, setUserPassword ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ image, setImage ] = useState(_profilePicture)
    const [ street, setStreet ] = useState(_street)

    const [ error, setError ] = useState({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        userPassword: false,
        street: false, 
    })

    const [ errorUpdateModal, setErrorUpdateModal ] = useState(false)
    const [ loadingUpdateModal, setLoadingUpdateModal ] = useState(false)

    const [ errorMessages, setErrorMessages ] = useState({
        firstName: '',
        lastName: '',
        email: '',
        userPassword: '',
        password: '',
        street: '', 
    })

    useEffect(() => {
        if(deleted || updated) document.body.style.overflow = 'hidden'
        if(!deleted || !updated) document.body.style.overflow = 'unset'
    }, [deleted, updated])


    useEffect(() => {
        if(startUpdating && !(firstName === _firstName && lastName === _lastName && email === _email && password === '' && userPassword === '' && street === _street)) {
            const updateProfile = async () => {
                setLoadingUpdateModal(true)
        
                const data_firstName = firstName === _firstName ? _firstName : firstName
                const data_lastName = lastName === _lastName ? _lastName : lastName
                const data_email = email === _email ? _email : email
                const data_password = password
                const data_userPassword = userPassword
                const data_street = street === _street ? _street : street


                const result = await axios.patch(`${server}/api/sd/authentication/update-user/${_id}/${_asId}`,  { data_firstName, data_lastName, data_email, data_password, data_userPassword, data_street }, { withCredentials: true })
                                        .then(res => res.data)
                                        .catch(err => {
                                            console.log(err)
                                            setLoadingUpdateModal(false)
                                            setStartUpdating(false)
                                            setLoading_(false)
                                            if(err && err.response && err.response.data && err.response.data.type === 'email') {
                                                setError({
                                                    ...error, 
                                                    email: true
                                                })
                                                setErrorMessages({
                                                    ...errorMessages,
                                                    email: err.response.data.message
                                                })
                                                setUpdated(false)
                                                return;
                                            }
                                        })
        
                if(result && result.message === 'User updated') {
                    setLoading_(true)
                    setUpdated(false)
                    setLoadingUpdateModal(false)
        
                    const admins = await axios.get(url, { withCredentials: true })
                                            .then(res => res.data)
                                            .catch(err => {
                                                console.log(err)
                                                setStartUpdating(false)
                                                setLoading_(false)
                                            })
        
                    if(result)  {
                        setModerators(admins.moderators)
                        setUsers(admins.users)
                        setLoading_(false)
                        setStartUpdating(false)
                    }
                } else {
                    setLoading_(false)
                    setLoadingUpdateModal(false)
                    setStartUpdating(false)
                }
            }

            updateProfile()
        }
    }, [startUpdating])

    const verifyValid = (e: any) => {
        e.preventDefault()
        const regex = /^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$/i
        const cnpRegex = /^\d+$/
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

        setError({ 
            lastName: !lastName.length,
            firstName: !firstName.length,
            email: !email.length ? !email.length : (!email.match(emailRegex) ? true : false ),
            password: password !== '' ? (password.length < 8 ? true : (!regex.test(password) ? true : false )) : false,
            userPassword: userPassword !== '' ? (userPassword.length < 8 ? true : (!regex.test(userPassword) ? true : false )) : false,
            street: !street.length,
        })

        setErrorMessages({
            lastName: !lastName.length ? 'Spațiul nu poate fi gol' : '',
            firstName: !firstName.length ? 'Spațiul nu poate fi gol' : '',
            email: !email.length ? 'Spațiul nu poate fi gol' : (!email.match(emailRegex) ? 'Email invalid' : '' ),
            password: password !== '' ? (password.length < 8 ? 'Parolă prea scurtă' : (!regex.test(password) ? 'Parola trebuie să conțină caractere alfanumerice' : '' )) : '',
            street: !street.length ? 'Spațiul nu poate fi gol' : '',
            userPassword: userPassword !== '' ? (userPassword.length < 8 ? 'Parolă prea scurtă' : (!regex.test(userPassword) ? 'Parola trebuie să conțină caractere alfanumerice' : '' )) : '',
        })

        if(!lastName.length || !firstName.length || !email.length || !street.length || !email.match(emailRegex) || (userPassword.length < 8 && userPassword !== '') || (!regex.test(userPassword) && userPassword !== '') || (password.length < 8 && password !== '') || (!regex.test(password) && password !== '') ){
            return;
        } 

        setUpdated(true)
    }

    return (
        <>
            {(deleted && !updated) && <ModalDelete url={url} _name={_lastName} setModal={setDeleted} _id={_id} _asId={_asId} setLoading_={setLoading_} setUsers={setUsers} setModerators={setModerators} /> }
            {(updated && !deleted) && <ModalUpdate setError={setErrorUpdateModal} loading={loadingUpdateModal} _name={_lastName} error={errorUpdateModal} setModal={setUpdated} setStartUpdating={setStartUpdating} /> 
            }
            <div className={styles.moderator_wrapper}>
                <div className={styles.moderator_profile}>
                    <Image src={image} width={100} height={100} />
                    <span id='#text'>{_lastName} {_firstName}</span>
                    <div className={styles.delete_icon}>
                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1649333841/FIICODE/x-10327_1_larnxj.svg' width={20} height={20} onClick={() => setDeleted(true)} />
                    </div>
                    <span id='#text-two'>Autorizație: {_type}</span>
                </div>
                <div className={`${styles.moderator_info} ${expand ? styles.moderator_info_override : ''}`}>

                <div className={styles.account_title}> 
                    <h2>Cont Admin:</h2>
                </div>

                <div style={{ backgroundColor: 'rgb(250, 250, 250)', paddingTop: 1, paddingBottom: 0  }}>
                    <div className={styles.profile}>

                            <TextField label='Nume' variant='standard' value={lastName} onChange={e => { setError({ ...error, lastName: false}); 
                                    setErrorMessages({ ...errorMessages, lastName: '' }); setLastName(e.target.value) } } error={error.lastName} helperText={errorMessages.lastName} 
                                    InputProps={{
                                            startAdornment: lastName !== _lastName ? (
                                            <InputAdornment position='start'>
                                                <EditIcon />
                                            </InputAdornment>
                                            ) : '',
                                    }} 
                            />

                            <TextField label='Prenume' variant='standard' value={firstName} onChange={e => { setError({ ...error, firstName: false}); 
                                    setErrorMessages({ ...errorMessages, firstName: '' }); setFirstName(e.target.value) } } error={error.firstName} helperText={errorMessages.firstName} 
                                    InputProps={{
                                            startAdornment: firstName !== _firstName ? (
                                            <InputAdornment position='start'>
                                                <EditIcon />
                                            </InputAdornment>
                                            ) : '',
                                    }} 
                            />


                            <TextField label='Email' variant='standard' value={email} onChange={e => { setError({ ...error, email: false}); setErrorMessages({ ...errorMessages, email: '' }); 
                                    setEmail(e.target.value) } } error={error.email} helperText={errorMessages.email} 
                                    InputProps={{
                                        startAdornment: email !== _email ? (
                                        <InputAdornment position='start'>
                                            <EditIcon />
                                        </InputAdornment>
                                        ) : '',
                                }} 
                            />

                            <FormControl variant='standard' error={error.password}>
                                <InputLabel htmlFor='password'>Parolă</InputLabel>
                                <Input type={showAdminPassword ? 'text' : 'password'} value={password} onChange={e => { setError({ ...error, password: false}); setErrorMessages({ ...errorMessages, password: '' }); setPassword(e.target.value) } } 
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
                                startAdornment={ password !== '' ? (
                                    <InputAdornment position='start'>
                                        <EditIcon />
                                    </InputAdornment>
                                    ) : ''
                                }
                                />
                                <FormHelperText>{errorMessages.password}</FormHelperText>
                            </FormControl>

                            {expand &&
                                <>
                                    {_city !== '' && 
                                        <TextField label={_comuna !== '' ? 'Sat' : 'Oraș'} variant='standard' value={_city} InputProps={{ readOnly: true }} />
                                    }
                                    {_comuna !== '' &&
                                        <TextField label='Comună' variant='standard' value={_comuna} InputProps={{ readOnly: true }}  />
                                    }
                                    <TextField label='Județ' variant='standard' value={_county} InputProps={{ readOnly: true }} />
                                </>
                            }
                    </div>
                </div>

                <div className={styles.expand_less_icon}>
                    {!expand ? <UnfoldMoreIcon onClick={() => setExpand(true)} /> : <UnfoldLessIcon onClick={() => setExpand(false)} /> }
                </div>

                {expand &&
                    <>
                        <div className={styles.account_title} style={{ marginTop: 20 }}> 
                            <h2>Cont Utilizator:</h2>
                        </div>

                        <div style={{ backgroundColor: 'rgb(250, 250, 250)', paddingBottom: 0  }}>
                            <div className={styles.profile}>

                                <FormControl variant='standard' error={error.userPassword} fullWidth>
                                    <InputLabel htmlFor='userPassword'>Parolă</InputLabel>
                                    <Input name='userPassword' type={showPassword ? 'text' : 'password'} value={userPassword} onChange={e => { setError({ ...error, userPassword: false}); setErrorMessages({ ...errorMessages, userPassword: '' }); setUserPassword(e.target.value) } } 
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
                                    startAdornment={ userPassword !== '' ? (
                                        <InputAdornment position='start'>
                                            <EditIcon />
                                        </InputAdornment>
                                        ) : ''
                                    }
                                    />
                                    <FormHelperText>{errorMessages.userPassword}</FormHelperText>
                                </FormControl>

                                <TextField label='Stradă' variant='standard' error={error.street} value={street} 
                                onChange={e => { setError({ ...error, street: false}); setErrorMessages({ ...errorMessages, street: '' }); setStreet(e.target.value) } } 
                                helperText={errorMessages.street} InputProps={{ 
                                    startAdornment: street !== _street ? (
                                        <InputAdornment position='start'>
                                            <EditIcon />
                                        </InputAdornment>
                                        ) : ''
                                 }}
                                 />

                            </div>

                            {expand && 
                                <div className={styles.update_button}>
                                    <button  onClick={e => verifyValid(e)} disabled={firstName === _firstName && lastName === _lastName && email === _email && password === '' && userPassword === '' && street === _street}>Actualizează</button>
                                </div>
                            }
                        </div>
                    </>
                }
            </div>
        </div>
    </>
    )
}

export default Moderator;