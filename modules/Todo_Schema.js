const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    task: {
        type: String, required: true
    },
    description: { type: String, required: true},
    complete: {type: Boolean, default: false},
    //skapa en till field/varible då vet jag vilken användare skapade todo
    //como referenciar otros schemas en mongosse
    createby: {type: mongoose.Schema.Types.ObjectId, ref:'UserData'}
    
    
}, {timestamps: true}); 

const Todo = mongoose.model('Todo', TodoSchema)

module.exports = Todo
