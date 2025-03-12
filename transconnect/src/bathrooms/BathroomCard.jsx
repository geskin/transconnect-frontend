import React from "react";
import "../css/BathroomCard.css";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


/** BathroomCard: displays information on a bathroom */

const BathroomCard = ({ name, street, directions, comment, approved }) => {
    return (
        <Card className="BathroomCard card" sx={{ minHeight: 300, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <CardContent className="card-body">
                {approved === true && (
                    <>
                        <h2 className="card-title text-start">
                            {name}
                        </h2>
                        <b>{street}</b>
                        <p className="text-start">{directions}</p>
                        <p className="text-start"><i>{comment}</i></p>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

export default BathroomCard;