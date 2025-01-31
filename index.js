const express = require('express');
const app = express();
const bcrypt = require('bcryptjs')
const cors = require('cors');
const mongoose= require('mongoose');
const User = require('./modules/user.model');
const jwt = require ('jsonwebtoken');
const Todo = require('./modules/Todo_Schema')
const multer = require("multer")
const controller = require('./controllers/upload')
const PORT = 3001;

app.use(cors())
app.use(express.json()) 




mongoose.connect('mongodb://localhost/backend2')

app.post("/api/register", async (req, res) => {
  //console.log(req.body)
  try{
      const newPassword = await bcrypt.hash(req.body.password, 10)
        const user = await User.create({
            firstName: req.body.firstName,
            lastName : req.body.lastName,
            username : req.body.username,
            email: req.body.email,
            password: newPassword,
        })
        res.json({status:'ok'})
  }catch(err){
        //console.log(err)
      res.json({status: 'error', error: 'Duplicate email'})
  }

});


app.post("/api/login", async (req, res) => {

    const user = await User.findOne({
        username: req.body.username,
        
        })
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password)
       
   if(isPasswordValid) {
            const token = jwt.sign(
                { 
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName : user.lastName,
                    userId: user._id 
                }, 
                'secret123'
                )
            //console.log(user)
            //console.log(token)
            return res.json({ status: 'OK', user: token}
            )
        } else {
            return res.json({ status: 'error', user: false})
        } 
    })

const verifyJWT = (req, res, next) => {
        const authHeader = req.headers['authorization']
         console.log(authHeader)
        const token = authHeader && authHeader.split(' ')[1]
        if(token == null) return res.sendStatus(401)
         jwt.verify(token,'secret123', (err, decoded) =>{
             if(err) return res.sendStatus(403)
             //console.log(decoded)
             req.user = decoded
             //console.log(req.user)
             next()  
         })
    }  
    
app.get('/isUserAuth', verifyJWT, (req,res)=>{
    
    //res.json(User => User.username === req.user.username )
    if(req.user){res.json({message:"You are authenticated Congrats!"})}
    else{res.json({message:"Your are not authenticated"})}

    //res.json({message:"You are authenticated Congrats!"})
})


app.get('/todos/',verifyJWT, async ( req, res) => {
   console.log(req.query)

   const complete = req.query.completed === "true"
    //todos?completed=true => req.query === {completed: "true"}
    //filtrera
    //1.1 vad i databasen vill jag filtrera
    //1.2 shemas kolla vilken användare skapades todos
    //1.4 createby:req.user.userId vi vill ha.....
console.log(req.user)
//2.1 lade.populate
const todos = await Todo.find({createby:req.user.userId, complete})
.populate('createby')
.sort({createdAt: -1})
 .exec();
res.json(todos);
});
 


app.get('/detail/:id',verifyJWT, async ( req, res) => {

    /*const { id } = req.params
         Todo.findById(id)
        .then(todos => res.json(todos)) */

      const id = req.params.id
     const entry = await Todo
                    .findOne({ _id: id })
                     res.json({ entry });
 
});



app.post('/todo/new', verifyJWT, async (req, res) => { 
    //1.3 sen sätta createby (from Todo_shemmas) och spara userId from min token
    //1.3 så userId sparas i new todos
 console.log("body:", req.body)
    const todo = new Todo({
        task: req.body.task,
        description : req.body.description,
        createby: req.user.userId
    });
    todo.save();
    res.json(todo);
    
}) 

app.put('/todo/update/:todoId',verifyJWT, async (req, res) => {
    const todoId = req.params.todoId
    const entry = await Todo.findByIdAndUpdate({_id: todoId})
    res.json({entry});
   
})

app.delete('/todo/delete/:id', async (req,res)=>{
    const result = await Todo.findByIdAndDelete(req.params.id);

    res.json(result);

});
/*
app.put('/todo/update/:id', async (req,res)=>{
    const result = await Todo.findByIdAndUpdate(req.params.id);

    res.json(result);

});*/

app.get('/todo/complete/:id', async ( req, res) =>{
    const todo =  await Todo.findById(req.params.id);
    
    todo.complete = !todo.complete;

    todo.save();
 
    res.json(todo);
})

    //---------------------------- multer -------------------

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "uploads")
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
      }
    })

  const upload = multer({storage: storage}).array("file");

  app.post("/upload", (req, res) => {
    
    console.log(req.files)       
    
    upload(req, res, (err) => {
      if (err) {
        return res.status(500).json(err)
      }
      return res.status(200).send(req.files)
    }) 
  })
/*
  app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "upload.html"))
  });*/

     
app.listen(PORT, () => {
  console.log(`Started Express server on port ${PORT}`);
});


//https://www.youtube.com/watch?v=KgXT63wPMPc
//https://www.youtube.com/watch?v=Ejg7es3ba2k 

//https://www.youtube.com/watch?v=R81g-2r6ynM&t=8s minute 17:19