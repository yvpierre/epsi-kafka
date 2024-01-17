const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'cancelled-flights-producer',
    brokers: ['kafka1:9092'],
})

const producer = kafka.producer()
await producer.connect()

await producer.send({
    topic: 'test-topic',
    messages: [
        { value: 'Hello KafkaJS user!' },
    ],
    setTimeout: 1000,
})

await producer.disconnect()