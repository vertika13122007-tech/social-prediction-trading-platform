const adminMiddleware = (req,resp,next) =>{

    if( req.user.role !== "ADMIN"){
        return resp.status(403).json({
            message:"Access denied"
        });
    }

    next();
};

module.exports = adminMiddleware;