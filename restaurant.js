require('dotenv').config();
const express = require('express');
const http = require('http');
require('./kitchen');
const { placeOrder } = require('./waiter');
const Arena = require('bull-arena');

// Inits
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/', (req, res) => {
    res.send("๐ We are serving freshly cooked food ๐ฒ");
});

app.post('/order', (req, res) => {
    let order = {
        dish: req.body.dish,
        qty: req.body.qty,
        orderNo: Date.now().toString(36)
    }

    if (order.dish && order.qty) {
        placeOrder(order)
            .then(() => res.json({ done: true, message: "Your order will be ready in a while" }))
            .catch(() => res.json({ done: false, message: "Your order could not be placed" }));
    } else {
        res.status(422);
    }
})

app.post('/order-legacy', (req, res) => {
    let order = {
        dish: req.body.dish,
        qty: req.body.qty,
        orderNo: Date.now().toString(36)
    }
    if (order.dish && order.qty) {
        setTimeout(() => console.log("Getting the ingredients ready... ๐ฅฌ ๐ง ๐ง ๐"), 1000);
        setTimeout(() => console.log(`๐ณ Preparing ${order.dish}`), 1500);
        setTimeout(() => {
            console.log(`๐งพ Order ${order.orderNo}: ${order.dish} ready`);
            res.json({ done: true, message: `Your ${order.qty}x ${order.dish} is ready` })
        }, order.qty * 5000);
    } else {
        console.log("Incomplete order rejected");
        res.status(422).json({ done: false, message: "Your order could not be placed" });
    }
});

// Create and start the server
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Restaurant open at:${PORT}`);
});