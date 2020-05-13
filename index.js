if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);

const app = express();

// connecting to the server
mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});
const db = mongoose.connection
db.on('error', error => {
    console.error(error);
    app.render('../views/500.ejs');
});
db.once('open', () => console.log('connected to the user database'));


// all middleware here
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new mongoStore({mongooseConnection: db}),
}));
app.use(expressLayouts);
app.set('view engine','ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname + '/assets')));

// all routes here
app.use('/', require('./routes/home.js'));
app.use('/register', require('./routes/register.js'));
app.use('*', require('./routes/404.js'));

app.listen(process.env.PORT || 3000,() => console.log('server started'));