const app = require('express')();
const server = require('http').createServer(app);
// Need the cors statement to accept connections
// from our localhost connections.
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});
const PORT = process.env.PORT || 3333

let historyOfMessages = []

const pruneMessages = messages => {
    let savedMessages = messages.slice(24)
    historyOfMessages = [...savedMessages]
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
            let id = socket.id;
            console.log(username)
            io.to(id).emit("receive-message", historyOfMessages)
        }
    })
})

server.listen(PORT, () => {
    console.log(`\nServer listening on port: ${PORT}\n`)
})