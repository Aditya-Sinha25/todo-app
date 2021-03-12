const mongoose =require('mongoose');
mongoose.connect('mongodb://localhost/todo_development');

const db=mongoose.connection;
db.on('error',console.error.bind(console,"Error connecting to Mongodb"));

db.once('open',function(){
    console.log('Connected ti Database:: Mongodb');
})

module.exports =db;
