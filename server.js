// console.log('May Node be with you');

const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient

var db;

MongoClient.connect("mongodb://jace:jace1234@ds257838.mlab.com:57838/jace-mongo-app", (err, client) => {
    if (err) return console.log(err)
    db = client.db('jace-mongo-app') //my db
    app.listen(3001, () => {
        console.log('listening on 3001')
    })
})

app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json())

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', (req,res) => {
    var cursor = db.collection('quotes').find()
    db.collection('quotes').find().toArray(function(err,result) {
        if (err) return console.log(err)
        console.log(result)
        res.render('index.ejs', {quotes: result})
    })
    // res.sendFile('/Sites/node-express-mongo' + '/index.html')
})

app.post('/quotes', (req,res) => {
    db.collection('quotes').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('was saved to database in jace-mongo-app!')
        res.redirect('/')
    })

    console.log(req.body)
})

app.put('/quotes', (res,req) => {
    db.collection('quotes')
    .findOneAndUpdate({name: 'jace'}, {
        $set: {
            name: req.body.name,
            quote: req.body.quote
        }
    }, {
        sort: {_id: -1},
        upsert: true
    }, (err, result) => {
        if (err) return res.send(err)
        res.setEncoding(result)
    })
})