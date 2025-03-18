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
        const newChecked = e.target.checked;
        setChecked(newChecked);
        setAccessibility(newChecked);
    };

    return (
        <div>
            <div>
                <h2><b>List of unisex bathrooms. Default location is New York City!</b></h2>
            </div>
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
                        approved={b.approved}
                    />
                ))}
            </div>
        </div>
    );
}

export default BathroomList;