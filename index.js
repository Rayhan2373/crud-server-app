const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.get('/',(req, res)=>{
    res.send('Successfully Done')
})


const uri = `mongodb+srv://${process.env.user_name}:${process.env.user_pass}@cluster0.guzcczi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect()
        const personCollection = client.db('person').collection("person-info");
        app.get('/people', async(req, res)=>{
            const query = {}
            const user = personCollection.find(query)
            const result = await user.toArray()
            res.send(result)
        })
        app.post('/people', async(req, res)=>{
            const user = req.body;
            const result = personCollection.insertOne(user)
            res.send(result)
        })
        app.put('/people/:id', async(req, res)=>{
            const id = req.params.id;
            const userInfo = req.body;
            const query = {_id : ObjectId(id)}
            const options = {upsert : true}
            const updateDoc ={
                $set : {
                    name : userInfo.name,
                    email : userInfo.email
                }
            }
            const result = await personCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })
        app.delete('/people/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)}
            const result = await personCollection.deleteOne(query)
            res.send(result)
        })
    }
    finally{

    }
}
run().catch(console.error())
app.listen(5000, ()=>{
    console.log('Successful')
})