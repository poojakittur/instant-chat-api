var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var http = require('http'); 

const app = express();
const server = http.createServer(app);
const io_socket = require('socket.io')(server)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    req.sendFile(path.resolve('public/index.html'));
});

server.listen(process.env.PORT || '3000')

io_socket.on("connection", (socket) => {
   

    let username = socket.handshake.query.username;
    console.log(`${username} is connected`);
    socket.on('client:message', (data) => {
      console.log(data);
      socket.broadcast.emit('server:message', data);
    });

    socket.on("disconnect", () => {
        console.log(`${username} is disconnected`);
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
