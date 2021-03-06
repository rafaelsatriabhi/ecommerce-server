const request = require(`supertest`)
const app = require(`../app.js`)
const {User} = require(`../models/index`)
const bcrypt = require('bcryptjs')

const salt = bcrypt.genSaltSync(10);

//Input for register
const userData={
    name: "Rafael",
    email: "raf@gmail.com",
    isAdmin: true,
    password: bcrypt.hashSync("1234", salt)
}

//Input for logging in
const userLogin = {
    email:"raf@gmail.com",
    password:"1234"
}

describe("User Register && Login Test",()=>{
    afterAll((done)=>{
        return User.destroy({
            where:{},
            truncate:true
        })
        .then(data=>{
            done()
        })
        .catch(err=>{
            done(err)
        })
    })
    beforeAll((done)=>{
        User.create(userData)
        .then(_=>{
            done()
        })
        .catch(_=>{
            done(err)
        })
    })
    // describe("TEST REGISTER /register",()=>{
    //     describe('Register (SUCCESS)', ()=>{
    //         test("Should send object with keys: message, id, email", (done)=>{
    //             request(app)
    //             .post(`/register`)
    //             .send(userData)
    //             .end((err,res)=>{
    //                 if(err){throw err}
    //                 expect(res.status).toBe(201)
    //                 expect(res.body).toHaveProperty("message",`Hi ${userData.name}, your account is successfully registered`)
    //                 expect(res.body).toHaveProperty("id",expect.any(Number))
    //                 expect(res.body).toHaveProperty("email",userData.email)
    //                 expect(res.body).not.toHaveProperty("password")
    //                 done()
    //             })
    //         })
    //     })
    // })
    describe("TEST LOGIN /login",()=>{
        describe("LOGIN (SUCCESS Case)",()=>{
            test("Should send object with keys message and token",(done)=>{
                request(app)
                .post(`/login`)
                .send(userLogin)
                .end((err,res)=>{
                    if(err){throw err}
                    expect(res.status).toBe(201)
                    expect(res.body).toHaveProperty("message","Login Success")
                    expect(res.body).toHaveProperty("token")
                    done()
                })
            })
        })
        describe("LOGIN (ERROR Case)",()=>{
            test("Failed because of wrong password",(done)=>{
							let wrongUserPassword = {...userLogin,password:"this is wrong password"}
                request(app)
                .post('/login')
                .send(wrongUserPassword)
                .end((err,res)=>{
                    if(err){throw err}
                    expect(res.status).toBe(400)
                    expect(res.body).toHaveProperty("message","Invalid email/password")
                    done()
                })
            })
            test("Failed because of unregistered email account",(done)=>{
							let unregisteredEmail = {...userLogin,email:"unergisteredEmail@gmail.com"}
                request(app)
                .post(`/login`)
                .send(unregisteredEmail)
                .end((err,res)=>{
                    if(err){throw err}
                    expect(res.status).toBe(400)
                    expect(res.body).toHaveProperty("message","Invalid email/password")
                    done()
                })
            })
            test("Failed because email is null",(done)=>{
							let emailIsNull = {...userLogin,email:null}
                request(app)
                .post(`/login`)
                .send(emailIsNull)
                .end((err,res)=>{
                    if(err){throw err}
                    expect(res.status).toBe(400)
                    expect(res.body).toHaveProperty("message","email can't be null")
                    done()
                })
            })
            let passwordIsNull = {...userLogin, password:null}
            test("Failed because password is null",(done)=>{
                request(app)
                .post("/login")
                .send(passwordIsNull)
                .end((err,res)=>{
                    if(err){throw err}
                    expect(res.status).toBe(400)
                    expect(res.body).toHaveProperty("message","password can't be null")
                    done()
                })
            })
        })
    })
})

