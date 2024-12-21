'use client'

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import { useEffect } from 'react';

export default function TransitMap() {
    
    useEffect(() => {
        new Map({
            layers: [
              new TileLayer({source: new OSM()}),
            ],
            view: new View({
              center: [0, 0],
              zoom: 2,
            }),
            target: 'map',
          });
    });


    return <div id="map" style={{ width: "100%", height: 900 }} />;
}