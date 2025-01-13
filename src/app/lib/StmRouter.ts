import GtfsRealtimeBindings from 'gtfs-realtime-bindings';

const _baseUrl: string = 'https://api.stm.info/pub/od/gtfs-rt/ic/v2/';
const _apiKey: string = process.env.STM_KEY!;

export interface VehicleInfo {
    vehicleId: string;
    routeId: string;
    latitude: number;
    longitude: number;
    speed: number;
    currentStatus: string;
    occupancyStatus: string;
}

export class StmRouter {
    private static _instance: StmRouter;

    private _vehicleData: VehicleInfo[] = [];

    private constructor() {
        this._getVehicleData();
        setInterval(() => {
            this._getVehicleData();
        }, 10000);
    }

    private async _getVehicleData() {
        const url = _baseUrl + 'vehiclePositions';
        const headers = {
            accept: 'application/x-protobuf',
            apiKey: _apiKey,
        };
        let response;
        try {
            response = await fetch(url, {
                headers,
            });
        } catch (err) {
            console.log('StmRouter.getVehicleData: Could not fetch from ' + url + '\n' + err);
        }
        if (!response) {
            console.log('StmRouter.getVehicleData: Empty response');
            return;
        }
        const body = response.body;
        if (!body) {
            console.log('StmRouter.getVehicleData: Response body is null');
            return;
        }
        const buffers = [];
        let reader;
        try {
            reader = body.getReader();
        } catch (err) {
            console.log('StmRouter.getVehicleData: Reader locked or body bot a ReadableStream');
        }
        if (!reader) {
            console.log('StmRouter.getVehicleData: Reader is null');
            return;
        }
        while (true) {
            try {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                buffers.push(value);
            } catch (err) {
                console.log('StmRouter.getVehicleData: Stream reading error');
            }
        }
        const data = Buffer.concat(buffers);
        try {
            let decodedData = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(data);
            console.log('STM data retrieved');
            this._vehicleData = this._parseData(decodedData);
        } catch (err) {
            console.log('StmRouter.getVehicleData: Could not decode protobuf data\n' + err);
        }
    }

    private _parseData(decodedData: GtfsRealtimeBindings.transit_realtime.FeedMessage): VehicleInfo[] {
        let data: any = [];
        decodedData.entity.forEach((entity) => {
            if (entity.vehicle) {
                const vehicleData = {
                    vehicleId: entity.vehicle.vehicle?.id,
                    routeId: entity.vehicle.trip?.routeId,
                    latitude: entity.vehicle.position?.latitude,
                    longitude: entity.vehicle.position?.longitude,
                    speed: entity.vehicle.position?.speed,
                    currentStatus: entity.vehicle.currentStatus,
                    occupancyStatus: entity.vehicle.occupancyStatus,
                };
                data.push(vehicleData);
            }
        });
        return data;
    }

    public get vehicleData(): VehicleInfo[] {
        return this._vehicleData;
    }

    public static getInstance(): StmRouter {
        if (!this._instance) {
            this._instance = new StmRouter();
            console.log('StmRouter instance created');
        }
        return this._instance;
    }
}
