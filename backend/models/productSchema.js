

const mongoose = require('mongoose');



const Schema = mongoose.Schema;


const productSchema = new Schema({

 productName : {

       type:String,
       required:true
 },

 productCategory : {

    type:String,
    required:true
 },

 productImage : {

    type:String,
    required:true
 },

 productPrice:{

    type:String,
    required:true
 },

 productDescription:{

    type:String,
   
 },

       
})


module.exports = mongoose.model('Product' , productSchema);


