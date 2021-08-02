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

// socket.io listens for a 'connection' type and 
// logs to let us know someone connected
io.use((socket, next) => {
    const username=socket.handshake.auth.username;
    if (!username){
        return next(new Error("invalid username"))
    }
    // setting this up for instances where we want to 
    // ban users in the future
    if (username === "badUser"){
        return next(new Error("invalid username"))
    }
    console.log(`${username} has connected`)
})

server.listen(PORT, () => {
    console.log(`\nServer listening on port: ${PORT}\n`)
})