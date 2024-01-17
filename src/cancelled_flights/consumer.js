const {Kafka} = require("kafkajs");
const kafka = new Kafka({
    clientId: 'cancelled-flights-producer',
    brokers: ['kafka1:9092'],
})
const consumer = kafka.consumer({ groupId: 'test-group' })

await consumer.connect()
await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        console.log({
            value: message.value.toString(),
        })
    },
})