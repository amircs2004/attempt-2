const supabase = require('../config/supabaseClient')
 
const verifySupabaseToken = async (req , res , next) => {
    try {
        
        const authorizationHeader = req.headers.authorization
        if(!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }
        const token = authorizationHeader.split(' ')[1]
        const {
            data : { user } , 
            error 
        }  = await supabase.auth.getUser(token) 
        if (error || !user) {
          return res.status(401).json({ error: "Unauthorized: Invalid or expired token." });
        }
        req.authUser = user 
        next()
    }catch(error) {
     return res.status(500).json({ error: err.message });
    }
}
module.exports = verifySupabaseToken;