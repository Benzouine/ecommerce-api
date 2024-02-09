const mongoose = require("mongoose");


const dbConnection = () => {
  const uri =process.env.DB_CONNECTION.replace(
    '<PASSWORD>',
    process.env.DB_PASSWORD
  );;
  if (!uri) {
    console.error(
      "Error: Missing database connection URI. Please set the DB_CONNECTION environment variable."
    );
    process.exit(1);
  }

  mongoose
    .connect(uri)
    .then((conn) => {
      console.log( `Database is connected on port:${conn.connection.port}`);
    })
   
};

module.exports = dbConnection;
