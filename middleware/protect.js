const jwt = require('jsonwebtoken')

const protect = async (req , res ,next) => {
   try {

const authHeader = req.headers.authorization 
    //mt cookie name is refresh 
   let  token = req.cookies.refreshToken 
   if (!token && authHeader && authHeader.startsWith('Bearer ')) {
     token = authHeader.split(' ')[1];
   }

    if (!token) {
        return res.status(401).json({ msg: "Not authorized, no token provided" });
    }
    const decoded = await jwt.verify(token , process.env.JWT_SECRET)
    req.user = decoded 
    next()
   } catch (error) {
    return res.status(401).json({ msg: "Not authorized, token failed" });
   }
}

module.exports = protect;