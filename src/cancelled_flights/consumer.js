const {Kafka} = require("kafkajs");
const kafka = new Kafka({
    clientId: 'cancelled-flights-consumer',
    brokers: ['localhost:9092'],
})
const consumer = kafka.consumer({ groupId: 'test-group' })
async function main(){
    await consumer.connect()
    await consumer.subscribe({ topic: 'airlines-status-count-topic', fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                value: message.value.toString(),
            })
        },
    })
}
main();