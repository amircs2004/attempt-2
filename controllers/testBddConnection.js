const coonectedDatabase = require('../connection/connection')
const bddtestConn = async (req , res) => {
   try {
       const connected =await  coonectedDatabase ()
       if (!connected) {
           return res.status(501).json({msg : "failed to connect to database "})
       }
       return res.status(200).json({msg : "  connected to database "})
    
   } catch (error) {
       return res.status(500).json({msg : error.message})

   }
}

module.exports = bddtestConn
