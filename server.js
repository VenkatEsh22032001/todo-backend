const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors({ origin: 'http://3.81.228.191:3000' }));
const app = express();

app.use(express.json());
app.use(cors())

cors

//create a new todo item
// let todos = []

// connecting mongodb
mongoose.connect('mongodb+srv://test:test@cluster0.sqigu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>{
    console.log('DB connected!')
})
.catch((err)=>{
    console.log(err)
})

//creating schema -using this only mongoose insert data in collections
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type:String 
    },
    description: String
})

//creating model
const todoModel = mongoose.model('Todo', todoSchema);


app.post('/todos', async(req, res)=>{
    const{title, description} = req.body;
    // const newTodo = {
    //     id: todos.length + 1,
    //     title, 
    //     description
    // }
    // todos.push(newTodo);
    // console.log(todos);
    try{
        const newTodo = new todoModel({title, description});
        await newTodo.save();
        res.status(201).json(newTodo);
    }catch(err){
        console.log(err)
        res.status(500).json({message: err.message});
    }
})


//Get all items
app.get('/todos',async (req, res)=>{
    try{
        const todos = await todoModel.find()
        res.json(todos)
    }catch(err){
        console.log(err)
        res.status(500).json({message: err.message});
    }
   
})

//update a todo item
app.put("/todos/:id", async (req, res)=>{
    try{
        const {title, description} = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id, 
            { title, description }, 
            { new: true}
        )

        if(!updatedTodo){
            return res.status(404).json({message: "Todo not found"})
        }
        res.json(updatedTodo)

    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message})
    }
    
})


// Delete a todo item

app.delete('/todos/:id', async (req, res)=>{
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(err);
        res.status(500).json({message: err.message}) 
    }
    
})



//Start the server
const port = 5000;
app.listen(port, ()=>{
    console.log('Server is listening to port '+port);
})

