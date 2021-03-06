const Queue = require('bee-queue');
const redis = require('redis');

const options = {
    removeOnSuccess: true,
    redis: redis.createClient()
}

const cookQueue = new Queue('cook', options);
const serveQueue = new Queue('serve', options);


const placeOrder = (order) => {
    return cookQueue.createJob(order).save();
};

serveQueue.process((job, done) => {
    console.log(`๐งพ ${job.data.qty}x ${job.data.dish} ready to be served ๐`);
    // Notify the client via push notification, web socket or email etc.
    done();
})

module.exports.placeOrder = placeOrder;