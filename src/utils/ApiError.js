// why are we making this files?
// as api errors may come in the future so if the errors comes then it may come in this way 

class ApiError extends Error {
constructor (
    statusCode,
    message="something went wrong",
    errors=[],
    stack=""
){
    super(message);
    this.statusCode = statusCode;
    this.data=null
    this.message=message
    this.success=false
    this.errors=errors
  
    if(stack){
        this.stack=stack

    }
    else{
        Error.captureStackTrace(this,this.constructor);
    }
}
}
export {ApiError}