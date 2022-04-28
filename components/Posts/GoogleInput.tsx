import React, { useEffect, useRef } from "react";
import type { FC } from 'react'


import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useAuth } from '../../utils/useAuth'



let autoComplete: any;

interface Props {
    location: string;
    setLocation: any;
    setFullExactPosition: any;
    error: any;
    setError: any;
    isComuna: boolean;
    setIsComuna: any;
}

const loadScript = (url: any, callback: any) => {
    let script = document.createElement("script");
    script.type = "text/javascript";

    if ((script as any).readyState) {
      (script as any).onreadystatechange = function() {
        if ((script as any).readyState === "loaded" || (script as any).readyState === "complete") {
          (script as any).onreadystatechange = null;
          callback();
        }
      };
    } else {
      script.onload = () => callback();
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
};

function handleScriptLoad(updateQuery: any, autoCompleteRef: any, setFullExactPosition: any) {
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current,
    { types: ["(regions)"], componentRestrictions: { country: "ro" } }
  );

  autoComplete.setFields(["address_components", 'name']);
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

const SearchLocationInput: FC<Props> = ({ location, setLocation, setFullExactPosition, error, setError, isComuna, setIsComuna }) => {
  const autoCompleteRef = useRef(null);

  const auth = useAuth()

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`,
      () => handleScriptLoad(setLocation, autoCompleteRef, setFullExactPosition,)
    );
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <FormControl error={error} variant='outlined'>
          <InputLabel htmlFor='location' sx={{ left: -15 }}>Localizare</InputLabel>
          <Input id='location' type='text' name='location' inputProps={{ ref: autoCompleteRef, value: location, onChange: (e: any) => { setIsComuna(false); setError(false); setLocation(e.target.value) }, placeholder: '' }} />
      </FormControl>

      {(auth.type === 'General' || auth.type === 'Judetean') &&
          <FormHelperText sx={{ position: 'absolute', bottom: -33, left: -1.2 }}>
              <FormControlLabel
                  control={
                    <Checkbox name="comuna" checked={isComuna} onChange={() => setIsComuna(!isComuna)} />
                  }
                  label="Comuna"
              />
          </FormHelperText>
      }
    </div>
  );
}

export default SearchLocationInput;