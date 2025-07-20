const { Router } = require("express");
const user1Router = Router();

const {connection,database} = require("../database/sql.database.js");
const { getData } = require("../Functions/fetchdata.js");


user1Router.post("/login",async (req,res)=>{
    let Empid = req.body.username;
    let password = req.body.password;
    req.session.username = Empid;
    console.log(req.session.username);

    await connection.execute("Select * From EMPLOYEE where EMPID = ?",[Empid], async (error,results,field)=>{
        if(error)
        {
            console.log(error);
        }
        if(results[0] != null)
        {
            if(Empid == results[0].EMPID)
            {
                await connection.execute('Select PASSWORD From EMPLOYEE where EMPID = ?',[Empid],async (err,result,field)=>{
                    if(err)
                    {
                        console.log(err);
                    }
                    if(password == result[0].PASSWORD)
                    {
                        console.log("******************************");
                        console.log("User Verified");
                        console.log("******************************");
                        req.flash("success","User registered Successfully");
                        res.redirect("/users/dashboard",);
                        //console.log(req.session.username);
                    }
                    else
                    {
                        req.flash("passwordNotMatch","Password not match");
                        res.redirect("/");
                    }
                })
            }
        }
        else
        {
            req.flash("failure","User not found");
            res.redirect("/");
        }   
    });
    
});

// User Dashboard  --
user1Router.get("/dashboard", async (req,res)=>{
    let value = req.session.username;
    await connection.execute("Select * From EMPLOYEE E, FACULTY F, DEPT D where E.FID = F.FID AND E.DEPTID = D.DEPTID AND EMPID = ?",[value], async (error,result1,field)=>{
        if(error)
        {
            console.log(error);
        }
        else
        {
            res.locals.messages = req.flash("success");
            let Faculty = result1[0];
            res.render("user/dashboard.ejs",{Faculty});
        }
    })
})

//View Profile --
user1Router.get("/viewprofile",async (req,res)=>{
    let value = req.session.username;
    await connection.execute("Select * From EMPLOYEE E, FACULTY F, DEPT D where E.FID = F.FID AND E.DEPTID = D.DEPTID AND EMPID = ?",[value],async (err,result100all,field)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            let Faculty = result100all[0];
            //console.log(Faculty);
            res.render("userprofile/viewprofile.ejs",{Faculty});
        }
    })
});

//Change Password --
user1Router.get("/changepassword", async (req,res)=>{
    let value = req.session.username;
    // let password = req.body.password;
    // let newpassword = req.body.newpassword;
    // let confirmNewpassword = req.body.confirmNewpassword;
    await connection.execute("Select * From EMPLOYEE E, FACULTY F, DEPT D where E.FID = F.FID AND E.DEPTID = D.DEPTID AND EMPID = ?",[value],async (err,result100all,field)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            let Faculty = result100all[0];
            res.locals.passwordUpdate = req.flash("passwordUpdate");
            res.locals.passwordDonotUpdate = req.flash("passwordDonotUpdate");
            res.render("userprofile/changepassword.ejs",{Faculty});
        }
    });
});

//Change password function
user1Router.post("/changepasswordfun", async (req,res)=>{
    let value = req.session.username;
    let password = req.body.password;
    let newpassword = req.body.newpassword;
    let confirmNewpassword = req.body.confirmNewpassword;
    await connection.execute("Select * from EMPLOYEE where EMPID = ?",[value],async (err,result100all,field)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            let Faculty = result100all[0];        
            //res.render("userprofile/changepassword.ejs",{Faculty});
            if( password == Faculty.PASSWORD)
            {
                await connection.execute("UPDATE EMPLOYEE SET PASSWORD=? WHERE EMPID=?;",[newpassword,value],(err,result,field)=>{
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        
                        req.flash("passwordUpdate","Password Updated Successfully");
                        res.redirect("/users/changepassword");
                    }
                })          
            }
            else
            {
                req.flash("passwordDonotUpdate","Password Donot Updated");
                res.redirect("/users/changepassword");
            }
        }
    });
});


