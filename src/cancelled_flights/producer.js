const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'cancelled-flights-producer',
    brokers: ['localhost:9092'],
})
async function getMessage(){
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
}
getMessage();