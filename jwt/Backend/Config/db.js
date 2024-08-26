const mongoose= require('mongoose')

const connectDb=async()=>
{
    try{
        await mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true, useUnifiedTopology:true})
        console.log("Connected to MongoDb")
    }
    catch(error)
    {
        console.log("Error in Connection to MongoDb", error)
        process.exit(1)
    }
}

module.exports=connectDb