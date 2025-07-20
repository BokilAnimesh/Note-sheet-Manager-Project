//Admin powers--
//Admin Pannel--
//Get Admin Data Function
let getAdminData = async (value)=>{
    connection.execute("Select * From ADMIN where ADMINID = ?",[value],async (error,result1,field)=>{
       if(error)
       {
            console.log(error);
       }
       else
       {
           return result1;
       }
   })
};
const { Router } = require("express");
const adminRouter = Router();

const {connection,database } = require("../database/sql.database.js");
//const { getAdminData } =require("../Functions/getdataadmin.js")
//Admin login page rendered--
adminRouter.get("/adminlogin",(req,res)=>{
    res.render("admin/adminloginpage.ejs");
});

// Verification of Admin--
adminRouter.post("/verifyadmin", async (req,res)=>{
    let Empid = req.body.username;
    let password = req.body.password;
    req.session.username = Empid;
    console.log(req.session.username);
    await connection.execute("Select * From ADMIN where ADMINID = ?",[Empid], async (error,result1,field)=>{
        if(error)
        {
            console.log(error);
        }
        if(result1[0] != null)
        {
            console.log(result1);
            if(Empid != result1[0].ADMINID)
            {
             res.redirect("/adminlogin");
            }
            if(Empid == result1[0].ADMINID)
            {
                await connection.execute("Select PASSWORD From ADMIN where ADMINID = ?",[Empid], async (err,result2,field)=>{
                    if(err)
                    {
                        console.log(err);
                    }
                    if(password == result2[0].PASSWORD)
                    {
                        console.log(result2);
                        console.log("******************************");
                        console.log("Admin Verified");
                        console.log("******************************");
                        res.redirect("/admin/admindashboard");
                        
                    }
                    else
                    {
                        res.send("Admin's Password is incorrect");
                    }
                }); 
            }
        }
        else
        {
            res.send("Admin not found");
        }
    });
});


//view profile --
adminRouter.get("/viewprofile",(req,res)=>{
    let value = req.session.username;
    connection.execute("Select * From ADMIN where ADMINID = ?",[value], async (error,result1,field)=>{
        if(error)
        {
             console.log(error);
        }
        else
        {
            let Admin = result1[0];
            res.render("adminprofile/viewprofile.ejs",{Admin});
        }
    })
    
});

//change password --
adminRouter.get("/changepassword", async(req,res)=>{
    let value = req.session.username;
    await connection.execute("Select * From ADMIN where ADMINID = ?",[value], async (error,result1,field)=>{
        if(error)
        {
             console.log(error);
        }
        else
        {
            let Admin = result1[0];
            res.render("adminprofile/changepassword.ejs",{Admin});
        }
    })
   
});

//logout button --
adminRouter.get("/logout",(req,res)=>{
    req.session.destroy((err)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(`Admin  is logout`);
            res.redirect("/");
        }
    })
});

//Create user page rendered --
adminRouter.get("/create",async(req,res)=>{
    let value = req.session.username;
    await connection.execute("Select * From ADMIN where ADMINID = ?",[value],async (error,result1,field)=>{
        if(error)
        {
            console.log(error);
        }
        else
        {
            let Admin = result1[0];
            await connection.execute("SELECT * FROM FACULTY;", async(err,result3,field)=>{
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    let fac = result3;
                    await connection.execute("SELECT * FROM FACULTY F, DEPT D WHERE F.FID=D.FID;", async (err,result2,field)=>{
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            let facAndDept = result2;
                            console.log(facAndDept);
                            res.render("admin/create.ejs",{Admin,facAndDept,fac});
                        }
                    })
                }
            })

            
        }
    })       
});

//ADMIN DASHBOARD --
adminRouter.get("/admindashboard", async (req,res)=>{
    let value = req.session.username;
    await connection.execute("Select * From ADMIN where ADMINID = ?",[value], async (error,result1,field)=>{
        if(error)
        {
            console.log(error);
        }
        else
        {
            let Admin = result1[0];
            console.log(Admin);
            res.render("admin/admindashboard.ejs",{Admin});
            console.log(`In dashboard ...... ${req.session.username}`);
        }
    })
})

//User Creation by Admin
adminRouter.post("/createuser", async (req,res)=>{
    console.log(req.body);

    let Empid = req.body.id;
    let Fid = req.body.faculty;
    let Dep = req.body.department;
    let name = req.body.name;
    let password = req.body.password;
    let passwordConfirm = req.body.confirmpassword;
    let email = req.body.email;
    let mobno = req.body.mnum;
    let Desgn = req.body.designation;
                                        
    await connection.execute("Insert into EMPLOYEE values (?,?,?,?,?,?,?,?)",[
        Fid ,
        Dep , 
        Empid,
        name ,
        Desgn, 
        password ,
        email ,
        mobno
    ],async (err,result,fields)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect(200,"/admin/admindashboard");
        }
    })                              
});

// Admin Pannel ----- View All Notesheet

adminRouter.get("/viewallns",async (req,res)=>{
    let value = req.session.username;
    await connection.execute("Select * From ADMIN where ADMINID = ?",[value], async (error,result1,field)=>{
        if(error)
        {
            console.log(error);
        }
        else
        {
            let Admin = result1[0];
            await connection.execute("Select * from NOTESHEET",async (err,result,field)=>{
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    //await console.log(result);
                    let Note = result;
                    await res.render("admin/viewallns.ejs",{Admin,Note});
                }
            })
        }
    })
    
});

