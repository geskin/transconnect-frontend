import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function ToggleSwitch() {
    return (
        <FormGroup>
            <FormControlLabel control={<Switch />} label="ADA accessible" />
        </FormGroup>
    );
}

