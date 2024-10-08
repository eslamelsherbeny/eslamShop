const mongose=require('mongoose');

const dbConnection= ()=>{mongose.connect(process.env.MONGO_URI).then((con)=>{
    console.log(`connected to ${con.connection.host}`);
})}


module.exports=dbConnection