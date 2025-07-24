import { ResponseError } from "../error/response-error.js"

const errorMiddleware = async(err, req, res, next) => {
  if(err instanceof ResponseError){
    return res.status(err.status).json({
      success : false,
      errors : {
        message : err.message
      }
    });
  } else {
    return res.status(500).json({
      errors : err.message
    })
  }
}

export default  errorMiddleware;