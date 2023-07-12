
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg : err.message || 'Something went wrong'
  }


  // Handling duplicate values 
  // These Errors are thrown by mongoose when same email is entered more than once
 if(err.code && err.code === 11000){
        customError.msg = `Duplicate values entered for ${Object.keys(err.keyValue)}`
        customError.statusCode = 400;    //Bad request
      
 }


 // Validation Error (Any required parameter is not given)
 // This can be handled in the controller itself 
 if(err.name === 'ValidationError'){
  console.log(err.errors);
  customError.msg = Object.values(err.errors).map((item)=>item.message).join(',')
  customError.statusCode = 400;
 }

 // cast Error where id syntax of mongoose is not matched with given id
 if(err.name === 'CastError'){
  customError.msg = `No item is found with ${err.value}`;
  customError.statusCode = 400;
 }


  return res.status(customError.statusCode).json({msg : customError.msg})
 
}

module.exports = errorHandlerMiddleware
