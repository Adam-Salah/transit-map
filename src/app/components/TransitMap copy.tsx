'use client';

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import { Dispatch, SetStateAction, use, useEffect, useReducer, useRef, useState } from 'react';
import LayerVector from 'ol/layer/Vector';
import SourceVector from 'ol/source/Vector';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import { VehicleInfo } from '../lib/StmRouter';

export default function TransitMap(props: {
    vehicleData: VehicleInfo[];
    setSelectedVehicle: Dispatch<SetStateAction<VehicleInfo | undefined>>;
}) {
    const [map, setMap] = useState<Map>();
    const [markers, setMarkers] = useState<LayerVector[]>();
    const [selectedVehicleId, setSelectedVehicleId] = useState<string>();

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

    useEffect(() => {
        if (props.vehicleData && map) {
            if (markers) {
                markers.forEach((marker) => {
                    map.removeLayer(marker);
                });
            }
            const tempMarkers = createMarkers(props.vehicleData, selectedVehicleId);
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

    useEffect(() => {
        if (map) {
            map.on('click', (evt) => {
                if (map) {
                    let feature = map.forEachFeatureAtPixel(evt.pixel, (feat) => {
                        return feat;
                    });
                    if (feature && feature.get('type') == 'marker') {
                        let vehicleId: string = feature.get('vehicleId');
                        setSelectedVehicleId(vehicleId);
                        props.setSelectedVehicle(feature.get('vehicle'));
                    }
                }
            });
            map.getView().on('change:resolution', (evt) => {
                console.log(Math.pow(map.getView().getZoom()! / 12, 2))
                markerSelectedStyle.getImage()?.setScale(Math.pow(map.getView().getZoom()! / 12, 2));
                markerStyle.getImage()?.setScale(Math.pow(map.getView().getZoom()! / 12, 2));
            });
        }
    }, [map]);

    useEffect(() => {
        markers?.forEach((marker) => {
            if (marker.getSource()?.getFeatures()[0].get('vehicleId') === selectedVehicleId) {
                marker.setStyle(markerSelectedStyle); 
            } else {
                marker.setStyle(markerStyle);
            }
        });
    }, [selectedVehicleId]);

    return <div id='map' style={{ width: '100%', height: '100%', position: 'fixed' }} />;
}

function createMarkers(vehicleData: VehicleInfo[], selectedVehicleId: string | undefined) {
    const tempMarkers: LayerVector[] = [];
    let style: Style;
    if (selectedVehicleId) {
        vehicleData.forEach((vehicle) => {
            if (vehicle.vehicleId === selectedVehicleId) {
                style = markerSelectedStyle;
            } else {
                style = markerStyle;
            }
            let marker: LayerVector = createMarker(vehicle, style);
            tempMarkers.push(marker);
        });
    } else {
        vehicleData.forEach((vehicle) => {
            let marker = createMarker(vehicle, markerStyle);
            tempMarkers.push(marker);
        });
    }
    return tempMarkers;
}

function createMarker(vehicle: VehicleInfo, markerStyle: Style) {
    const marker = new LayerVector({
        source: new SourceVector({
            features: [
                new Feature({
                    type: 'marker',
                    vehicleId: vehicle.vehicleId,
                    geometry: new Point(fromLonLat([vehicle.longitude, vehicle.latitude])),
                    vehicle: vehicle,
                }),
            ],
        }),
        style: markerStyle,
    });
    return marker;
}

const markerStyle = new Style({
    image: new Circle({
        fill: new Fill({
            color: 'rgba(0,0,255,1)',
        }),
        radius: 7,
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
        radius: 7,
    }),
    fill: new Fill({
        color: 'rgba(255,0,0,1)',
    }),
});
