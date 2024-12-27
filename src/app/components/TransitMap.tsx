'use client';

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';


export default function TransitMap(props: { vehiclePositions: any }) {
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
    return <div>{props.vehiclePositions}</div>;
}
