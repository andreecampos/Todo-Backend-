const express = require('express');
const app = express();
const bcrypt = require('bcryptjs')
const cors = require('cors');
const mongoose= require('mongoose');
const User = require('./modules/user.model');
const jwt = require ('jsonwebtoken');
const Todo = require('./modules/Todo_Schema')

const PORT = 3001;

app.use(cors())
app.use(express.json())



mongoose.connect('mongodb://localhost/backend2')

app.post("/api/register", async (req, res) => {
  console.log(req.body)
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
        console.log(err)
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
                    
                }, 
                'secret123'
                )
                

            return res.json({status: 'OK', user: token})
        } else {
            return res.json({status: 'error', user: false})
        }
        
    })
    


app.get('/todos', async ( req, res) => {
const todos = await Todo.find();

res.json(todos);
});

app.post('/todo/new', (req, res) => {
    const todo = new Todo({
        task: req.body.task,
        description : req.body.description
    });
    todo.save();
    res.json(todo);
})

app.delete('/todo/delete/:id', async (req,res)=>{
    const result = await Todo.findByIdAndDelete(req.params.id);

    res.json(result);

});

app.get('/todo/complete/:id', async ( req, res) =>{
    const todo =  await Todo.findById(req.params.id);
    
    todo.complete = !todo.complete;

    todo.save();

    res.json(todo);
})
    
    
app.listen(PORT, () => {
  console.log(`Started Express server on port ${PORT}`);
});

//https://www.youtube.com/watch?v=Ejg7es3ba2k 

//https://www.youtube.com/watch?v=R81g-2r6ynM&t=8s minute 17:19