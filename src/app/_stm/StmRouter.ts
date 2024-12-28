import GtfsRealtimeBindings from 'gtfs-realtime-bindings';

const _baseUrl: string = 'https://api.stm.info/pub/od/gtfs-rt/ic/v2/';
const _apiKey: string = process.env.STM_KEY!;

export class StmRouter {
    private static _instance: StmRouter;

    private _vehiclePositions: any[] = [];

    private _timer;

    private constructor() {
        this._getVehiclePositions();
        this._timer = setInterval(() => {
            this._getVehiclePositions();
        }, 10000);
    }

    private async _getVehiclePositions() {
        const url = _baseUrl + 'vehiclePositions';
        const headers = {
            accept: 'application/x-protobuf',
            apiKey: _apiKey,
        };
        try {
            const response = await fetch(url, {
                headers,
            });
            const body = response.body;
            if (body === null) {
                console.log(
                    'StmRouter.getVehiclePositions: Response body is null'
                );
                return;
            }
            const buffers = [];
            const reader = body.getReader();
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }

                buffers.push(value);
            }
            const data = Buffer.concat(buffers);
            try {
                let decodedData =
                    GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
                        data
                    );
                console.log('aaaaaaaaa');
                this._vehiclePositions = this._parseData(decodedData);
            } catch (err) {
                console.log(
                    'StmRouter.getVehiclePositions: Could not decode protobuf data\n' +
                        err
                );
            }
        } catch (err) {
            console.log(
                'StmRouter.getVehiclePositions: Could not fetch from ' +
                    url +
                    '\n' +
                    err
            );
        }
    }

    private _parseData(
        decodedData: GtfsRealtimeBindings.transit_realtime.FeedMessage
    ): any {
        let data: any = [];
        decodedData.entity.forEach((entity) => {
            if (entity.vehicle) {
                const vehiclePosition = {
                    latitude: entity.vehicle.position?.latitude,
                    longitude: entity.vehicle.position?.longitude,
                    speed: entity.vehicle.position?.speed,
                    currentStatus: entity.vehicle.currentStatus,
                    occupancyStatus: entity.vehicle.occupancyStatus,
                };
                data.push(vehiclePosition);
            }
        });
        return data;
    }

    public get vehiclePositions() {
        return this._vehiclePositions;
    }

    public static getInstance(): StmRouter {
        if (!this._instance) {
            this._instance = new StmRouter();
            console.log('StmRouter instance created');
        }
        return this._instance;
    }
}
