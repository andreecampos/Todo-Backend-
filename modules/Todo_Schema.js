const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    task: {
        type: String
    },
    description: { type: String, default: "" },
    file: {type: String, default: ""},
    complete: {type: Boolean, require: true},
    //skapa en till field/varible då vet jag vilken användare skapade todo
    //como referenciar otros schemas en mongosse
    createby: {type: mongoose.Schema.Types.ObjectId, ref:'UserData'},
    //createdAt: {
        //type: String,
        //immutable: true, 
        //default: () => moment().format("YYYY-MM-DD, HH:mm:ss"),
    //}
    
    
}, {timestamps: true}); 

const Todo = mongoose.model('Todo', TodoSchema)

module.exports = Todo
