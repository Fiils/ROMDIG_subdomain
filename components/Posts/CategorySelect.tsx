import type { FC } from 'react';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import styles from '../../styles/scss/Posts/Tools.module.scss'



interface StatusProps { 
    category: string;
    handleChange: (e: any) => void;
}

const StatusSelect: FC<StatusProps> = ({ category, handleChange }) => {

    const customSelect = createTheme({
        palette: {
            primary: {
                main: '#A71D31'
            }
        },
    })

    return (
        <ThemeProvider theme={customSelect}>
          <FormControl variant='standard' sx={{ m: 1, mb: .8 }}>
            <Select
              MenuProps={{ disableScrollLock: true }}
              labelId="sort-by-category"
              id="category"
              value={category}
              onChange={handleChange}
              disableUnderline
              className={styles.select_cat}
              >
                <MenuItem value={'Populare'}>Populare</MenuItem>
                <MenuItem value={'Vizionate'}>Vizionate</MenuItem>
                <MenuItem value={'Apreciate'}>Apreciate</MenuItem>
                <MenuItem value={'Comentate'}>Comentate</MenuItem>
                <MenuItem value={'Noi'}>Noi</MenuItem>
                <MenuItem value={'Vechi'}>Vechi</MenuItem>
                <MenuItem value={'Neapreciate'}>Neapreciate</MenuItem>
            </Select>
          </FormControl>
        </ThemeProvider>
    )
}

export default StatusSelect;