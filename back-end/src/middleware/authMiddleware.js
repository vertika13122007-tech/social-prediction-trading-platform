const jwt = require("jsonwebtoken");

const authMiddleware = (req,resp,next) => {
    try{
        const authHeader = req.headers.authorization;

        if( !authHeader ){
            return resp.status(401).json({
                message:"Access denied, no token was provided"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify( token, process.env.JWT_SECRET);

        req.user = decoded;
        next();

    }catch(error){
        return resp.status(401).json({
            message:"Invalid token"
        });
    }
};

module.exports = authMiddleware;