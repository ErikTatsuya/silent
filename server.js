const express = require('express');
const cors = require("cors");


const port = 3000;

const app = express();

app.use(cors({origin: "*"}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.get("/api/status", (req, res) => {
    res.status(200).json({
        "message": "sucess"
    });
});

let users = [];

const UserController = require("./controllers/userController.js");
const userController = new UserController(users);

//cria usuários
app.post("/silent/users/create-user", (req, res) => { userController.createUser(req, res) });

//mostra usuários
app.get("/silent/users", (req, res) => {
    res.json(users);
});

app.get("/silent/users/:id", (req, res) => {
    const userId = parseInt(req.params.id);

    //procura usuários com esse id
    const user = users.find(u => u.id === userId);

    if(user)
    {
        res.status(200).json({
            "message": "user found sucessefully",
            "data": user
        });
    }
    else
    {
        res.status(404).json({
            "message": `${userId} not found`
        });
    }
});

app.post("/silent/users/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    //procura um usuário como o mesmo email para logar
    const isAllowed = (
        users.find(user => user.email === email && user.password === password) 
    );

    //verifica se o usuário pode entrar ou não

    if(!isAllowed)
    {
        //usuário vai estar permitido? não
        return res.status(401).json({
            "message": "user not allowed."
        });
    }

    if(isAllowed)
    {
        //usuário vai estar permitido? sim
        res.status(201).json({
            "message": "user allowed"
        });
    }
})


//launch server at port 3000
app.listen(port, () => {
    console.log("Listening to port 3000");
    console.log("Test route: localhost:3000/api/status");
});