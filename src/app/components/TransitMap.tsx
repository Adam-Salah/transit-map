'use client';

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import { useEffect, useReducer, useRef, useState } from 'react';
import LayerVector from 'ol/layer/Vector';
import SourceVector from 'ol/source/Vector';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import { VehicleInfo } from '../lib/StmRouter';

export default function TransitMap(props: { vehicleData: VehicleInfo[] }) {
    const [map, setMap] = useState<Map>();
    const [markers, setMarkers] = useState<LayerVector[]>();

    const firstTime = useRef(true);

    const [, forceUpdate] = useReducer((x) => x + 1, 0);

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

    let select;

    useEffect(() => {
        if (props.vehicleData && map) {
            if (markers) {
                markers.forEach((marker) => {
                    map.removeLayer(marker);
                });
            }
            const tempMarkers = createMarkers(props.vehicleData);
            tempMarkers.forEach((tempMarker) => {
                map.addLayer(tempMarker);
            });
            setMarkers(tempMarkers);
            if (firstTime.current) {
                forceUpdate();
                firstTime.current = false;
            }
        }
    }, [props.vehicleData]);
    return <div id='map' style={{ width: '100%', height: 900 }} />;
}

function createMarkers(vehicleData: VehicleInfo[]) {
    const tempMarkers: LayerVector[] = [];
    vehicleData.forEach((vehicle) => {
        const marker = new LayerVector({
            source: new SourceVector({
                features: [
                    new Feature({
                        geometry: new Point(fromLonLat([vehicle.longitude, vehicle.latitude])),
                    }),
                ],
            }),
            style: markerStyle,
        });
        tempMarkers.push(marker);
    });
    return tempMarkers;
}

const markerStyle = new Style({
    image: new Circle({
        fill: new Fill({
            color: 'rgba(0,0,255,1)',
        }),
        radius: 5,
    }),
    fill: new Fill({
        color: 'rgba(0,0,255,1)',
    }),
});

const markerSelectedStyle = new Style({
    image: new Circle({
        fill: new Fill({
            color: 'rgba(255,0,0,1)',
        }),
        radius: 5,
    }),
    fill: new Fill({
        color: 'rgba(255,0,0,1)',
    }),
});
