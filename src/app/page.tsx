'use client'
import { useShallowEffect } from "@mantine/hooks";
import mqttClient from '@/util/mqttClient';
import mqtt from "mqtt";
import { useState } from "react";
import { Box, Button, Code, Group, Stack, Title } from "@mantine/core";

const MQTT_URL = 'wss://io.wibudev.com';

export default function Home() {
  const [log, setLog] = useState<string[]>([])
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [nav, setNav] = useState({
    title: "nav",
    item: [
      {
        title: "mulai",
        onClick: onMulai,
        isActive: true
      },
      {
        title: "save cookies",
        onClick: onSaveCookies,
        isActive: true
      },
      {
        title: "reload",
        onClick: onReload,
        isActive: true
      }
    ]
  });

  useShallowEffect(() => {
    console.log('connenting ...')
    setMessages((prevMessages) => [...prevMessages, "$"]);
    const client = mqtt.connect(MQTT_URL);

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
    });

    client.on('message', (topic, message) => {
      setMessages((prevMessages) => [...prevMessages, message.toString()]);
    });

    client.subscribe('play');

    setClient(client);

    return () => {
      client.end();
    };
  }, []);

  function onMulai() {
    fetch("/api/content?key=1").then(res => res.json()).then(data => {
      setLog([...log, JSON.stringify(data)])
    })
  }

  function onSaveCookies() {
    client?.publish('play', 'save/cookies')
  }

  function onReload() {
    client?.publish('play', 'reload')
  }

  return (
    <Group>
      <Stack p={"md"}>
        <Title>AUTO</Title>
        <Button.Group>
          {nav?.item?.map((item, index) => (
            <Button
              w={100}
              size="compact-xs"
              key={index}
              onClick={item?.onClick}
            >
              {item?.title}
            </Button>
          ))}
        </Button.Group>

        <Box>
          <Code >
            <pre style={{
              padding: 10,
              width: 720,
              height: 460,
              backgroundColor: "black",
              color: "white",
            }}>
              {messages.join("\n").toString()}
            </pre>
          </Code>
        </Box>
      </Stack>
    </Group>
  );
}
