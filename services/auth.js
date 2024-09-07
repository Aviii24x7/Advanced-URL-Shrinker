// Mantaininga a state to the server
// will be lost once the server is restarted

// const sessionIdToUserMap = new Map();


// function setUser(id, user){
//     sessionIdToUserMap.set(id, user);
// }

// function getUser(id){
//     return sessionIdToUserMap.get(id);
// }


// Stateless Authentication using JWT- JSON Web Token
const jwt = require('jsonwebtoken');

// making a secret key that could be only available to us
const secret = "aviii24x7";

function setUser(user){
    // const payload = {
    //     ...user
    // }

    // making data inside user  into an token using secret key to access that 
    return jwt.sign({
        _id: user._id,
        email: user.email,
        role:user.role
    }, secret)
}

function getUser(token){
    if (!token){
        return null
    }
    try{
        console.log(jwt.verify(token, secret))
        return jwt.verify(token, secret);

    } catch(err){
        console.log(err)
        return null
    }
}


module.exports = {
    setUser,
    getUser
}


