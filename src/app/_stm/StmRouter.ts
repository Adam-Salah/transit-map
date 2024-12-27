const _baseUrl: string = 'https://api.stm.info/pub/od/gtfs-rt/ic/v2/';
const _apiKey: string = process.env.STM_KEY!;
import GtfsRealtimeBindings from 'gtfs-realtime-bindings';

export class StmRouter {
    private static _instance: StmRouter;

    private _vehiclePositions: any;

    private _timer;

    private constructor() {
        this._vehiclePositions = 'Empty Vehicle Positions';
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
                console.log(decodedData);
                this._vehiclePositions = decodedData;
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

    get vehiclePositions() {
        return this._vehiclePositions;
    }

    public static get instance(): StmRouter {
        if (!this._instance) {
            this._instance = new StmRouter();
        }

        return this._instance;
    }
}
