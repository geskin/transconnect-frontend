import React, { useEffect, useState } from "react";
import { FormControlLabel, Switch } from "@mui/material";
import TransconnectApi from "../api";
import BathroomCard from "./BathroomCard";

/** BathroomList: list of all unisex public restrooms
 * 
 * can be filtered for accessibility and location
 */

const BathroomList = () => {
    const [bathrooms, setBathrooms] = useState([]);
    const [location, setLocation] = useState("lat=40.776676&lng=-73.971321"); //default is new york
    const [accessibility, setAccessibility] = useState(false); //if false include all bathrooms
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const fetchBathrooms = async () => {
            try {
                let data = await TransconnectApi.getBathrooms(location, accessibility);
                setBathrooms(data);
            } catch (err) {
                console.error("Error fetching bathrooms", err);
            }
        };

        fetchBathrooms();
    }, [accessibility, location]);

    const handleChange = (e) => {
        setChecked(e.target.checked);
        if (checked) {
            setAccessibility(true);
        } else {
            setAccessibility(false);
        }

        console.debug(accessibility);
    };

    return (
        <div>
            <div>
                <FormControlLabel control={
                    <Switch
                        checked={checked}
                        onChange={handleChange}
                    />}
                    label="ADA accessible"
                />
            </div>
            <div>
                {bathrooms.map(b => (
                    <BathroomCard
                        key={b.id}
                        name={b.name}
                        street={b.street}
                        directions={b.directions}
                        comment={b.comment}
                    />
                ))}
            </div>
        </div>
    );
}

export default BathroomList;