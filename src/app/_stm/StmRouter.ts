const _baseUrl: string = 'https://api.stm.info/pub/od/gtfs-rt/ic/v2/';
const _apiKey: string = process.env.STM_KEY!;

export class StmRouter {
    
    private static _vehiclePositions: any;

    private static _timer = setInterval(() => {
        this._getVehiclePositions;
    }, 10000);
    
    public static async _getVehiclePositions() {
        console.log('hi')
        try {
            const headers = {
                accept: 'application/json',
                apiKey: _apiKey,
            };
            this._vehiclePositions = await fetch(
                _baseUrl + 'vehiclePositions',
                { headers }
            );
        } catch (e) {
            console.log(
                'StmRouter.getVehiclePositions: Could not fetch STM data from API'
            );
        }
    }

    static get vehiclePositions() {
        return this._vehiclePositions;
    }
}
