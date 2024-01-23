const { Kafka } = require('kafkajs');
const axios = require('axios');


const kafka = new Kafka({
    clientId: 'cancelled-flights-producer',
    brokers: ['localhost:9092'],
})

const apiKey = 'av59smnptjuqw4b8upayeaau';
const apiUrl = 'https://api.airfranceklm.com/opendata/flightstatus/';
const requestOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'API-Key': apiKey,
    }
};
async function getKlmResponse(){
    try {
        const response = await axios.get(apiUrl, requestOptions);
        return response.data.operationalFlights;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function fetchDataAndLog() {
    try {
        return await getKlmResponse();
    } catch (error) {
        console.error('Error fetching and logging data:', error);
    }
}

async function sendMessage(messages){
const producer = kafka.producer()
await producer.connect()
await producer.send({
    topic: 'airlines-status-count-topic',
    messages: messages
    ,
    setTimeout: 1000,
})

await producer.disconnect()
}

async function run() {
    try {
        const json = await fetchDataAndLog();
        const dictionnaireResultat = createFlightStatusDictionary(json);
        const statusList = ['ON_TIME', 'CANCELLED', 'DELAYED_DEPARTURE'];
        const statusCount = {};
        for (const airline in dictionnaireResultat) {
            const statuses = dictionnaireResultat[airline];
            const infoList = statusList.map(status => {
                const count = statuses.filter(s => s === status).length;
                return `${status}: ${count}`;
            });
            statusCount[airline] = infoList;
        }

        let messages =  [];
        for(let airline in statusCount){
            const message = {
                key: 'statusCountByAirlineCompany',
                value: `${airline}: ${JSON.stringify(statusCount[airline])}`,
            };
            messages.push(message);
        }

        await sendMessage(messages);
        return "ok";
    } catch (error) {
        console.error('Error:', error);
        return { error: 'An error occurred.' };
    }
}

function createFlightStatusDictionary(json) {
        let dictionnaire = {};
        json.forEach(flight => {
            var nomCompagnie = flight.airline.name;
            var statutVol = flight.flightStatusPublic;
            if (dictionnaire[nomCompagnie] === undefined) {
                dictionnaire[nomCompagnie] = [statutVol];
            } else {
                dictionnaire[nomCompagnie].push(statutVol);
            }
        });

        return dictionnaire;
}
const interval = 20 * 1000;

setInterval(run, interval);
