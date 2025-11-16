const bcrypt = require("bcrypt");

const saltRounds = 10;

const password = "hello 123";

bcrypt.hash(password, saltRounds, function(err, hash){
    if (err) {
        console.log(`error: ${err}`);
    }

    console.log(`${password}`);
    console.log(`${hash}`);
})
