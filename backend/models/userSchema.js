const mongoose = require("mongoose");


const Schema = mongoose.Schema;


const cartItemSchema = new Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, default: 1 },
});

const userSchema = new Schema({

     firstName: {
      type:String , required : true,
    },
     lastName: {
      type:String , required : true,
    },
     email:{
         type:String,
         required : true,
         unique:true
         
     },
     password :  {
      type:String ,
       required : true,
      
      },
     

   confirmPassword: {
    type:String ,
     required : true,
  },

image:{
  type:String ,
   required : true,
},
cart: [cartItemSchema],

})


module.exports = mongoose.model('User' , userSchema);