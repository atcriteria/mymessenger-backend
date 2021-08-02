const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3333

// We don't need this but I'll leave it in for now
// just to have some output in the browser
app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
})

// socket.io listens for a 'connection' type and 
// logs to let us know someone connected
io.on('connection', (socket) => {
    socket.on('new-operations', (data) =>{
        io.emit("new-remote-operations", data)
    })
    console.log("A user connected")
})

http.listen(PORT, () => {
    console.log(`\nServer listening on port: ${PORT}\n`)
})