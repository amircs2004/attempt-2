const mongoose = require("mongoose");
let cashed = global.mongoose;

if (!cashed) {
  //assigned
  cashed = global.mongoose = {
    conn: null,
    promise: null,
  };
}
//this is the right way to connect to the database and stop the connection from hanging if the database is not connected !
const coonectedDatabase = async () => {
  if (cashed.conn) {
    return cashed.conn;
  }
  //this function will stop mongoo db from waiitng if !connection
  const stopConnectionHang = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000, // <--- EXTREMELY IMPORTANT: This stops the hang
    socketTimeoutMS: 10000,
  };

  if (!cashed.promise) {
    //asign connection
    cashed.promise = mongoose
      .connect(process.env.MONGO_URI, stopConnectionHang)
      .then((mongooInstance) => {
        return mongooInstance;
      })
      .catch((error) => {
        cashed.promise = null;
        throw error;
      });
  }

  //await and promise and STORE the connection

  cashed.conn = await cashed.promise;
  return cashed.conn;
};

module.exports = coonectedDatabase;
