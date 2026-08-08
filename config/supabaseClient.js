const { createClient } = require('@supabase/supabase-js')
const webSocket = require('ws')

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; 


const  superbase =  createClient(supabaseUrl, supabaseAnonKey , {
    auth : {
        persisSession :false , 
    } , 
    realtime : {
        transport : webSocket
    }
}) 

module.exports = superbase;