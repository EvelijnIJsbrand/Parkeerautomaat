// import { WebSocketServer } from 'ws';
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 8080 });
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')


const port = new SerialPort({
    path: 'COM4',
    baudRate: 9600,
})

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
parser.on('data', console.log)

const connections = [];

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

    ws.send('something');
    connections.push(ws);
});

wss.on('close', function close() {
    console.log('disconnected');
});



parser.on('data', (data) => {
    console.log('Data:', data)
    connections.forEach((ws) => {
        ws.send(data);
    });

});
