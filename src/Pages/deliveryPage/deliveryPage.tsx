import React from 'react';
import {silCemAPI} from "../../Infrastructure/services/PlantServices/SilCem";

const DeliveryPage = () => {

    const silCem = silCemAPI.useFetchAllSilCemQuery('')

    return (
        <div>

        </div>
    );
};

export default DeliveryPage;