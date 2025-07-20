const {connection,database} = require("../database/sql.database.js");

 let getAdminData = (value)=>{
     connection.execute("Select * From ADMIN where ADMINID = ?",[value], async (error,result1,field)=>{
        if(error)
        {
             console.log(error);
        }
        else
        {
            return  result1;
        }
    })
};

module.exports = { getAdminData };