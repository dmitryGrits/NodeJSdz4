const express = require('express');
const fs = require('fs');
const path = require('path');
const joi = require('joi');

const filePath = path.join(__dirname, 'users.json');
let customId = 1;

// валидация
const scheme = joi.object({
    firstName: joi.string().min(1).required(),
    lastName: joi.string().min(1).required(),
    city: joi.string().min(2),
    age: joi.number().min(0).max(150).required()
})

const app = express();

app.use(express.json());


// список пользователей
app.get('/users', (req, res) => {
    const users = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.send({users});
});


//пользователь по id
app.get('/users/:id', (req, res) => {
    const users = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const user = users.find(user => user.id === Number(req.params.id));
    if (user) {
        res.send({user});
    } else {
        res.send({error: 'User not found'});
    }
});

//изменение пользователя
app.put('/users/:id', (req, res) => {
    const result = scheme.validate(req.body);
    if (result.error) {
        return res.send({error: result.error.details});
    }

    const users = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const user = users.find(user => user.id === Number(req.params.id));
    if (user) {
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.city = req.body.city;
        user.age = req.body.age;
        fs.writeFileSync(filePath, JSON.stringify(users));
        res.send({user});
    } else {
        res.send({error: 'User not found'});
    }
});

// добавление пользователя
app.post('/users', (req, res) => {
    const result = scheme.validate(req.body);
    if (result.error) {
        return res.send({error: result.error.details});
    }

    const users = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const user = {
        id: ++customId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        city: req.body.city,
        age: req.body.age
    };
    users.push(user);
    fs.writeFileSync(filePath, JSON.stringify(users));
    res.send({user});

});

//удаление пользователя
app.delete('/users/:id', (req, res) => {
    const users = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const userIndex = users.findIndex(user => user.id === Number(req.params.id));
    if (userIndex >=0) {
        users.splice(userIndex, 1);
        fs.writeFileSync(filePath, JSON.stringify(users));
        res.send({status : 'OK'});
    } else {
        res.send({error: 'User not found'});
    }
});

app.listen(8080, () => console.log("Started"));