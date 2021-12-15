const express = require('express');
const { MongoClient } = require('mongodb');
const cors  = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n3lnz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);



async function run (){
    try{
        await client.connect();
        const database = client.db('ideas_worth');
        const eventCollection = database.collection('events');
        const studentCollection = database.collection('students')

        //Get events api
        app.get('/events', async(req, res)=>{
            const cursor = eventCollection.find({});
            const events = await cursor.toArray();
            res.send(events);
        })

        //Get students api
        app.get('/students',  async(req, res)=>{
            const cursor = studentCollection.find({});
            const students = await cursor.toArray();
            res.send(students);
        })
    }
    finally{
        // await client.close();
    }

}

run().catch(console.dir)

app.get('/',  (req, res)=>{
    res.send('Ideas_server_ is_Running');
})

app.listen(port, ()=>{
    console.log('Server runnign at port', port);
})