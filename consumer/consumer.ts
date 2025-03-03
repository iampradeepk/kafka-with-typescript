import { Kafka } from 'kafkajs';

async function runConsumer() {
  const kafka = new Kafka({
    clientId: 'my-consumer',
    brokers: ['kafka:9092'], // Again using docker-compose service name
  });

  const consumer = kafka.consumer({ groupId: 'test-group' });

  await consumer.connect();
  console.log('Consumer connected');

  const topic = 'test-topic';
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      });
    },
  });
}

runConsumer().catch(console.error);
