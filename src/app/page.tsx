'use client'
import { useShallowEffect } from "@mantine/hooks";
import mqttClient from '@/util/mqttClient';
import mqtt from "mqtt";

export default function Home() {
  useShallowEffect(() => {
    console.log("connecting ...");
    const client = mqtt.connect("wss://io.wibudev.com");
    client.on("connect", () => {
      console.log("connected");
      client.subscribe("play", (err) => {
        if (err) {
          console.log(err);
        }
      })
    });

    client.on("message", (topic, message) => {
      console.log(message.toString());
    });

    return () => {
      client.end();
    }

  }, [])
  return (
    <div>main page</div>
  );
}
