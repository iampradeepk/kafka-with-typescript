import { Kafka, Producer } from 'kafkajs';

export class KafkaProducer {
  private producer: Producer;

  constructor(clientId: string, brokers: string[]) {
    const kafka = new Kafka({ clientId, brokers });
    this.producer = kafka.producer();
  }

  async connect() {
    await this.producer.connect();
    console.log('Producer connected');
  }

  async sendMessage(topic: string, message: object) {
    const formattedMessage = {
      value: JSON.stringify(message),
    };

    try {
      await this.producer.send({
        topic,
        messages: [formattedMessage],
      });
      console.log(`Message sent: ${JSON.stringify(formattedMessage)}`);
    } catch (error) {
      console.error('Error sending message', error);
    }
  }

  async disconnect() {
    await this.producer.disconnect();
    console.log('Producer disconnected');
  }
}

// Example usage
(async () => {
  const producer = new KafkaProducer('my-producer', ['kafka:9092']);
  await producer.connect();
  await producer.sendMessage('tenant-order-created-topic', {
    order_number: '12345',
    sku: 'ABC123',
    price: 100.0,
    total: 120.0,
  });
  await producer.disconnect();
})();