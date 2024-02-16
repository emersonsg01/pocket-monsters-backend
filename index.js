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

app.get('/pokemon', async (req, res) => {

  const pokemons = await knex.select('name', 'desc', 'type_id', 'id', 'breed_id')
  .from('pocket-monster')

  res.send(pokemons);
});

app.get('/pokemon/:id', async (req, res) => {

  const pokemon = await knex.select('name', 'desc', 'type_id', 'id', 'breed_id')
  .from('pocket-monster')
  .where('id', req.params.id)

  res.send(pokemon);
});

app.post('/pokemon',jsonParser, async (req, res) => {

    const pokemon = await knex('pocket-monster').insert({
      name: req.body.name,
      desc: req.body.desc,
      type_id: req.body.type_id,
      breed_id: req.budy.breed_id,
    })
  
    res.send(pokemon);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
