import { StmRouter } from '@/app/_stm/StmRouter';
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
    vehiclePositions: any;
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const vehiclePositions = StmRouter.getInstance().vehiclePositions;
    res.status(200).json({
        vehiclePositions: vehiclePositions
    });
}
