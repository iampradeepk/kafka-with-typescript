import { Kafka } from 'kafkajs';
import cron from 'node-cron';

async function runCronConsumer() {
  const kafka = new Kafka({
    clientId: 'my-cron-consumer',
    brokers: ['kafka:9092'],
  });

  const consumer = kafka.consumer({ groupId: 'cron-group' });
  await consumer.connect();
  console.log('Cron Consumer connected');

  const topic = 'test-topic';
  await consumer.subscribe({ topic, fromBeginning: true });

  // Run consumer logic every minute
  cron.schedule('* * * * *', async () => {
    console.log('Cron job triggered');
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`[Cron] Message received:`, {
          topic,
          partition,
          offset: message.offset,
          value: message.value?.toString(),
        });
      },
    });
  });
}

runCronConsumer().catch(console.error);
