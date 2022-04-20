import React, { useEffect, useRef } from "react";
import type { FC } from 'react'


import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';


let autoComplete: any;

interface Props {
    location: string;
    setLocation: any;
    setFullExactPosition: any;
    error: any;
    errorMessages?: any;
    setError: any;
    setErrorMessages?: any;
    index: number
}

const loadScript = (url: any, callback: any, index: number) => {
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

const SearchLocationInput: FC<Props> = ({ location, setLocation, setFullExactPosition, error, errorMessages, setError, setErrorMessages, index }) => {
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=AIzaSyAjgL7bxlxWK_Wmx2dVVuT1PRckDoZMc3o&libraries=places`,
      () => handleScriptLoad(setLocation, autoCompleteRef, setFullExactPosition,), index
    );
  }, []);

  return (
      <FormControl variant='standard' error={index === 1 ? error.location : error} fullWidth>
        <InputLabel htmlFor='location'>Localizare</InputLabel>
        <Input id='location' type='text' name='location' inputProps={{ ref: autoCompleteRef, value: location, onChange: (e: any) => { if(index === 1) { setError({ ...error, location: false}); } else { setError(false) } if(index === 1) { setErrorMessages({ ...errorMessages, location: '' }) } setLocation(e.target.value) }, placeholder: '' }} />
        {errorMessages && <FormHelperText>{errorMessages.location}</FormHelperText> }
        {!errorMessages && <FormHelperText>{error ? 'Locație invalidă' : ''}</FormHelperText>}
      </FormControl>
  );
}

export default SearchLocationInput;