import { KafkaProducer } from './producer';
import { Kafka, Producer } from 'kafkajs';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('kafkajs', () => {
  const mProducer = {
    connect: vi.fn(),
    send: vi.fn(),
    disconnect: vi.fn(),
  };
  const mKafka = {
    producer: vi.fn(() => mProducer),
  };
  return { Kafka: vi.fn(() => mKafka), Producer: vi.fn(() => mProducer) };
});

describe('KafkaProducer', () => {
  let producer: KafkaProducer;
  let mProducer: vi.Mocked<Producer>;

  beforeEach(() => {
    producer = new KafkaProducer('test-client', ['localhost:9092']);
    mProducer = (Kafka as vi.Mock).mock.results[0].value.producer();
  });

  it('should connect the producer', async () => {
    await producer.connect();
    expect(mProducer.connect).toHaveBeenCalled();
  });

  it('should send a message', async () => {
    const message = { order_number: '12345', sku: 'ABC123', price: 100.0, total: 120.0 };
    await producer.sendMessage('test-topic', message);
    expect(mProducer.send).toHaveBeenCalledWith({
      topic: 'test-topic',
      messages: [{ value: JSON.stringify(message) }],
    });
  });

  it('should disconnect the producer', async () => {
    await producer.disconnect();
    expect(mProducer.disconnect).toHaveBeenCalled();
  });
});