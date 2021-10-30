//require express
const express = require('express');
//require mongodb
const { MongoClient } = require('mongodb');
//require ObjectId from mongodb
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();

const app = express();
const cors = require('cors');

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


//connection string from mongodb atlas
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v05ft.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


//create async function 
async function run(){
    try{
        await client.connect();
        const database = client.db("happyTours");
        const destinationCollection = database.collection("Destinations");

        //GET API
        app.get('/places', async(req, res)=>{
            const cursor = destinationCollection.find({});
            const places = await cursor.toArray();
            res.send(places);
        });

        //GET single places
        app.get('/places/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const place = await destinationCollection.findOne(query);
            res.send(place);
        });

        //POST API
        app.post('/destinations', async(req, res)=>{ 
            const destination = req.body;
            // console.log('post api hitted', destination);
            const result = await destinationCollection.insertOne(destination);
            res.json(result);
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);


// Home route api
app.get('/', (req, res)=>{
    res.send('Happy Tours Server');
});

//listening port
app.listen(port, ()=>{
    console.log('Server Running on port ', port);
});