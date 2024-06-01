const errorHandler = (res,error=new Error('Server internal error'),statusCode=500) => {
    res.writeHead(statusCode, { 'Content-Type': 'text/plain' })
    res.end(error.message)
}

module.exports = {errorHandler}