class apiresponse{
    constructor(statuscode,Data,message = "success")
    {
        this.statuscode = statuscode
        this.Data = Data
        this.message = message
        this.success = statuscode<400
    }
}
export {apiresponse}