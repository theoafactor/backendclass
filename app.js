const express = require("express");
require('dotenv').config()

const { MongoClient } = require("mongodb");

const url = process.env.DB_CONNECT;

const mongo_client = new MongoClient(url);



// create a simple server
const server = express();

server.use(express.json());

// create the routes 
server.get("/search", (request, response) => {

    response.status(200).send({
        message: "You are on the about route",
        data: {
            username: "James",
            id: 123
        }
    })
})

 
server.post("/login", async (request, response) => {

  

    let fullname = request.body.fullname;
    let username = request.body.username;
    let password = request.body.password;

    await mongo_client.connect();
    
    let result = await mongo_client.db("backend-db").collection("users").insertOne({
        fullname: fullname, 
        username: username,
        password: password
    });

    console.log(result)


    response.status(200).send({
        message: "User logged in",
        data: {
            fullname: fullname
        }
    })

})


// make the server listen for request
server.listen(process.env.PORT, () => console.log(`Server is listening on http://${process.env.HOSTNAME}:${process.env.PORT}`))