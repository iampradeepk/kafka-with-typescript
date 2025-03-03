import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'my-kafka-producer',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();
  console.log('Producer connected');

  // Example message
  const message = {
    value: JSON.stringify({ key: 'value' }),
  };

  await producer.send({
    topic: 'my-topic',
    messages: [message],
  });

  console.log('Message sent:', message);
  await producer.disconnect();
};

run().catch(console.error);