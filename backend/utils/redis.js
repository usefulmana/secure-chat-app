const redis = require('redis');
const { User } = require("../models/User");
const client = redis.createClient({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST, 
    password: process.env.REDIS_PW});
    
const { checkPassword } = require("../utils/passwordChecker");

client.on('connect', () => {
    console.log('Connected to Redis');  
});

client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

process.on("exit", function(){
    redisClient.quit();
});

const setKeyValue = (key, value, duration) => {
    client.set(key, value, 'EX', duration, redis.print);
}

const retrievePW =  (key, req, res) => {
    let r = client.get(key, (error, result) => {
        if (error){
            console.log(error);
            throw error;
        }
        const {type , userId } = JSON.parse(result);
        if (type === 'forgotpw'){
            User.findById(userId).then((u) => {
                if (!checkPassword(req.body.password)){
                    return res.status(400).send({error: "Weak Password"}).end()
                };

                u.password = req.body.password;
          
                u.save().then((result) => {
                    deleteKeyValue(key);
                    res.status(200).send({ success: true })
                });
              });
        }
        else {
            res.status(400).send({error: 'Wrong Token Type'})
        }
        
    })
};

const verifyEmail =  (key, req, res) => {
    let r = client.get(key, (error, result) => {
        if (error){
            console.log(error);
            throw error;
        }
        const {type , userId } = JSON.parse(result);
        if (type === 'verify'){
            User.findById(userId).then((u) => {
                u.isVerified = true;
          
                u.save().then((result) => {
                    deleteKeyValue(key);
                    res.status(200).send({ success: true })
                });
              });
        }
        else {
            res.status(400).send({error: 'Wrong Token Type'})
        }
        
    })
};

const deleteKeyValue = (key) => {
    client.del(key, (error, result) => {
        if (error){
            console.log(error);
            throw error;
        }
        console.log(`Deleted key: ${key}`)
    })
}


module.exports = { setKeyValue, retrievePW, deleteKeyValue, verifyEmail };