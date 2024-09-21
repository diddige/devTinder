// cjs modules
const express = require('express');

const app = express();

app.listen(7777, () => {
    console.log(`Server started successfully 7777...`)
});

app.use('/test', (req,res)=>{
    res.send('Hi test');
})

app.use('/hello', (req,res)=>{
    res.send('Hello');
})