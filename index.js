// import express from 'express';
// import {  MongoClient } from 'mongodb';
// import dotenv from 'dotenv'
// import cors from "cors";
// import bcrypt from 'bcrypt'
// import loginReg


// dotenv.config();
// const app = express();
// const PORT = process.env.PORT;

// app.use(express.json());
// app.use(cors());
// app.use(express.urlencoded());

// // const router = express.Router();

// // const profile_details = [
// //     {
// //         "id":"1",
// //         "first_name":"Mohan",
// //         "last_name":"Perumal",
// //         "email":"mohaperu@gmail.com",
// //         "phone_no":"8220618298",
// //         "dob":"19/10/1998",
// //         "city":"Chennai",
// //         "state":"Tamilnadu",
// //         "pincode":"600081",
// //         "country":"India"
// //     }
// // ];


// async function createConnection() {
//     const MONGO_URL = process.env.MONGO_URL;
//     const client = new MongoClient(MONGO_URL);
//     await client.connect();
//     console.log("successfully connected");

//     // const insertdata = await client.db("socialMedia").collection("profile").insertMany(profile_details);
//     // console.log(insertdata);

//     return client;
// }

// app.get('/', (request, response) => {
//     response.send("hello all");

// })

// app.get('/socialMedia', async (request, response) => {

//     const client = await createConnection();
//     const user = await client.db("socialMedia").collection("profile").find({}).toArray();

//     response.send(user);
//     console.log(user);

// });

// app.get('/socialMedia/:id', async (request, response) => {

//     const { id } = request.params;
//     console.log(request.params);

//     const client = await createConnection();
//     const user = await client.db("socialMedia").collection("profile").findOne({ id: id });

//     response.send(user);
//     console.log(user);

// });

// app.post('/socialMedia', async (request, response) => {

//     const client = await createConnection();
//     const addUsers = request.body;
//     const result = await client.db("socialMedia").collection("profile").insertMany(addUsers);

//     response.send(result);
//     console.log(addUsers, result);

// });

// app.delete('/socialMedia/:id', async (request, response) => {

//     const { id } = request.params;
//     console.log(request.params);

//     const client = await createConnection();
//     const user = await client.db("socialMedia").collection("profile").deleteOne({ id: id });

//     response.send(user);
//     console.log(user);

// });

// app.patch('/socialMedia/:id', async (request, response) => {

//     const { id } = request.params;
//     console.log(request.params);

//     const newData = request.body;

//     const client = await createConnection();
//     const user = await client.db("socialMedia").collection("profile").updateOne({ id: id }, { $set: newData });

//     response.send(user);
//     console.log(user);

// });
// //////////////////////////////////////

// async function genPassword(password){
//     const salt = await bcrypt.genSalt(10);
//     return await bcrypt.hash(password,salt)

// }


// //signup
// app.post('/socialMedia/signup', async (request, response) => {

//     // const client = await createConnection();
//     const {username,password} = request.body;
//     console.log({username,password});

//     // const result = await client.db("socialMedia").collection("profile").insertMany(addUsers);

//     const hashedPassword = await genPassword(password);

//     response.send({username,password,hashedPassword});
//     console.log(hashedPassword);

// });

// ////////////////////////////////////////////////////////////////////





// app.listen(PORT, () => console.log("The Server is starts in ", PORT));




import express, { request, urlencoded } from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv'
import cors from "cors";
import bcrypt from 'bcrypt'
import mongoose from "mongoose"
const app = express();



dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded());

const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("Db connected")
});

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    city: String,
    state: String,
    pincode: String,
    country: String

})

const User = new mongoose.model("User", userSchema)

//Route
app.get('/', (request, response) => {
    response.send("hello all")
})

app.post('/login', (request, response) => {
    const {
        email,
        password
    } = request.body;
    User.find({ email: email }, (err, user) => {
        if (user) {
            if (password === user.password) {
                response.send({ message: "Login Successfull", user: user })
            }
            else {
                response.send({ message: "Password didn't matched" })
            }
        } else {
            response.send({ message: "User is not registered" })
        }
    })
})



app.post('/register', (request, response) => {

    const { first_name,
        last_name,
        email,
        password,
        city,
        state,
        pincode,
        country } = request.body;

    User.findOne({ email: email }, (err, user) => {
        if (user) {
            response.send({ message: "User already registered" })
        } else {
            const user = new User({
                first_name,
                last_name,
                email,
                password,
                city,
                state,
                pincode,
                country
            })
            user.save(err => {
                if (err) {
                    response.send(err)
                } else {
                    response.send({ message: "Successfully Registered" })
                }
            })
        }
    })
})

app.get('/profile', function(req, res, next) {
    res.send(users);
  });

app.listen(PORT, () => console.log("The Server is starts in ", PORT));