//logout button --
user1Router.get("/logout",(req,res)=>{
    req.session.destroy((err)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(`User  is logout`);
            res.redirect("/");
        }
    })
});

//create notesheet
user1Router.get("/createnotesheet", async (req,res)=>{
    let value = req.session.username; 
    await connection.execute("Select * From EMPLOYEE E, FACULTY F, DEPT D where E.FID = F.FID AND E.DEPTID = D.DEPTID AND EMPID = ?",[value],async (err,result100all,field)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            let Faculty = result100all[0];
            res.locals.success = req.flash("success");
            res.render("user/createnotesheet.ejs",{Faculty});
        }
    });
});

//data of notesheet
user1Router.post("/data2",async (req,res)=>{
    let value = req.session.username; 
    await connection.execute("Select * from EMPLOYEE where EMPID = ?",[value],async (err,result100all,field)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            let Faculty = result100all[0];
            let subject = req.body.subject;
            let details = req.body.details;
            let fid = Faculty.FID;
            let deptid = Faculty.DEPTID;
            let empid = Faculty.EMPID;
            let designation= Faculty.DESIGNATION;
            let forward = req.body.forward;
            //console.log(forward);
            if(forward == "Normal")
            {
                if(designation=="HOD")
                    {
                        await connection.execute("INSERT INTO NOTESHEET(FID,DEPTID,EMPID,SUBJECT,DETAILS,STATUS,DATE,TIME) VALUES(?,?,?,?,?,?,CURDATE(),CURTIME());",
                            [fid,deptid,empid,subject,details,1],
                            async (err,result15,field)=>{
                            if(err)
                            {
                                await console.log(err);
                            }
                            else
                            {
                                req.flash("success","Notesheet Created");
                                res.redirect("/users/createnotesheet");
                            }
                        });
                    }
                    else if(designation=="DEAN")
                    {
                        await connection.execute("INSERT INTO NOTESHEET(FID,DEPTID,EMPID,SUBJECT,DETAILS,STATUS,DATE,TIME) VALUES(?,?,?,?,?,?,CURDATE(),CURTIME());",
                            [fid,deptid,empid,subject,details,2],
                            async (err,result16,field)=>{
                                if(err)
                                {
                                    await console.log(err);
                                }
                                else
                                {
                                    req.flash("success","Notesheet Created");
                                    res.redirect("/users/createnotesheet");
                                }
                        })
                    }
                    else
                    {
                        await connection.execute("INSERT INTO NOTESHEET(FID,DEPTID,EMPID,SUBJECT,DETAILS,STATUS,DATE,TIME) VALUES(?,?,?,?,?,?,CURDATE(),CURTIME());",
                            [fid,deptid,empid,subject,details,0],
                            async (err,result17,field)=>{
                                if(err)
                                {
                                    await console.log(err);
                                }
                                else
                                {
                                    req.flash("success","Notesheet Created");
                                    res.redirect("/users/createnotesheet");
                                }
                            }
                    )}
            }
            else if(forward == "DEAN")
            {
        
                await connection.execute("INSERT INTO NOTESHEET(FID,DEPTID,EMPID,SUBJECT,DETAILS,STATUS,DATE,TIME) VALUES(?,?,?,?,?,?,CURDATE(),CURTIME());",
                    [fid,deptid,empid,subject,details,1],
                    async (err,result15,field)=>{
                    if(err)
                    {
                        await console.log(err);
                    }
                    else
                    {
                        req.flash("success","Notesheet Created");
                        res.redirect("/users/createnotesheet");
                    }
                });
                    
            }
            else if(forward == "ProVC")
            {
                if(designation=="HOD")
                    {
                        await connection.execute("INSERT INTO NOTESHEET(FID,DEPTID,EMPID,SUBJECT,DETAILS,STATUS,DATE,TIME) VALUES(?,?,?,?,?,?,CURDATE(),CURTIME());",
                            [fid,deptid,empid,subject,details,2],
                            async (err,result15,field)=>{
                            if(err)
                            {
                                await console.log(err);
                            }
                            else
                            {
                                req.flash("success","Notesheet Created");
                                res.redirect("/users/createnotesheet");
                            }
                        });
                    }
                    else
                    {
                        await connection.execute("INSERT INTO NOTESHEET(FID,DEPTID,EMPID,SUBJECT,DETAILS,STATUS,DATE,TIME) VALUES(?,?,?,?,?,?,CURDATE(),CURTIME());",
                            [fid,deptid,empid,subject,details,2],
                            async (err,result17,field)=>{
                                if(err)
                                {
                                    await console.log(err);
                                }
                                else
                                {
                                    req.flash("success","Notesheet Created");
                                    res.redirect("/users/createnotesheet");
                                }
                            }
                    )}
            }
            else if(forward == "VC")
            {
                if(designation=="HOD")
                    {
                        await connection.execute("INSERT INTO NOTESHEET(FID,DEPTID,EMPID,SUBJECT,DETAILS,STATUS,DATE,TIME) VALUES(?,?,?,?,?,?,CURDATE(),CURTIME());",
                            [fid,deptid,empid,subject,details,3],
                            async (err,result15,field)=>{
                            if(err)
                            {
                                await console.log(err);
                            }
                            else
                            {
                                req.flash("success","Notesheet Created");
                                res.redirect("/users/createnotesheet");
                            }
                        });
                    }
                    else if(designation=="DEAN")
                    {
                        await connection.execute("INSERT INTO NOTESHEET(FID,DEPTID,EMPID,SUBJECT,DETAILS,STATUS,DATE,TIME) VALUES(?,?,?,?,?,?,CURDATE(),CURTIME());",
                            [fid,deptid,empid,subject,details,3],
                            async (err,result16,field)=>{
                                if(err)
                                {
                                    await console.log(err);
                                }
                                else
                                {
                                    req.flash("success","Notesheet Created");
                                    res.redirect("/users/createnotesheet");
                                }
                        })
                    }
                    else
                    {
                        await connection.execute("INSERT INTO NOTESHEET(FID,DEPTID,EMPID,SUBJECT,DETAILS,STATUS,DATE,TIME) VALUES(?,?,?,?,?,?,CURDATE(),CURTIME());",
                            [fid,deptid,empid,subject,details,3],
                            async (err,result17,field)=>{
                                if(err)
                                {
                                    await console.log(err);
                                }
                                else
                                {
                                    req.flash("success","Notesheet Created");
                                    res.redirect("/users/createnotesheet");
                                }
                            }
                    )}
            }
            else if(forward == "OSD")
            {
                if(designation=="HOD")
                    {
                        await connection.execute("INSERT INTO NOTESHEET(FID,DEPTID,EMPID,SUBJECT,DETAILS,STATUS,DATE,TIME) VALUES(?,?,?,?,?,?,CURDATE(),CURTIME());",
                            [fid,deptid,empid,subject,details,4],
                            async (err,result15,field)=>{
                            if(err)
                            {
                                await console.log(err);
                            }
                            else
                            {
                                req.flash("success","Notesheet Created");
                                res.redirect("/users/createnotesheet");
                            }
                        });
                    }
                    else if(designation=="DEAN")
                    {
                        await connection.execute("INSERT INTO NOTESHEET(FID,DEPTID,EMPID,SUBJECT,DETAILS,STATUS,DATE,TIME) VALUES(?,?,?,?,?,?,CURDATE(),CURTIME());",
                            [fid,deptid,empid,subject,details,4],
                            async (err,result16,field)=>{
                                if(err)
                                {
                                    await console.log(err);
                                }
                                else
                                {
                                    req.flash("success","Notesheet Created");
                                    res.redirect("/users/createnotesheet");
                                }
                        })
                    }
                    else
                    {
                        await connection.execute("INSERT INTO NOTESHEET(FID,DEPTID,EMPID,SUBJECT,DETAILS,STATUS,DATE,TIME) VALUES(?,?,?,?,?,?,CURDATE(),CURTIME());",
                            [fid,deptid,empid,subject,details,4],
                            async (err,result17,field)=>{
                                if(err)
                                {
                                    await console.log(err);
                                }
                                else
                                {
                                    req.flash("success","Notesheet Created");
                                    res.redirect("/users/createnotesheet");
                                }
                            }
                    )}
            }




            
                
            
        }
    })    
});

