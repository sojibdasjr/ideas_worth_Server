const express = require('express');
const { MongoClient } = require('mongodb');
const cors  = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
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
        const userCollection = database.collection('users');
        const studentCollection = database.collection('students');
        const teacherCollection = database.collection('teachers');

        // ALL GET API

        //Get events api
        app.get('/events', async(req, res)=>{
            const cursor = eventCollection.find({});
            const events = await cursor.toArray();
            res.send(events);
        });

        //Get students api
        app.get('/students',  async(req, res)=>{
            const cursor = studentCollection.find({});
            const students = await cursor.toArray();
            res.send(students);
        });

        // get teacher api

        app.get('/teachers', async(req, res)=>{
            const cursor = teacherCollection.find({});
            const teachers = await cursor.toArray();
            res.send(teachers);
        });

        app.get('/users/:email', async(req, res)=>{
            const email = req.params.email;
            const query = {email: email};
            const user = await userCollection.findOne(query);
            let isAdmin = false;
            if(user.role === 'admin'){
                isAdmin = true;
            }
            res.json({admin: isAdmin});

        })

        // POST ALL API

        // users post api
        app.post('/users', async(req, res)=>{
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.json(result);
        })

        // put 
        app.put('/users', async(req, res)=>{
            const user = req.body;
            const filter = {email:  user.email};
            const option = {upsert:true};
            const updateDoc = {$set:user};
            const result = await userCollection.updateOne(filter, updateDoc, option);
            res.json(result);
        });

        app.put('/users/admin', async(req, res)=>{
            const user = req.body;
            const filter = {email: user.email};
            const updateDoc = {$set:{role:'admin'}};
            const result = await userCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        // student post api 
        app.post('/students', async(req, res)=>{
            const event = req.body;
            const result = await studentCollection.insertOne(event);
            res.json(result);
        });

        // event post api
        app.post('/events', async(req, res)=>{
            const event = req.body;
            const result = await eventCollection.insertOne(event);
            res.json(result);
        });

        //teacher post api
        app.post('/teachers', async(req, res)=>{
            const teacher = req.body;
            const result = await teacherCollection.insertOne(teacher);
            res.json(result);
        });

        //delete oparation
        // delete students
        app.delete('/students/:id', async(req,  res )=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await studentCollection.deleteOne(query); 
            res.json(result);
            
        });

// delete teacher
        app.delete('/teachers/:id', async(req,  res )=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await teacherCollection.deleteOne(query); 
            res.json(result);
            
        });

        // delete event
        app.delete('/events/:id', async(req,  res )=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await eventCollection.deleteOne(query); 
            res.json(result);
            
        });

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