//express 
const express= require('express');
const mongoose= require('mongoose');
const cors =require('cors');

//create an instance of express
const app=express();
app.use(express.json());
app.use(cors());

//Port
const port=8000;
app.listen(port,() => 
    console.log(`server is running on port ${port}`))

//routes
/* app.get('/',(req,res) => { res.send('hello world')}) */
//post method

mongoose.connect('mongodb://localhost:27017/mern-db')
.then(
    ()=> console.log('connected to mongodb')
)
.catch(error=> console.error('error connecting to mongodb',error))

//create schema
const todoSchema = new mongoose.Schema({
title:{
    required:true,
    type:String
},
desc:String
})
//create model
const todoModel = mongoose.model('Todo', todoSchema);


const todos=[];
app.post('/todos',async(req,res)=> {
    const {title, desc}=req.body;
    /* 
    const newTodo={
        id:todos.length+1,
        title,
        desc
    }
    todos.push(newTodo); */
    try{
    const newTodo = new todoModel({title,desc});
    await newTodo.save();
    console.log(newTodo);
    res.status(201).json(newTodo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})
//get all items  
app.get('/todos',async (req,res) => {
    try {
 const todos= await todoModel.find();
    res.json(todos);
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
  
})

//update item
app.put('/todos/:id',async (req,res) => {
    const {id}=req.params;
    const {title,desc}=req.body;
    try {
        const updatedTodo= await todoModel.findByIdAndUpdate(id,{title,desc},{new:true});
        if(!updatedTodo){
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json(updatedTodo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})

//update item
app.put('/todos/:id', async (req,res) =>{
try
{
const {title,desc}= req.body;
const id=req.params.id;
const updateTodo= await todoModel.findByIdAndUpdate( id,
{title, desc},
{new:true}
)
if(!updateTodo) 
{
return res.status(404).json({ message: 'todo not found' })
}
res.json(updateTodo)
}
catch
{
    console.error(error);
        res.status(500).json({ message: error.message });
}
})

//delete item
app.delete('/todos/:id',async(req,res) => {
    
    try{const id=req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})