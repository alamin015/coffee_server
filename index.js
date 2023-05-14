const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const cors = require('cors');
const app = express();

// port 
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

app.get("/",(req,res) => {
    res.send("hello world");
})


// working function 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fclnk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });



  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      const database = client.db("Coffee");
      const user = database.collection("user");


      app.get("/card",async(req,res) => {
        const cursor =await user.find().toArray();
        res.send(cursor);
      })


      app.get("/details/:id",async(req,res) => {
        const user_id = req.params.id;
        const query = { _id: new ObjectId(user_id) };
        const result = await user.findOne(query);
        res.send(result)
      })

      app.put('/update/:id',async(req,res) => {
        const id = req.params.id;
        const data = req.body;
        const options = { upsert: true };
        const filter = { _id: new ObjectId(id) };

        const updatedDoc = {
          $set : {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            password: data.password,
            message: data.message
          }
        }
        
        const result = await user.updateOne(filter, updatedDoc, options)
        res.send(result);

      })


      app.delete("/remove/:id",async(req,res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id)}
        const result = await user.deleteOne(query);
        res.send(result);
      })


      app.post('/data',async(req,res) => {
        const data = req.body;
        // console.log(data);
        const result = await user.insertOne(data);
        res.send(result)
      })


      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);









app.listen(port,() => {
    console.log("server is running");
})