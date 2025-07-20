const {connection,database} = require("../database/sql.database.js");

let getData =  async function (value){
    await connection.execute("Select * From EMPLOYEE where EMPID = ?",[value], (error,result1,field)=>{
        if(error)
        {
            console.log(error);
        }
        else
        {
            return result1;
        }
    })
}

module.exports = { getData };
