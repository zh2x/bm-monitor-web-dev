const txBluetoothStatus = document.getElementById('bluetooth-status');

const waveformECG = new BMWaveform(document.getElementById('waveform-ecg'), 'red', 250, 1);
const waveformSpO2 = new BMWaveform(document.getElementById('waveform-spo2'), 'red', 100, 3);
const waveformRESP = new BMWaveform(document.getElementById('waveform-resp'), 'yellow', 250, 3);

const paramHeartRate = document.getElementById('parameter-heart-rate');
const paramNIBP = document.getElementById('parameter-nibp');
const paramSpO2 = document.getElementById('parameter-spo2');
const paramPulseRate = document.getElementById('parameter-pulse-rate');
const paramTemperature = document.getElementById('parameter-temperature');
const paramRespRate = document.getElementById('parameter-resp-rate');

var dataParser = new BMDataParser();
var patientMonitor = new BMPatientMonitor(dataParser, refreshBluetoothStatus);

var ecgWaveformBuf = [];
var spo2WaveformBuf = [];
var respWaveformBuf = [];

var waveforms = [
    {"waveform" : waveformECG,  "buffer" : ecgWaveformBuf,  "slice_size" : 10},
    {"waveform" : waveformSpO2, "buffer" : spo2WaveformBuf, "slice_size" : 2},
    {"waveform" : waveformRESP, "buffer" : respWaveformBuf, "slice_size" : 2},
];

dataParser.registerCallback('on_ecg_waveform_received', (amp)=>{
    ecgWaveformBuf.push(amp);
});

dataParser.registerCallback('on_spo2_waveform_received', (amp)=>{
    spo2WaveformBuf.push(amp);
});

dataParser.registerCallback('on_resp_waveform_received', (amp)=>{
    respWaveformBuf.push(amp);
});

dataParser.registerCallback('on_ecg_params_received', (states, heartRate, respRate)=>{
    paramHeartRate.innerHTML = (heartRate === 0) ? '- -' : heartRate;
    paramRespRate.innerHTML = (heartRate === 0) ? '- -' : respRate;
});

dataParser.registerCallback('on_nibp_params_received', (states, cuff, sys, mean, dia)=>{
    paramNIBP.innerHTML = ((sys === 0) || (dia === 0)) ? '- - -/- -' : sys+'/'+dia;
});

dataParser.registerCallback('on_spo2_params_received', (states, spo2, pulseRate)=>{
    paramSpO2.innerHTML = (spo2 === 127) ? '- -' : spo2;
    paramPulseRate.innerHTML = (pulseRate === 255) ? '- -' : pulseRate;
});

dataParser.registerCallback('on_temp_params_received', (states, temperature)=>{
    paramTemperature.innerHTML = (temperature === 0) ? '- -.-' : temperature;
});

setInterval(updateWaveforms, 40);

function onBtnSearchClick(){
    patientMonitor.connect();
}

function onBtnNIBPClick(){
    patientMonitor.startNIBP();
}

function refreshBluetoothStatus(status){
    txBluetoothStatus.innerHTML = status;
}

function updateWaveforms(){
    if(document.hidden){
        for(let waveform of waveforms){
            waveform["waveform"].addArray(waveform["buffer"].splice(0, waveform["buffer"].length));
        }
    }
    else{
        for(let waveform of waveforms){
            if(waveform["buffer"].length > waveform["slice_size"]){
                waveform["waveform"].addArray(waveform["buffer"].splice(0, waveform["slice_size"]));
            }
        }
    }
}
