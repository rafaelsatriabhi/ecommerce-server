const request = require(`supertest`)
const app = require("../app")
const jwt = require(`jsonwebtoken`)
require('dotenv').config()

const {Product} = require(`../models`)

const productInput = {
    name:"Shampo Clean 250ml",
    price:15000,
    stock: 50
}

let userLogin = {
    name:"Rafael",
    email:"raf@gmail.com",
    isAdmin:true,
    password:"1234"
}

let isNotAdmin = {...userLogin,isAdmin:false}

let dummyAccessToken;

let dummyIsNotAdmin;

describe("POST Product /Product",()=>{ 
    afterAll((done)=>{
            return Product.destroy({
                where:{},
                truncate:true
            })
            .then(_=>{
                done()
            })
            .catch(err=>{
                done(err)
            })
    })
    beforeAll((done)=>{
         dummyAccessToken = jwt.sign({
             name:userLogin.name,
             email:userLogin.email,
             isAdmin:userLogin.isAdmin
            },process.env.JWT_SECRET_KEY)

         dummyIsNotAdmin = jwt.sign({
             name:isNotAdmin.name,
             email:isNotAdmin.email,
             isAdmin:isNotAdmin.isAdmin
            },process.env.JWT_SECRET_KEY)
        done()
    })
    describe("POST Product(SUCCESS)",()=>{
        test("Returning id, name and stok actual",(done)=>{
            request(app)
            .post("/product")
            .send(productInput)
            .set("access_token", dummyAccessToken)
            .end((err,res)=>{
                if(err){throw err}
                expect(res.status).toBe(201)
                expect(res.body).toHaveProperty("message","Success creating new product")
                expect(res.body).toHaveProperty("id",expect.any(Number))
                expect(res.body).toHaveProperty("name",productInput.name)
                expect(res.body).toHaveProperty("price",productInput.price)
                expect(res.body).toHaveProperty("stock",productInput.stock)
                done()
            })
        })
    })
    describe("POST Product(ERROR)",()=>{
        test("Error because access_token is undefined",(done)=>{
            request(app)
            .post("/product")
            .send(productInput)
            .end((err,res)=>{
                if(err){throw err}
                expect(res.status).toBe(401)
                expect(res.body).toHaveProperty("err","Failed to authenticate")
                done()
            })
        })
        test("Error because access_token is not verified",(done)=>{
            request(app)
            .post(`/product`)
            .set("access_token", dummyIsNotAdmin)
            .send(productInput)
            .end((err,res)=>{
                if(err){throw err}
                expect(res.status).toBe(401)
                expect(res.body).toHaveProperty("err","Unauthorized")
                done()
            })
        })
    })
})