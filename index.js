const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()


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






app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
