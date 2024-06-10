import mqtt from "mqtt";

declare global {
    var mqttClient: mqtt.MqttClient;
}

const mqttClient =
    globalThis.mqttClient || mqtt.connect("wss://io.wibudev.com");

export default mqttClient;