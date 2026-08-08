const restrictTo = (...roles) => {
  return (req, res, next) => {
     // 1. Ensure req.user exists (meaning 'protect' ran first) protect middleware first passed in the router and the the restircted to middleware is called after the protect middleware
    if (!req.user || !req.user.roles) {
      return res.status(401).json({
        success: false,
        msg: "Not authorized, please log in again",
      });
    }
    // 2. Check if the user's role is included in the allowed roles array 

    if(!roles.includes(req.user.role)){
     return res.status(403).json({ 
        success: false, 
        msg: "Access denied: You do not have permission to perform this action" 
      });
    }

    next()
  };
};
module.exports = restrictTo;
