const express = require("express");
const bcrypt = require("bcrypt");

class UserController{
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
}

module.exports = UserController;