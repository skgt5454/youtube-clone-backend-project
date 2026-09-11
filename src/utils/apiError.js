class ApiError extends Error
{
    constructor(statuscode,error=[],message="something went wrong",stack="")
    {
      super(message)//JavaScript ka built-in Error constructor mainly message leta hai:
      this.statuscode = statuscode;
      this.data = null;
      this.message = message
      this.error = error
      this.success = false;
      if(stack)
      {
        this.stack = stack;
      }
      else
      {
        Error.captureStackTrace(this,this.constructor)//Matlab ApiError constructor ki unnecessary entry ko stack trace se hata deta hai, taaki jab error dekho to focus actual jagah par ho jahan error create/throw hua
      }
    }
}
export{ApiError}

