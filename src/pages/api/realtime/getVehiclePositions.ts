import { StmRouter, VehicleInfo } from '@/app/lib/StmRouter';
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
    vehicleData: VehicleInfo[];
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const vehicleData = StmRouter.getInstance().vehicleData;
    res.status(200).json({
        vehicleData: vehicleData
    });
}
