'use client';

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import { StmRouter } from '../_stm/StmRouter';
import { useEffect, useState } from 'react';

export default function TransitMap() {
    const [vehiclePositions, setVehiclePositions] = useState();

    useEffect(() => {
        fetch(process.env.REACT_APP_SERVER_URL + '/api/realtime/getVehiclePositions')
        .then(response => response.json())
        .then(data => setVehiclePositions(data.vehiclePositions))
        const interval = setInterval(() => {
            fetch(process.env.REACT_APP_SERVER_URL + '/api/realtime/getVehiclePositions')
            .then(response => response.json())
            .then(data => setVehiclePositions(data.vehiclePositions))
        }, 15000);
        return () => clearInterval(interval);
    }, [])
    // useEffect(() => {
    //     new Map({
    //         layers: [new TileLayer({ source: new OSM() })],
    //         view: new View({
    //             center: [-8191765.886753974, 5701988.590036851],
    //             zoom: 14,
    //         }),
    //         target: 'map',
    //     });
    // });

    // return <div id='map' style={{ width: '100%', height: 900 }} />;
    return <div>{JSON.stringify(vehiclePositions)}</div>;
}