//View Notesheet---
user1Router.get("/viewns", async(req,res)=>{
    let value = req.session.username;
    await connection.execute("Select * From EMPLOYEE E, FACULTY F, DEPT D where E.FID = F.FID AND E.DEPTID = D.DEPTID AND EMPID = ?",[value], async (error,result1,field)=>{
        if(error)
        {
            console.log(error);
        }
        else
        {
            let Faculty = result1[0];
            await connection.execute("Select * from NOTESHEET where EMPID = ?", [value] ,async (err,resul,fie)=>{
                if(err)
                {
                    await console.log(err);
                }
                else{
                    let Notesheet = resul;
                    res.render("user/viewns.ejs",{Faculty,Notesheet,});

                }
            })
        }
    }) 
    
});


//Approve Notesheet -----
user1Router.get("/approvens", async (req,res)=>{
    let value = req.session.username;
    await connection.execute("Select * From EMPLOYEE E, FACULTY F, DEPT D where E.FID = F.FID AND E.DEPTID = D.DEPTID AND EMPID = ?",[value], async (error,result1,field)=>{
        if(error)
        {
            console.log(error);
        }
        else
        {
            let Faculty = result1[0];
            if(Faculty.DESIGNATION == 'HOD')
                {
                    await connection.execute("Select * from NOTESHEET where DEPTID = ? AND STATUS = 0",[Faculty.DEPTID], async (err,result4,field)=>{
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {   
                            let NoteApprovalbyHOD = result4;
                            //console.log(result4);
                            res.render("user/approvenotesheet.ejs",{Faculty,NoteApprovalbyHOD});    
                        }
                    })
                }
                if(Faculty.DESIGNATION == 'DEAN')
                {
                    await connection.execute("Select * from NOTESHEET where FID = ? AND STATUS = 1",[Faculty.FID], async (err1,result6,field)=>{
                        if(err1)
                        {
                            console.log(err1);
                        }
                        else
                        {
                            let NoteApprovalbyHOD = result6;
                            //console.log(result6);
                            res.render("user/approvenotesheet.ejs",{Faculty,NoteApprovalbyHOD});
                        }
                    })
                };
                if(Faculty.DESIGNATION == "Pro VC")
                {
                    await connection.execute("Select * from NOTESHEET where STATUS = 2",async (err3,result8,field)=>{
                        if(err3)
                        {
                            console.log(err3);
                        }
                        else
                        {
                            let NoteApprovalbyHOD = result8;
                            //console.log(result8);
                            res.render("user/approvenotesheet.ejs",{Faculty,NoteApprovalbyHOD});
                        }
                    })
                }
                if(Faculty.DESIGNATION == "VC")
                {
                    await connection.execute("Select * from NOTESHEET where STATUS = 3",async (err4,result9,field)=>{
                        if(err4)
                        {
                            console.log(err4);
                        }
                        else
                        {
                            let NoteApprovalbyHOD = result9;
                            //console.log(result9);
                            res.render("user/approvenotesheet.ejs",{Faculty,NoteApprovalbyHOD});
                        }
                    })
                };
                if(Faculty.DESIGNATION == "OSD")
                {
                    await connection.execute("Select * from NOTESHEET where STATUS = 4",async (err5,result10,field)=>{
                        if(err5)
                        {
                            console.log(err5);
                        }
                        else
                        {
                            let NoteApprovalbyHOD = result10;
                            //console.log(result10);
                            res.render("user/approvenotesheet.ejs",{Faculty,NoteApprovalbyHOD});
                        }
                    })
                }
        }
    })


    user1Router.get("/approvalbyHOD",async (req,res)=>{
        let statusfinal = req.query.statusfinal;
        let status1 = req.query.status;
        let array = status1.split(',');
        let status = array[0];
        let eid = array[1];
        let nid = array[2];
        let py = "hello";
        console.log(status1);
        console.log(status);
        console.log(eid);
        console.log(nid);
        console.log(statusfinal);
        await connection.execute("Insert Into NOTESTATUS (NOTEID,EMPID,COMMENT,STATUS,DATE,TIME) Values (?,?,?,?,CURDATE(),CURTIME())",
            [nid,eid,py,statusfinal], async(err,result20,field)=>{
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log(result20);
                    await connection.execute("UPDATE NOTESHEET SET STATUS = ? WHERE NOTEID = ? ;",
                        [statusfinal,nid],(err,result21,field)=>{
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            // console.log(result21);
                            res.redirect("/users/approvens");
                        }
                    });
                }
            }
        )
    });

});


