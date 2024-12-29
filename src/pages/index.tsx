'use client';
import { useEffect, useReducer, useState } from 'react';
import TransitMap from '../app/components/TransitMap';
import { VehicleInfo } from '@/app/lib/StmRouter';

export default function Page() {
    const [vehicleData, setVehicleData] = useState<VehicleInfo[]>([]);

    useEffect(() => {
        fetch(process.env.REACT_APP_SERVER_URL + '/api/realtime/getVehiclePositions')
            .then((response) => response.json())
            .then((data) => {
                setVehicleData(data.vehicleData);
            });
        const interval = setInterval(() => {
            fetch(process.env.REACT_APP_SERVER_URL + '/api/realtime/getVehiclePositions')
                .then((response) => response.json())
                .then((data) => setVehicleData(data.vehicleData));
            console.log(vehicleData);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <TransitMap vehicleData={vehicleData} />
        </div>
    );
}