//View Single Notesheet -- 
// adminRouter.get("/abc", async (req,res)=>{
//     let noteid = req.query.noteid;
//     await connection.execute("Select * from NOTESHEET where NOTEID = ?",[noteid],async (err1,result1,field)=>{
//         if(err)
//         {
//             console.log(err1);
//         }
//         else
//         {
//             //console.log(result1);
//             let empid = result1[0].EMPID;
//             await connection.execute("Select * from EMPLOYEE where EMPID = ?",[empid], async (err2,result2,field)=>{
//                 if(err)
//                 {
//                     console.log(err2);
//                 }
//                 else
//                 {
//                     let value = req.session.username;
//                     await connection.execute("Select * From ADMIN where ADMINID = ?",[value], async (error,result1,field)=>{
//                         if(error)
//                         {
//                             console.log(error);
//                         }
//                         else
//                         {
//                             let Admin = result1[0];
//                             let Notesheet = result1;
//                             let Faculty = result2; 
//                             res.render("/admin/viewnotesheet.ejs",{Faculty,Notesheet,Admin}); 
                            
//                         }
//     })
                                                               
//                 }
//             })
//         }
//     })
// });

//Download Notesheet And View Single Notesheet--
adminRouter.get("/download", async (req,res)=>{
    let noteid = req.query.noteid;
    await connection.execute("Select * from NOTESHEET where NOTEID = ?",[noteid],async (err1,result1,field)=>{
        if(err1)
        {
            console.log(err1);
        }
        else
        {
            //console.log(result1);
            let empid = result1[0].EMPID;
            await connection.execute("Select * from EMPLOYEE where EMPID = ?",[empid],(err2,result2,field)=>{
                if(err2)
                {
                    console.log(err2);
                }
                else
                {
                    let Notesheet = result1;
                    let Faculty = result2; 
                    res.render("admin/downloadnotesheet.ejs",{Faculty,Notesheet});                                            
                }
            })
        }
    })


});

//Edit notesheets --
// adminRouter.get("/editallns",async(req,res)=>{
//     await connection.execute("Select * from NOTESHEET",async (err,resu,field)=>{
//         if(err)
//         {
//             console.log(err);
//         }
//         else
//         {

//             //await console.log(resu);
//             let Note = resu;
//             await res.render("editallns.ejs",{Note,Admin});
//         }
//     })
// })

//gofaculty
adminRouter.get("/gofaculty", async (req,res)=>{
    let value = req.session.username;
    await connection.execute("Select * From ADMIN where ADMINID = ?",[value], async (error,result1,field)=>{
        if(error)
        {
            console.log(error);
        }
        else
        {
            let Admin = result1[0];
            res.render("admin/createfaculty.ejs",{Admin});
        }
    })
    
});

//createfaculty
adminRouter.post("/createfaculty", async (req,res)=>{
    let fid = req.body.fid;
    let fname = req.body.fname;

    await connection.execute("Insert into FACULTY VALUES (?,?)", [fid,fname] , async (err,result,field)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            await console.log(result);
            await res.status(200).redirect("/admin/gofaculty");
        }
    })
});

//go department --
adminRouter.get("/godept", async (req,res)=>{
    let value = req.session.username;
    await connection.execute("Select * From ADMIN where ADMINID = ?",[value], async (error,result1,field)=>{
        if(error)
        {
            console.log(error);
        }
        else
        {
            let Admin = result1[0];
            res.render("admin/createdept.ejs",{Admin});
        }
    })
});
   

// create dept
adminRouter.post("/createdept", async (req,res)=>{
    let fid = req.body.fid;
    let deptid = req.body.deptid;
    let deptname = req.body.deptname;
    await connection.execute("Insert into DEPT VALUES (?,?,?)", [fid,deptid,deptname] , async (err,result,field)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            await console.log(result);
            await res.status(200).redirect("/admin/godept");
        }
    })
})

//view faculty
adminRouter.get("/viewfaculty", async (req,res)=>{
await connection.execute("Select * from FACULTY" , async (err,result,field)=>{
if(err)
{
    console.log(err);
}
else
{    
    let Faculty = result;
    let value = req.session.username;
    await connection.execute("Select * From ADMIN where ADMINID = ?",[value], async (error,result1,field)=>{
        if(error)
        {
            console.log(error);
        }
        else
        {
            let value = req.session.username;
            await connection.execute("Select * From ADMIN where ADMINID = ?",[value], async (error,result1,field)=>{
            if(error)
            {
                console.log(error);
            }
            else
            {
                let Admin = result1[0];
                await res.status(200).render("admin/viewfaculty.ejs",{Faculty,Admin});
            }
            })
            
        }
    })    
}
})
});

//VIEW DEPT
adminRouter.get("/viewdept", async (req,res)=>{
await connection.execute("Select * from DEPT" , async (err,result,field)=>{
if(err)
{
    console.log(err);
}
else
{
    let Department = result;
    let value = req.session.username;
    await connection.execute("Select * From ADMIN where ADMINID = ?",[value], async (error,result1,field)=>{
        if(error)
        {
            console.log(error);
        }
        else
        {
            let value = req.session.username;
            await connection.execute("Select * From ADMIN where ADMINID = ?",[value], async (error,result1,field)=>{
            if(error)
            {
                console.log(error);
            }
            else
            {
                let Admin = result1[0];
                await res.status(200).render("admin/viewdept.ejs",{Department,Admin});
            }
            })
           
        }
        })
    
}
})
});







module.exports = {adminRouter}