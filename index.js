const cors = require('cors')
const express = require('express')
const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [
	  'my-kafkaf-0.my-kafkaf-headless.jairh3110.svc.cluster.local:9092'
	  ]
});

const producer = kafka.producer()

const app = express();
app.use(cors());
app.options('*', cors());

const port = 8080;

app.get('/', (req, res, next) => {
  res.send('kafka api - adsoft');
});

const run = async (reaccionid,usuarioid) => {

    await producer.connect()
//    await producer.send()
    await producer.send({
      topic: 'test',
      messages: [ 
	{ 
	  'value': `{"reaccionid": "${reaccionid}" } , {"usuarioid": "${usuarioid}" } ` 
  	} 
      ],
    })
   await producer.disconnect()
}

app.get('/like', (req,req2 ,res, next) => {
  const reaccionid = req.query.reaccionid;
  const usuarioid= req2.query.usuarioid

  res.send({ 'reaccionid' : reaccionid } );
  res.send({ 'usuarioid' : usuarioid } );
  run(reaccionid,usuarioid).catch(e => console.error(`[example/producer] ${e.message}`, e))

});

app.listen(port,  () => 
	console.log('listening on port ' + port
));
