// cjs modules
const express = require('express');
const {connectDB} = require('./config/database');
const User = require('./models/user')

const app = express();

// middle ware to convert JSON to javascript object
app.use(express.json())

app.post('/signup', async (req, res) => {
    console.log(req.body)

    const user = new User(req.body);
    try{
        await user.save();
        res.send('User added Successfully')
    }catch(err){
        res.status(404).send('Error saving the user:' + err.message);
    }
})

app.get('/user', async (req, res) => {
    const email = req.body.email;
    try{
        console.log(email);
        const user = await User.findOne({email: email});
        console.log(user);
        if(user.email){
            res.status(200).send(user);
        }else{
            res.status(404).send('User not found');
        }
    }catch(err){
        res.status(404).send('Error sending the email' + err.message);
    }
})

app.get('/feed', async (req, res) => {
    console.log('feed');
    try{
        const users = await User.find({});
        console.log(users);
        if(users.length > 0){
            res.status(200).send(users);
        }else{
            res.status(404).send('User not found');
        }
    }catch(err){
        res.status(404).send('Error sending the email' + err.message);
    }
})

connectDB().then(() => {
    console.log('Database connected Successfully');
    app.listen(7777, () => {
        console.log(`Server started successfully 7777...`)
    });
}).catch(() => {
    console.log('Database connection failed');
})
