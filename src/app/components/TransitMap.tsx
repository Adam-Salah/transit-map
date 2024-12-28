'use client';

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import { use, useEffect, useReducer, useRef, useState } from 'react';
import LayerVector from 'ol/layer/Vector';
import SourceVector from 'ol/source/Vector';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import { VehiclePosition } from '../_stm/StmRouter';

export default function TransitMap() {
    const [vehiclePositions, setVehiclePositions] = useState<VehiclePosition[]>();
    const [map, setMap] = useState<Map>();
    const [markers, setMarkers] = useState<LayerVector[]>();

    const firstTime = useRef(true);

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        fetch(process.env.REACT_APP_SERVER_URL + '/api/realtime/getVehiclePositions')
            .then((response) => response.json())
            .then((data) => setVehiclePositions(data.vehiclePositions));
        const interval = setInterval(() => {
            fetch(process.env.REACT_APP_SERVER_URL + '/api/realtime/getVehiclePositions')
                .then((response) => response.json())
                .then((data) => setVehiclePositions(data.vehiclePositions));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setMap(
            new Map({
                layers: [new TileLayer({ source: new OSM() })],
                view: new View({
                    center: [-8191765.886753974, 5701988.590036851],
                    zoom: 14,
                }),
                target: 'map',
            })

        );
    }, []);
    
    useEffect(() => {
        if (vehiclePositions && map) {
            if (markers) {
                markers.forEach((marker) => {
                    map.removeLayer(marker);
                });
            }
            const tempMarkers = createMarkers(vehiclePositions);
            tempMarkers.forEach((tempMarker) => {
                map.addLayer(tempMarker);
            });
            setMarkers(tempMarkers);
            if (firstTime.current) {
                firstTime.current = false;
                forceUpdate();
            }
        }
    }, [vehiclePositions]);
    return <div id='map' style={{ width: '100%', height: 900 }} />;
}

const pointFill = new Fill({
    color: 'rgba(0,0,255,1)',
});

function createMarkers(vehiclePositions: VehiclePosition[]) {
    const tempMarkers: LayerVector[] = [];
    vehiclePositions.forEach((vehiclePosition) => {
        const marker = new LayerVector({
            source: new SourceVector({
                features: [
                    new Feature({
                        geometry: new Point(fromLonLat([vehiclePosition.longitude, vehiclePosition.latitude])),
                    }),
                ],
            }),
            style: new Style({
                image: new Circle({
                    fill: pointFill,
                    radius: 5,
                }),
                fill: pointFill,
            }),
        });
        tempMarkers.push(marker);
    });
    return tempMarkers;
}
