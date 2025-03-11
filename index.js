const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const cors = require('cors')

// Enable CORS for all routes
app.use(cors())

const port = 3000

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    port : 3306,
    user : 'emersonsg',
    password : 'root',
    database : 'pocket-monsters'
  }
});


app.get('/', function(req, res) {
  res.send('Hello world!');
});





app.get('/animal', async (req, res) => {

  const animal = await knex.select('id', 'desc', 'gender', 'birth_date', 'breed_id')
  .from('animal')

  res.send(animal);
});

app.get('/animal/:id', async (req, res) => {

  const animal = await knex.select('id', 'desc', 'gender', 'birth_date', 'breed_id')
  .from('animal')
  .where('id', req.params.id)

  res.send(animal);
});

app.post('/animal',jsonParser, async (req, res) => {

    const animal = await knex('animal').insert({
      desc: req.body.desc,
      gender: req.body.gender,
      birth_date: req.body.birth_date,
      breed_id: req.body.breed_id,
    })
  
    res.send(animal);
})






app.get('/breed', async (req, res) => {

  const breed = await knex.select('id', 'breed', 'sub_breed_id')
  .from('breed')

  res.send(breed);
});

app.get('/breed/:id', async (req, res) => {

  const breed = await knex.select('id', 'breed', 'sub_breed_id')
  .from('breed')
  .where('id', req.params.id)

  res.send(breed);
});

app.post('/breed',jsonParser, async (req, res) => {

    const breed = await knex('breed').insert({
      breed: req.body.breed,
      sub_breed_id: req.body.sub_breed_id,
      
    })
  
    res.send(breed);
})







app.get('/sub_breed', async (req, res) => {

  const sub_breed = await knex.select('id', 'sub_breed',)
  .from('sub_breed')

  res.send(sub_breed);
});

app.get('/sub_breed/:id', async (req, res) => {

  const sub_breed = await knex.select('id', 'sub_breed')
  .from('sub_breed')
  .where('id', req.params.id)

  res.send(sub_breed);
});

app.post('/sub_breed',jsonParser, async (req, res) => {

    const sub_breed = await knex('sub_breed').insert({
      sub_breed: req.body.sub_breed,
    
      
    })
  
    res.send(sub_breed);
})






// Pocket Monster endpoints
app.get('/pocket-monster', async (req, res) => {
  const monsters = await knex.select('id', 'name', 'desc', 'type_id')
  .from('pocket-monster')

  res.send(monsters);
});

app.get('/pocket-monster/:id', async (req, res) => {
  const monster = await knex.select('id', 'name', 'desc', 'type_id')
  .from('pocket-monster')
  .where('id', req.params.id)

  res.send(monster);
});

app.post('/pocket-monster', jsonParser, async (req, res) => {
  const monster = await knex('pocket-monster').insert({
    name: req.body.name,
    desc: req.body.desc,
    type_id: req.body.type_id
  })

  res.send(monster);
});

app.put('/pocket-monster/:id', jsonParser, async (req, res) => {
  const monster = await knex('pocket-monster')
    .where('id', req.params.id)
    .update({
      name: req.body.name,
      desc: req.body.desc,
      type_id: req.body.type_id
    });

  res.send({updated: monster});
});

app.delete('/pocket-monster/:id', async (req, res) => {
  const monster = await knex('pocket-monster')
    .where('id', req.params.id)
    .del();

  res.send({deleted: monster});
});

// Type endpoints
app.get('/type', async (req, res) => {
  const types = await knex.select('id', 'type')
  .from('type')

  res.send(types);
});

app.get('/type/:id', async (req, res) => {
  const type = await knex.select('id', 'type')
  .from('type')
  .where('id', req.params.id)

  res.send(type);
});

app.post('/type', jsonParser, async (req, res) => {
  const type = await knex('type').insert({
    type: req.body.type
  })

  res.send(type);
});

app.put('/type/:id', jsonParser, async (req, res) => {
  const type = await knex('type')
    .where('id', req.params.id)
    .update({
      type: req.body.type
    });

  res.send({updated: type});
});

app.delete('/type/:id', async (req, res) => {
  const type = await knex('type')
    .where('id', req.params.id)
    .del();

  res.send({deleted: type});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
