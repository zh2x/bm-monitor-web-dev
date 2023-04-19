
class BMPatientMonitor{
    UUID_SERVICE_COMM = "49535343-fe7d-4ae5-8fa9-9fafd205e455";
    UUID_CHARACTER_RECEIVE = "49535343-1e4d-4bd9-ba61-23c647249616";

    constructor(parser){
        this.device = null;
        this.chReceive = null;
        this.parser = parser;
        this.reconnectTime = 0;
    }

    sleep(mseconds){
        return new Promise((resolve => {
            setTimeout(resolve, mseconds);
        }));
    }

    startNotify(){
        this.chReceive.addEventListener(
            'characteristicvaluechanged', e => {
                this.parser.addData(e.target.value);
            }
        );
        this.chReceive.startNotifications();
    }

    async connect(){
        this.device = await navigator.bluetooth.requestDevice({
            filters : [ { namePrefix : 'BerryMed'} ],
            optionalServices : [this.UUID_SERVICE_COMM]
        });

        while((this.chReceive == null) && (this.reconnectTime <= 5)){
            console.log('bm-patient-monitor: ', 'connect time ' + this.reconnectTime);

            try{
                const server = await this.device.gatt.connect();
                console.log('bm-patient-monitor: ', server);

                const service = await server.getPrimaryService(this.UUID_SERVICE_COMM);
                console.log('bm-patient-monitor: ', service);

                this.chReceive = await service.getCharacteristic(this.UUID_CHARACTER_RECEIVE);
                console.log('bm-patient-monitor: ', this.chReceive);
            }
            catch(e){
                console.log('bm-patient-monitor: ', this.chReceive);
            }

            this.sleep(500);
            this.reconnectTime += 1;
        }

        this.reconnectTime = 0;

        if(this.chReceive != null){
            this.startNotify();
            console.log('bm-patient-monitor: ' + 'start notify');
        }
    }
}