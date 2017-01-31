const express = require('express')
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// move this line after the maintenance middleware
// to prevent static rendering of the public folder
// app.use(express.static(__dirname + '/public'));

// middleware for logging each time a request is made to express
// note: this is running on the server so we'll see this in the terminal only
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  // log to terminal
  console.log(log);
  
  // log to file
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  })
  
  next();
});


// maintenance middleware
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
//   // site will stop here
// });
// nothing will be call after the maintenance middleware
// except the static html in the public directory
// we can prevent this by moving the line after 
// our maintenance middleware
app.use(express.static(__dirname + '/public'));


hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
})

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
})

// /bad
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Bad Link'
  })
})


app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
  
});

