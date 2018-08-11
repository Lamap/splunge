const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
app.use(express.static(__dirname + '/dist'));

app.listen(port);

console.log('remote apps static is: ' + __dirname + '/dist, at port: ' + port);