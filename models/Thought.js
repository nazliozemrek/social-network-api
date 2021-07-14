const { Schema,model} = require('mongoose');

const ThoughtsSchema = new Schema(
    {
        thoughtText:{
            type:String,
            required:true,
            min:[1],
            max:[280]
        },
        createdAt:{
            type:Date,
            default:Date.now,
            get:createdAtVal => dateFormat(createdAtVal)
        },
        username:{
            type:String,
            required:true
        },
        reactions:{
            type:Schema.Types.ObjectId,
            ref:'Reactions'
        }
    },
    {
        toJSON:{
            virtuals:true
        },
        id:false
    }
)

ThoughtsSchema.virtual('reactionCount').get(function(){
    return this.reactions.length;
});

const Thought =model('Thought',UserSchema);

module.exports = Thought;