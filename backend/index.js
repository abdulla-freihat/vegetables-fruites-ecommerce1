const  express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');
const userSchema = require("./models/userSchema");
const productSchema = require("./models/productSchema");

const bcrypt = require('bcrypt');
const validator = require('validator');



const app = express();
app.use(cors());
app.use(express.json({limit : "10mb"}));



const PORT = process.env.PORT || 8000 ;



 

//mongodb connection

const db = process.env.MONGODB_URI;
mongoose.connect(db)
.then(()=>{

    console.log("connect to database");
     
}).catch((err) =>{

    console.log(err);

       
})

//routes
app.get("/" , (req , res)=>{

     res.send("server is running")
})



//signup route
app.post("/signup", async (req, res) => {
  try {
    const { email, password, confirmPassword, firstName, lastName, image } = req.body;

    if (!email || !password || !confirmPassword || !firstName , !lastName || !image) {
      throw Error('All fields must be filled');
    }

    if(!validator.isEmail(email)){

      throw Error('Email is not valid')
   }

 // Check if the password and confirmPassword match
 if (password !== confirmPassword) {
  throw Error('Password and Confirm Password do not match');
}


 // Password validation: at least 6 characters, 1 upper case, and 1 number
 if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password)) {
  throw Error('Password must be at least 6 characters with at least 1 uppercase letter and 1 number');
}

   
    // Check if the email already exists in the database
    const existingUser = await userSchema.findOne({ email });

    if (existingUser) {
      // Email is already registered
      return res.status(400).json({ success: false, message: "Email id is already registered", alert: false });
    }

    // Hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedConfirmPassword = await bcrypt.hash(confirmPassword, salt);


    // If the email is not found, proceed with user registration
    const newUser = await userSchema.create({
      email,
      password: hashedPassword,
      confirmPassword : hashedConfirmPassword,
      firstName,
      lastName,
      image,
  
    });



    const savedUser = await newUser.save();
    res.status(201).json({ success: true, message: "Registration is successful", alert: true });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

//login route

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw Error('All fields must be filled');
    }

    const existingUser = await userSchema.findOne({ email });

    if (!existingUser) {
      throw Error('Incorrect email or password');
    }

    const match = await bcrypt.compare(password, existingUser.password);

    if (!match) {
      throw Error('Incorrect email or password');
    }

    const dataSend = {
      _id: existingUser._id,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      email: existingUser.email,
      image: existingUser.image
      
    };


    

    return res.status(201).json({
      success: true,
      message: "Login is successful",
      alert: true,
      data: dataSend,
    
    });

  } catch (error) {
   
    res.status(400).json({ success: false, message: error.message });

    
  }
});



// create product 
app.post('/uploadProduct' ,async  (req , res)=>{

  try{


    const { productName ,  productCategory , productImage , productPrice , productDescription} = req.body;

   if ( !productName ||  !productCategory || !productImage || !productPrice , !productDescription ) {
    throw Error('All fields must be filled');
  }


  const existingProduct = await productSchema.findOne({ productName });


  if(existingProduct){
    // Product is already added
    return res.status(400).json({ success: false, message: "This product is already added", alert: false });

     
  }




  const newProduct = await productSchema.create({

        productName,
        productCategory,
        productImage,
        productPrice,
        productDescription
  })

  const saveProduct = await  newProduct.save();
  res.status(201).json({ success: true, message: "new product is added successfully", alert: true });

  } catch(error){
    res.status(400).json({ success: false, message: error.message });
  }

   

})



//delete Product 

app.delete('/delete-product/:id' ,async  (req , res)=>{


  const {id} = req.params;

  const product = await productSchema.findOneAndDelete({_id : id});
  
  
  
  
   res.status(200).json(product);
  
})


//get All products


app.get('/product' ,async (req , res) =>{

      const data = await productSchema.find({})
      res.send(data);
})


//get single product

app.get('/product/:id' , async(req , res)=>{


  const {id} = req.params;

  const product = await productSchema.findById(id);

  
  if(!product){

   return res.status(404).json({error : 'no such workout'});
}

res.status(200).json(product);
   
})





app.listen(PORT , ()=>{

    console.log("app listening  on port " +  PORT);
})



