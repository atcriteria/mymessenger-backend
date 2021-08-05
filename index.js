const app = require('express')();
const server = require('http').createServer(app);
// Need the cors statement to accept connections
// from our localhost connections.
const io = require('socket.io')(server, {
    cors: {
        origin: process.env.HOSTED_SITE || "http://localhost:3000",
    },
});
const PORT = process.env.PORT || 3333

let historyOfMessages = []

const pruneMessages = messages => {
    let savedMessages = messages.slice(24)
    historyOfMessages = [...savedMessages]
    console.log("Pruned history")
}
// Takes an incoming message and looks at
// the message history to see if the previous
// message is from the same author, and if so
// then we append it to their messages.
const processMessages = message => {
    if(historyOfMessages.length > 1){
        let previousMessage = historyOfMessages[historyOfMessages.length-2];
        let currentMessage = historyOfMessages[historyOfMessages.length-1];
        if(previousMessage.username === currentMessage.username){
            // We are pointing to the same reference point so we are
            // mutating the historyOfMessages object with this push.
            // Because it is mutable we don't have to make a fresh copy.
            previousMessage.message.push(message.message[0])
            historyOfMessages.pop()
        } else {
            return
        }
    }
}

// We don't need this but I'll leave it in for now
// just to have some output in the browser
app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
})

io.on("connection", socket => {
    socket.on("send-message", message => {
        // socket.broadcast sends the message to all clients
        // that are NOT the originator. Calling socket.emit
        // will send it to all clients, even the client that
        // initiated the message.
        // socket.broadcast.emit("receive-message", message))
        if(!message.adminMessage){
            historyOfMessages.push(message)
        }
        processMessages(message)
        if(historyOfMessages.length >= 50){
            pruneMessages(historyOfMessages)
        }
        io.emit("receive-message", message)
    })
    socket.on("send-admin-message", message => {
        console.log(`<SYSTEM> ${message.message}`)
        io.emit("admin-message", message)
    })
    io.on("connect", (socket) => {
        const username=socket.handshake.auth.username;
        if (!username){
            return next(new Error("invalid username"))
        } else {
            if(historyOfMessages.length === 0){
                return
            } else {
                let id = socket.id;
                io.to(id).emit("receive-message", historyOfMessages)
            }
        }
    })
})

server.listen(PORT, () => {
    console.log(`\nServer listening on port: ${PORT}\n`)
})