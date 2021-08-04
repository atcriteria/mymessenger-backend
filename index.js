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

// We don't need this but I'll leave it in for now
// just to have some output in the browser
app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
})

io.on("connection", socket => {
    socket.on("send-message", message => {
        console.log(message)
    })
    socket.on("connect", () => {
        const username=socket.handshake.auth.username;
        if (!username){
            return next(new Error("invalid username"))
        }
        console.log(`${username} has connected`)
    })
})

server.listen(PORT, () => {
    console.log(`\nServer listening on port: ${PORT}\n`)
})