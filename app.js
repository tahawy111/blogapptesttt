const express=require("express")
const connectToDb=require("./config/connectToDb");
const path=require("path")
const xss=require("xss-clean")
const rateLimiting=require("express-rate-limit")
const hpp=require("hpp")
const { errorHandler, notFond } = require("./middlewares/error");
const cors = require("cors")
const helmet=require("helmet")
require("dotenv").config();


// connection to db
connectToDb()

const app=express()
 
// Middlewares
app.use(express.json());

// security headers (helmet)
app.use(helmet())

// prevent http param polltion
app.use(hpp())

// prevent xss attacks
app.use(xss())

// rate limiting
app.use(rateLimiting({
  windowMs:10 * 60 * 1000,//10 mins
   max:200,
}))

// helmet
app.use(helmet())

// cors policy
app.use(cors())  


// routes
app.use("/api/auth" , require("./routes/authRoute"));
app.use("/api/users" , require("./routes/usersRoute"));
app.use("/api/posts" , require("./routes/postsRoute"));
app.use("/api/comments" , require("./routes/commentsRoute"));
app.use("/api/categories" , require("./routes/categoriesRoute"));
app.use("/api/password" , require("./routes/passwordRoute"))



// Error Handler Middleware
app.use(notFond)
app.use(errorHandler)

// Running the server
const PORT=process.env.PORT;

app.listen(PORT , ()=>{
  console.log(`Server is running in ${process.env.NODE_ENV} on port ${PORT} `);
})
