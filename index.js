const waveformECG = new BMWaveform(document.getElementById('waveform-ecg'), 'red', 250);
const waveformSpO2 = new BMWaveform(document.getElementById('waveform-spo2'), 'red', 100);
const waveformRESP = new BMWaveform(document.getElementById('waveform-resp'), 'yellow', 100);

const paramHeartRate = document.getElementById('parameter-heart-rate');
const paramNIBP = document.getElementById('parameter-nibp');
const paramSpO2 = document.getElementById('parameter-spo2');
const paramPulseRate = document.getElementById('parameter-pulse-rate');
const paramTemperature = document.getElementById('parameter-temperature');
const paramRespRate = document.getElementById('parameter-resp-rate');

var dataParser = new BMDataParser();
var patientMonitor = new BMPatientMonitor(dataParser);

dataParser.registerCallback('on_ecg_waveform_received', (amp)=>{
    waveformECG.add(amp);
});

dataParser.registerCallback('on_spo2_waveform_received', (amp)=>{
    waveformSpO2.add(amp);
});

dataParser.registerCallback('on_resp_waveform_received', (amp)=>{
    waveformRESP.add(amp);
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

function onBtnSearchClick(){
    patientMonitor.connect();
}