var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mqtt = require('mqtt');
var fs = require('fs');
var pdfkit = require('pdfkit');
var app = express();
var splitFile = require('split-file');
var client = mqtt.connect('tcp://172.22.25.53:1883', { clientId: 'mosquitto_1234', clean: false });

const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(cors());

console.log(client.options);
client.on('connect', function () {
  client.subscribe('AB/#', { qos: 2 }, async function (err) {
    if (!err) {
      var url = './utils/out.pdf';
      var buff = fs.readFileSync(url);
      var data = new Buffer(buff);
      var fileArr = url.split('/');
      var file = fileArr[fileArr.length-1];
      var jsonVal = {
        data: data,
        name: file
      }
      client.publish('AB/1/qwer', JSON.stringify(jsonVal), { qos: 2 }, function (err) {
        if (!err) {
          console.log("SENT :  ", new Date().toLocaleString());
        }
      })
    }
  })
})

client.on('message', function (topic, message) {
  console.log('message: ', message.toString());
  var buff = new Buffer(message);
  // fs.writeFileSync('./saved/out.pdf.sf-part2', buff);
})

app.get('/', (req, res) => {
  res.send("Welcome To Communication Channel");
});

app.listen(port, () => {
  console.log("Server is up in port " + port);
})