const express = require('express');
const cors = require("cors");
const bcrypt = require("bcrypt");

const port = 3000;

const app = express();
const saltRounds = 10;

app.use(cors({origin: "*"}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.get("/api/status", (req, res) => {
    res.status(200).json({
        "message": "sucess"
    });
});

let users = [];

app.post("/silent/users/create-user", async (req, res) => {

    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        
        const doesUserAlreadyExists = (
            users.find(user => user.name === req.body.name && user.email === req.body.email && user.password === hashedPassword)
        );

        if (doesUserAlreadyExists)
        {
            res.status(409).json({
                "message": "user already exists"
            })

            return;
        }

        const user = {
            "name": req.body.name,
            "email": req.body.email,
            "password": hashedPassword,
            "id": users.length + 1
        };

        users.push(user)

        res.status(201).json({
            "message": "created user sucessfuly",
            "data": {user}
        })

        console.log(`created user id ${user.id}`)
    }

    catch (error) {
        res.status(500).json({
            "message": "error"
        })

        console.log(`Status: 500`);
        console.log(`${error}`)
    }

});

app.get("/silent/users", (req, res) => {
    res.json(users);
});

app.get("/silent/users/:id", (req, res) => {
    const userId = parseInt(req.params.id);

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

    const isAllowed = (
        users.find(user => user.email === email && user.password === password) 
    );

    if(!isAllowed)
    {
        res.status(401).json({
            "message": "user not allowed."
        });

        return;
    }

    if(isAllowed)
    {
        //usuário vai estar permitido? sim?
        res.status(201).json({
            "message": "user allowed"
        });
    }
})

app.listen(port, () => {
    console.log("Listening to port 3000");
    console.log("Test route: localhost:3000/api/status");
});