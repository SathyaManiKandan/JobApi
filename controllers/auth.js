const User = require('../models/User')
const StatusCodes = require('http-status-codes')
const BadRequestError = require('../errors/bad-request')
const UnauthenticatedError   = require('../errors/unauthenticated')
const  jwt = require('jsonwebtoken')


const register = async(req, res)=>{
    const user  = await User.create({...req.body})
    const token = user.createJWT()
    // the passwords are hashed before saving in the database by using a mongoose middleware option
    res.status(StatusCodes.CREATED).send({ user :{name : user.name}, token})
};

const login = async(req, res)=>{
   const {email, password} = req.body;

   // Checking whether email and password is given
   if(!email || !password) {
    throw new BadRequestError("Please provide email and password")
   };
   const user = await User.findOne({email});

   // Checking whether the user exists
   if(!user){
    throw new UnauthenticatedError('Invali Credentials')
   }

   // check whether the password is correct
   const isPasswordCorrect =  user.comparePassword(password)
   if(!isPasswordCorrect){
    throw UnauthenticatedError('Invalid Credentials');
   }

   // creating token
   const token = user.createJWT();
   res.status(StatusCodes.OK).send({user : {name : user.name}, token})
};

module.exports = {register, login};
