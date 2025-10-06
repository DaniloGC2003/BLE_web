const appUI = document.querySelector(".ui");
const bpmTxt = document.querySelector(".bpm");
const stopBTN = document.querySelector(".stop");
const heartUI = document.querySelector(".heart");
const startBTN = document.querySelector(".start");
const errorTxt = document.querySelector(".error");
const beatAudio = document.querySelector("audio");
const connectBTN = document.querySelector(".connect");
const connectUI = document.querySelector(".connect-ui");

let device;
let heartRate;


function handleRateChange(event) {
  //bpmTxt.textContent = parseHeartRate(event.target.value);
  console.log("WEIMA\n");
}


async function connectDevice() {
  if (device.gatt.connected) return;

  const server = await device.gatt.connect();
  const service = await server.getPrimaryService("4fafc201-1fb5-459e-8fcc-c5c9c331914b");

  heartRate = await service.getCharacteristic("beb5483e-36e1-4688-b7f5-ea07361b26a8");
  heartRate.addEventListener("characteristicvaluechanged", handleRateChange);
  console.log("connected");
}

async function requestDevice() {
    const options = {
    acceptAllDevices: true,
    optionalServices: ["4fafc201-1fb5-459e-8fcc-c5c9c331914b"],
    };
    device = await navigator.bluetooth.requestDevice(options);

    device.addEventListener("gattserverdisconnected", connectDevice);
}

async function startMonitoring() {
    await heartRate.startNotifications();
    //heartUI.classList.remove("pause-animation");
}


async function init() {
    if (!navigator.bluetooth) return errorTxt.classList.remove("hide");

    if (!device) await requestDevice();
    connectBTN.textContent = "connecting...";
    await connectDevice();
    await startMonitoring();
    //appUI.classList.remove("hide"); 
}

connectBTN.addEventListener("click", init);
