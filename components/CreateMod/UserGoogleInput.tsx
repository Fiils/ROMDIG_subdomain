import React, { useEffect, useRef } from "react";
import type { FC } from 'react'


import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';

import { useAuth } from '../../utils/useAuth'


//Single difference from the other GoogleInput is the fact that this one doesn't have the checkbox for isComuna, because it must be a locality

let autoComplete: any;

interface Props {
    location: string;
    setLocation: any;
    setFullExactPosition: any;
    callCallback: boolean;
    error: any;
    setError: any;
}

function handleScriptLoad(updateQuery: any, autoCompleteRef: any, setFullExactPosition: any) {
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current,
    { types: ["(regions)"], componentRestrictions: { country: "ro" } }
  );
  autoComplete.setFields(["address_components", "formatted_address", 'name']);
  autoComplete.addListener("place_changed", () =>
    handlePlaceSelect(updateQuery, setFullExactPosition)
  );
}

async function handlePlaceSelect(updateQuery: any, setFullExactPosition: any) {
  const addressObject = autoComplete.getPlace();
  const query = addressObject.name;
  setFullExactPosition(addressObject)
  updateQuery(query);
}

const SearchLocationInput: FC<Props> = ({ location, setLocation, setFullExactPosition, error, setError, callCallback }) => {
  const autoCompleteRef = useRef(null);

  useEffect(() => {
      if(callCallback) {
        handleScriptLoad(setLocation, autoCompleteRef, setFullExactPosition)
      }
  }, [callCallback]);



  return (
    <div style={{ position: 'relative' }}>
        <FormControl variant='standard' error={error.userLocation} fullWidth>
          <InputLabel htmlFor='userLocation'>Localizare</InputLabel>
          <Input id='userLocation' type='text' name='userLocation' inputProps={{ ref: autoCompleteRef, value: location, onChange: (e: any) => { setError({ ...error, userLocation: false }); setLocation(e.target.value) }, placeholder: '' }} />
        </FormControl>
    </div>
  );
}

export default SearchLocationInput;