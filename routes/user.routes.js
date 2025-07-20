const {Router} = require("express");
const userRouter = Router();

const {connection,database} = require("../database/sql.database.js")

// userRouter.get("/",(req,res) =>{
//     // res.send(" LOG IN PAGE.....")
//     res.render("user/home");
// });

userRouter.post("/data",async (reqm,res)=>{
    console.log(reqm.body);
    //res.send('<script>alert("Form Submitted")</script>');
    let Empid = reqm.body.username;
    let password = reqm.body.password;
    // console.log(name);
    // console.log(password);
    
    await connection.execute("Select * From EMPLOYEE where EMPID = ?",[Empid], async (error,results,field)=>{
        if(error)
        {
            console.log(error);
        }
        // else
        // {
                //console.log(results);
        //     console.log(result[0].Deptid);
        // }
        if(results[0] != null)
        {
            
            if(Empid != results[0].EMPID)
            {
             res.redirect("/");
            }
            //if()
            if(Empid == results[0].EMPID)
            {
            await connection.execute('Select PASSWORD From EMPLOYEE where EMPID = ?',[Empid],async (err,result,field)=>{
                if(err)
                {
                    console.log(err);
                }
                if(password == result[0].PASSWORD)
                    {
                        //let Faculty = results;
                        console.log("******************************");
                        console.log(Empid);
                        console.log(password);
                        console.log("******************************");
                        console.log("User Verified");

                        // await connection.execute("Select * from EMPLOYEE where EMPID = ?",[Empid],async (err,result100all,field)=>{
                        //     if(err)
                        //     {
                        //         console.log(err);
                        //     }
                        //     else
                        //     {
                        //         let Faculty = result100all[0];
                        //         console.log(result100);

                        //     }
                        // });


                        res.render("user/dashboard.ejs");
                        console.log(reqm.session);
                        //res.redirect("/dashboard");

                        //view profile --
                        userRouter.get("/viewprofile", async (req,res)=>{
                            await connection.execute("Select * from EMPLOYEE where EMPID = ?",[reqm.body.username],async (err,result100all,field)=>{
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    let Faculty = result100all[0];
                                    console.log(reqm.body.username);
                                    res.render("profile/viewprofile.ejs",{Faculty,User});
                                }
                            });
                        });
                        
                        //change password --
                        userRouter.get("/changepassword",async(req,res)=>{
                            await connection.execute("Select * from EMPLOYEE where EMPID = ?",[reqm.body.username],async (err,result100all,field)=>{
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    let Faculty = result100all[0];
                                    
                                    res.render("profile/changepassword.ejs",{Faculty,User});
                                }
                            });
                            
                        });

                        //logout button --
                        userRouter.get("/logout",(req,res)=>{
                            // req.session.destroy(err)
                            res.render("profile/logout.ejs",{Faculty,User});
                        });

                        //create notesheet
                        userRouter.get("/createnotesheet", async (req,res)=>{
                            await connection.execute("Select * from EMPLOYEE where EMPID = ?",[Empid],async (err,result100all,field)=>{
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    let Faculty = result100all[0];
                                    
                                    res.render("users/createnotesheet.ejs",{Faculty,User});
                                }
                            });
                            res.render("users/createnotesheet.ejs",{Faculty,User});
                        });

                        //data of notesheet
                        userRouter.post("/data2",async (req,res)=>{
                            //console.log(req.body);
                            let subject = req.body.subject;
                            let details = req.body.details;
                            let fid = Faculty.FID;
                            let deptid = Faculty.DEPTID;
                            let empid = Faculty.EMPID;
                            let designation= Faculty.DESIGNATION;
                            // await console.log(subject);
                            // await console.log(details);
                            // await console.log(fid);
                            // await console.log(deptid);
                            // await console.log(empid);
                            // await console.log(designation);
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
                                            //await console.log(result15);
                                            // console.log("hod notesheet");
                                            // console.log(Faculty);
                                            res.redirect("/dashboard");
                                        }
                                    }
                                )
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
                                            //await console.log(result16);
                                            // console.log("dean notesheet");
                                            // console.log(Faculty);
                                            res.redirect("/dashboard");
                                        }
                                    }
                                )
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
                                            //await console.log(result17);
                                            // console.log("normal notesheet");
                                            // console.log(Faculty);
                                            res.redirect("/dashboard");
                                        }
                                    }
                                )
                            }
                        });


                        userRouter.get("/viewns", async(req,res)=>{
                            await connection.execute("Select * from NOTESHEET where EMPID = ?", [Empid] ,async (err,resul,fie)=>{
                                if(err)
                                {
                                    await console.log(err);
                                }
                                else{
                                    let Notesheet = resul;
                                    //await console.log(resul);
                                    res.render("users/viewns.ejs",{Faculty,User,Notesheet,});
                                    // console.log("view notesheet");
                                    //         console.log(Faculty);
                                }
                            })
                        
                        });
                        userRouter.get("/approvens", async (req,res)=>{
                            if(Faculty.DESIGNATION == 'HOD')
                            {
                                await connection.execute("Select * from NOTESHEET where DEPTID = ? ",[Faculty.DEPTID], async (err,result4,field)=>{
                                    if(err)
                                    {
                                        console.log(err);
                                    }
                                    else
                                    {
                                        await connection.execute("Select * from NOTESHEET where STATUS = 0",(err2,result5,field)=>{
                                            if(err2)
                                            {
                                                console.log(err2);
                                            }
                                            else
                                            {
                                                let NoteApprovalbyHOD = result5;
                                                console.log(result5);
                                                res.render("users/approvenotesheet.ejs",{Faculty,NoteApprovalbyHOD,User});
                                            }
                                        })
                                    }
                                })
                            }
                            if(Faculty.DESIGNATION == 'DEAN')
                            {
                                await connection.execute("Select * from NOTESHEET where FID = ?",[Faculty.FID], async (err1,result6,field)=>{
                                    if(err1)
                                    {
                                        console.log(err1);
                                    }
                                    else
                                    {
                                        await connection.execute("Select * from NOTESHEET where STATUS = 1",(err2,result7,field)=>{
                                            if(err2)
                                            {
                                                console.log(err2);
                                            }
                                            else
                                            {
                                                let NoteApprovalbyHOD = result7;
                                                console.log(result7);
                                                res.render("users/approvenotesheet.ejs",{Faculty,NoteApprovalbyHOD,User});
                                            }
                                        })
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
                                        console.log(result8);
                                        res.render("users/approvenotesheet.ejs",{Faculty,NoteApprovalbyHOD,User});
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
                                        console.log(result9);
                                        res.render("users/approvenotesheet.ejs",{Faculty,NoteApprovalbyHOD,User});
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
                                        console.log(result10);
                                        res.render("users/approvenotesheet.ejs",{Faculty,NoteApprovalbyHOD,User});
                                    }
                                })
                            }




                            userRouter.get("/approvalbyHOD",async (req,res)=>{
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
                                await connection.execute("Insert Into NOTESTATUS (NOTEID,EMPID,COMMENT,STATUS,DATE,TIME) Values (?,?,?,?,CURDATE(),CURTIME())",
                                    [nid,eid,py,status], async(err,result20,field)=>{
                                        if(err)
                                        {
                                            console.log(err);
                                        }
                                        else
                                        {
                                            console.log(result20);
                                            await connection.execute("UPDATE NOTESHEET SET STATUS = ? WHERE NOTEID = ? ;",
                                                [status,nid],(err,result21,field)=>{
                                                if(err)
                                                {
                                                    console.log(err);
                                                }
                                                else
                                                {
                                                    console.log(result21);
                                                    res.redirect("/approvens");
                                                }
                                            });
                                        }
                                    }
                                )
                            });

                        });
                        
                        userRouter.get("/dashboard", async (req,res)=>{
                            await connection.execute("Select * from EMPLOYEE where EMPID = ?",[reqm.body.username],async (err,result100all,field)=>{
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    let Faculty = result100all[0];
                                    console.log(reqm.body.username);
                                    res.render("user/dashboard.ejs",{Faculty,User});
                                }
                            });
                                
                        });
                        
                    }
                    else{
                        res.send("Password is incorrect");
                    }
                }); 
            }
       }else{
            res.send("Username not found");
       }

    });
});

module.exports = {userRouter}