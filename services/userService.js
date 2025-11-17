const express = require("express");
const bcrypt = require("bcrypt");
const { use } = require("react");

class UserService{
    constructor(users){
        this.users = users;
    }

    verifyExistingUser(users, email, name, res){
        const isExisting = users.some(u => u.email === email || u.name === name);
        if (isExisting){
            res.status(409).json({
                message: "User already exists."
            })

            return true;
        }

        return false;
    }

    genBase36Id(idIndex){
        return `USER_${idIndex.toString(36)}`;
    }

    async createUser(req, res) {
        try{
            const saltRounds = 10;

            const { name, email, password } = req.body;

            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(password, salt);

            if(this.verifyExistingUser(this.users, email, name, res)) return;

            const idIndex = this.users.length + 1;
            const newId = this.genBase36Id(idIndex)

            const date = new Date().toISOString();

            const user = {
                name: name,
                email: email, 
                password: hashedPassword,
                id: newId,
                createdAt: date
            }

            this.users.push(user)

            res.status(201).json({
                message: "User created successfuly.",
                data: {
                    name: user.name,
                    email: user.email,
                    id: user.id
                }
            })

        }

        catch (error) {
            res.status(500).json({
                message: "Internal server error."
            })

            console.log(error);
        }
    }

    async login(req, res){
        try{
            const { email, password } = req.body;

            //procura um usuário como o mesmo email para logar
            const user = ( this.users.find(user => user.email === email && bcrypt.compare(password, user.password)));

            //verifica se o usuário pode entrar ou não

            if(!user || !user.isVerified)
            {
                //usuário vai estar permitido? não
                return res.status(401).json({
                    "message": "user not allowed."
                });
            }

            if(user && user.isVerified)
            {
                //usuário vai estar permitido? sim
                res.status(200).json({
                    "message": "user allowed"
                });
            }
        }

        catch (error) {
            res.status(500).json({
                message: "Internal server error."
            })

            console.log(error);
        }
    }
}

module.exports = UserService;