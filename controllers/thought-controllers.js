const {Thought,User}= require('../models');

const thoughtController = 
{
    getAllThoughts(req,res){
        Thought.find({})
        .populate({
            path:'user',
            select:'-__v'
        })
        .select('-__v')
        .sort({_id:-1})
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        });
    },
    getThoughtById({params},res){
        Thought.findOne({_id:params.id})
        .populate({
            path:'user',
            select:'-__v'
        })
        .select('-__v')
        .sort({_id:-1})
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        });
    },
    createThought({params,body},res){
        Thought.create(body)
        .then((_id)=> {
            return User.findOneAndUpdate(
                {username:body.username},
                {$push:{thoughts:_id}},
                {new:true}
            );
        })
        .then(dbUserdata => {
            if(!dbUserdata){
                res.status(404).json({message:'no user'});
                return;
            }
            res.json(dbUserdata);
        })
        .catch(err => res.json(err));
    },
    addReaction({params,body},res){
        Thought.findOneAndUpdate(
            {_id:params.thoughtId},
            {$push:{reactions:body}},
            {new:true,runValidators:true}
        )
        .then(dbThoughtData => {
            if(!dbThoughtData){
                res.status(404).json({message:'no thought'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },
    removeReaction({params},res){
        Thought.findOneAndDelete(
            {_id:params.thoughtId},
            {$pull:{reactions:{reactionId:params.reactionId}}},
            {new:true}
        )
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.json(err));
    },
    updateThought({params,body},res){
        Thought.findOneAndUpdate(
            {_id:params.id},
            body,
            {new:true,runValidators:true}
        )
        .then(updatedThought => {
            if(!updatedThought){
                res.status(404).json({message:'no thought'});
                return;
            }
            res.json(updatedThought);
        })
        .catch(err => res.json(err));
    },
    deleteThought({params,body},res){
        Thought.findByIdAndDelete(
          {_id:params.id}  
        )
        .then(deletedThought => {
            if(!deletedThought){
                res.status(404).json({message:'no thought'});
                return;
            }
            res.json(deletedThought);
        })
        .catch(err => res.json(err));
    }
}

module.exports = thoughtController;