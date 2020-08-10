const redis = require('redis');

const client = redis.createClient({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST
})

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
    console.log(value)
    client.set(key, value, 'EX', duration, redis.print)
}

const getKeyValue = (key) => {
    client.get(key, (error, result) => {
        if (error){
            console.log(error);
            throw error;
        }

        return JSON.parse(result)
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


module.exports = { setKeyValue, getKeyValue, deleteKeyValue };