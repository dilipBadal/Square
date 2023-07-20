const User = require('../models/users');

exports.fetchSuggestions = async (req, res) => {
    const username = req.query.currentUser;

    try{
        var currentUser =  await User.findOne({"username": username});
    }
    catch(er){
        return res.status(404).json({message: "could not fetch suggestions"});
    }

    try{
        const users = await User.find({}, 'bio dp username followers following requestSent requestReceived');

        const suggestions = users.map(user => {
          if (user.username === username) {
            return null;
          } else if (currentUser.following.includes(user.username)) {
            return null;
          } else {
            return { ...user._doc };
          }
        }).filter(Boolean);

        if(!suggestions){
            return res.status(404).json({message: "Users not found"});
        }
        return res.status(200).json({data: suggestions});
    }
    catch(er){
        return res.status(500).json({message: "Internal Server Error"});
    }
}