//view notesheet by user ---
user1Router.get("/xyz",async (req,res)=>{
    let ans = req.query.noteid;
    let ans1 = req.query.empid;
    //await console.log(ans);
    //await console.log(ans1);
    await connection.execute("Select * from NOTESHEET where NOTEID = ?",[ans], async (err,result,field)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            await connection.execute("Select * From EMPLOYEE E, FACULTY F, DEPT D where E.FID = F.FID AND E.DEPTID = D.DEPTID AND EMPID = ?",[ans1], async (err,resu,fie)=>{
                if(err)
                {
                    console.log(err);
                }
                else{
                    // console.log(result);
                    // console.log(resu);
                    let Notesheet = result;
                    let Creator = resu;
                    res.render("user/viewnotesheet.ejs",{Notesheet,Creator});
                    
                }

            })
        }
    })
})


//History of Notesheets showed to a person who approved Notesheet
user1Router.get("/approvedns", async(req,res)=>{
    let value = req.session.username;
    await connection.execute("Select * From EMPLOYEE E, FACULTY F, DEPT D where E.FID = F.FID AND E.DEPTID = D.DEPTID AND EMPID = ?",[value], async (error,result1,field)=>{
        if(error)
        {
            console.log(error);
        }
        else
        {
            let Faculty = result1[0];
            await connection.execute("Select * from NOTESTATUS where EMPID = ?", [value] ,async (err,result99,fie)=>{
                if(err)
                {
                    await console.log(err);
                }
                else
                {
                    let Notestatus = result99;
                    console.log(Notestatus);
                    res.render("user/history.ejs",{Faculty,Notestatus});

                }
            })
        }
    }) 
    
});

user1Router.get("/ppppp",async (req,res)=>{
    let noteid = req.query.noteid;
    console.log(noteid);
    await connection.execute("Select * from NOTESHEET where NOTEID = ?",[noteid], async (err,result,field)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            let Employid = result[0].EMPID;
            await connection.execute("Select * From EMPLOYEE E, FACULTY F, DEPT D where E.FID = F.FID AND E.DEPTID = D.DEPTID AND EMPID = ?",[Employid], async (err,resu,fie)=>{
                if(err)
                {
                    console.log(err);
                }
                else{
                    // console.log(result);
                    // console.log(resu);
                    let Notesheet = result;
                    let Creator = resu;
                    res.render("user/viewnotesheet.ejs",{Notesheet,Creator});
                    
                }

            })
        }
    })
            
})









module.exports = { user1Router };