const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const  jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema(
    {
        name :{
            type : String,
            required : [true, 'please provide name'],
            minLength : 3,
            maxLength : 50
        },
        email :{
            type : String,
            required : [true, 'please provide email'],
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please provide a valid email',
              ], 
           unique : true,

        },
        password :{
            type : String,
            required : [true, 'please provide a password'],
            minLength : 6,
           
        },
    }
)
userSchema.methods.createJWT = function(){
    return jwt.sign({userId : this._id, name : this.name}, 'jwtsecret', {expiresIn : '30d'})
}
userSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch;
}
userSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

module.exports = mongoose.model('User', userSchema)