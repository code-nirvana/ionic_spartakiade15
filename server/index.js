var app = require('express')();
var server = require('http').Server(app);

var faker = require('faker');

server.listen(12345);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/contacts', function (req, res) {

  var contacts = [];

  for (var i = 0; i < 10000; ++i) {

    contacts.push({
      id: i,
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      metAt: 'Spartakiade 2015',
      face: 'http://placekitten.com/g/200/300',
      email: faker.internet.email(),
      twitter: '',
      phone: ''

    });
  }

  res.json(contacts);

  res.end();

});
