const express = require("express");

// create a simple server
const server = express();

server.use(express.json());

// create the routes 
server.get("/search", (request, response) => {

    response.send({
        message: "You are on the about route",
        data: {
            username: "James",
            id: 123
        }
    })
})

 
server.post("/login", (request, response) => {

  

    let fullname = request.body.fullname;
    


    response.send({
        message: "User logged in",
        data: {
            fullname: fullname
        }
    })

})


// make the server listen for request
server.listen(3000, () => console.log("Server is listening on 3000"))