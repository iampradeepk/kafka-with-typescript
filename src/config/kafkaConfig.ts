import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'my-kafka-project',
  brokers: ['localhost:9092']
});

const producerConfig = {
  topic: 'my-topic',
  acks: 1,
  retries: 5
};

export { kafka, producerConfig };