const User = require('../models/users');

exports.reset = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try{
        
    const user = await User.findOne({email});
 
    if(!user){
        return res.status(404).json({message: "Could not find user"});
    }

    user.password = password;
    await user.save();

    return res.status(200).json({message: "Password successfully Reset"});
    }
    catch(er){
        return res.status(500).json({message: "Internal Server Error"});
    }
}