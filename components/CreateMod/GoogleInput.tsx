import React, { useEffect, useRef } from "react";
import type { FC } from 'react'


import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';


let autoComplete: any;

interface Props {
    location: string;
    setLocation: any;
    setFullExactPosition: any;
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

const SearchLocationInput: FC<Props> = ({ location, setLocation, setFullExactPosition }) => {
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=AIzaSyAjgL7bxlxWK_Wmx2dVVuT1PRckDoZMc3o&libraries=places`,
      () => handleScriptLoad(setLocation, autoCompleteRef, setFullExactPosition)
    );
  }, []);

  return (
      <FormControl variant='standard' fullWidth>
        <InputLabel htmlFor='location'>Localizare</InputLabel>
        <Input id='location' type='text' name='location' inputProps={{ ref: autoCompleteRef, value: location, onChange: (e: any) => setLocation(e.target.value), placeholder: '' }} />
      </FormControl>
  );
}

export default SearchLocationInput;