import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import TransitMap from '../app/components/TransitMap';
import { StmRouter } from '@/app/_stm/StmRouter';

export default function Page({
    vehiclePositions,
  }: InferGetServerSidePropsType<typeof getServerSideProps>) {
      return <TransitMap vehiclePositions={vehiclePositions} />;
}

export const getServerSideProps = (async () =>{
    const vehiclePositions = await StmRouter.instance.vehiclePositions;
    return {
        props: {
            vehiclePositions: JSON.stringify(vehiclePositions),
        },
    };
}) satisfies GetServerSideProps<{ vehiclePositions: any }>;