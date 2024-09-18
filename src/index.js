import dotenv from "dotenv";
import connectDB from './db/index.js'; 
import { app } from './app.js'; // Assuming app is exported from './app.js'

// Load environment variables
dotenv.config({ path: './env' });

// Connect to the database and start the server
connectDB()
  .then(() => {
    // Start the server after the database connection is successful
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port: ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

 
// first approach 
// (async()=>{
// try{
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     app.on("error",()=>{
//         console.log("Error",error);
//         throw error
//     })
//     app.listen(process.env.PORT,()=>{
//         console.log(`app is listening on the port ${process.env.PORT}`);
//     })
// }
// catch(error){
//     console.error("ERROR:",error);
//     throw err
// }
// })()


