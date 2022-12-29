const jwt=require('jsonwebtoken');

const authMiddleware=(req,res,next)=>{
    const token=req.body.token||req.headers.token
     if(!token){
        return res.status(403).json("A token is required for Authentication")
    }try {
        const decoded=jwt.verify(token,process.env.ADMIN_TOKEN_SECRET)
         console.log(decoded);
        req.admin=decoded
        next()
        
    } catch (error) {
        return res.status(403).json("invalid token") 
        
    }
}
module.exports=authMiddleware;