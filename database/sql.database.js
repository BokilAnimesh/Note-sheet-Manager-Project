const mysql = require("mysql2");

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'Animesh@5424',
    database : 'MEDICAPS'
});

const DB = async function (){
    await connection.connect()
}

const database = async function(){
    await DB()
    .then(()=>{
        console.log("Database in database folder");
    })
    .catch((err)=>{
        console.log("Error occured in database in database folder",err);
    })
}


module.exports = {connection,database}


