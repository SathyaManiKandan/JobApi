const User = require('../models/User');
const jwt = require('jsonwebtoken');
const UnauthenticatedError = require('../errors/unauthenticated')

const auth = async (req, res, next)=>{
    const authHeader = req.headers.authorization;
    
    if(!authHeader || !authHeader.startsWith('Bearer')){
        
        throw new UnauthenticatedError('Authentication Error');
    }
    const token = authHeader.split(' ')[1];
    //console.log(token);
    try {
        const payload = jwt.verify(token, 'jwtsecret');
        req.user = {userId : payload.userId, name : payload.name}
        next();
    } catch (error) {
       /// console.log(error);
        throw new UnauthenticatedError('Aunthentication Invalid')
    }
}
module.exports = auth;