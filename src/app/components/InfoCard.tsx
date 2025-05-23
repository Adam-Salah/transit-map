import React from 'react';
import Image from 'next/image';
import { VehicleInfo } from '../lib/StmRouter';

export default function InfoCard(props: InfoCardProps) {
    return (
        <div className='info-card'>
            {!props.selectedVehicle && <h1 className='text-[48px] font-bold'>Choisir un bus</h1>}
            {props.selectedVehicle && (
                <>
                    <div>
                        <h1 className='text-[64px] font-bold'>Ligne {props.selectedVehicle.routeId}</h1>
                        <h2 className='text-[36px]'>Bus #{props.selectedVehicle.vehicleId}</h2>
                    </div>
                    <br />
                    <div>
                        <p className='text-[24px]'>Vitesse: {Math.round(props.selectedVehicle.speed)}km/h</p>
                        <p className='text-[24px]'>
                            Taux d'occupance: {'\t'}
                            {props.selectedVehicle.occupancyStatus == undefined && (
                                'Inconnu'
                            )}
                            {props.selectedVehicle.occupancyStatus == '1' && (
                                <Image className='inline' src={'/occupancy-0.png'} width={60} height={48} alt='Bus presque vide' />
                            )}
                            {props.selectedVehicle.occupancyStatus == '2' && (
                                <Image className='inline' src={'/occupancy-1.png'} width={60} height={48} alt='Quelques places assises' />
                            )}
                            {props.selectedVehicle.occupancyStatus == '3' && (
                                <Image className='inline' src={'/occupancy-2.png'} width={60} height={48} alt='Places debout seulement' />
                            )}
                            {props.selectedVehicle.occupancyStatus == '4' || props.selectedVehicle.occupancyStatus == '5' && (
                                <Image className='inline' src={'/occupancy-3.png'} width={60} height={48} alt='Bus presque plein' />
                            )}
                        </p>
                    </div>
                    <p className='text-[24px] absolute bottom-10'>
                        Mis à jour à: {'\t'}
                        {new Date(props.selectedVehicle.timeStamp).getHours()}:
                        {('0' + new Date(props.selectedVehicle.timeStamp).getMinutes()).slice(-2)}
                    </p>
                </>
            )}
        </div>
    );
}

interface InfoCardProps {
    selectedVehicle: VehicleInfo | undefined;
}
