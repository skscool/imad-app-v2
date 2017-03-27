var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
//database credentials
var config = {
    user: 'skscool',
    database: 'skscool',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

//pool for database connection
var pool = new Pool(config);

app.get('/ui/index-style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index-style.css'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/prog.gif', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'prog.gif'));
});

app.get('/Apache.html', function (req, res){
  res.sendFile(path.join(__dirname,'ui','Apache.html'));
});


app.get('/ui/apache-css.css', function(req, res){
 res.sendFile(path.join(__dirname,'ui','apache-css.css'));
});

app.get('/ui/Capture.jpg', function (req, res){
  res.sendFile(path.join(__dirname,'ui','Capture.jpg'));
});

app.get('/ui/Capture2.jpg', function(req, res){
 res.sendFile(path.join(__dirname,'ui','Capture2.jpg')); 
});

app.get('/ui/Capture3.jpg', function(req, res){
 res.sendFile(path.join(__dirname,'ui','Capture3.jpg'));
});

app.get('/ui/Capture4.jpg', function(req, res){
 res.sendFile(path.join(__dirname,'ui','Capture4.jpg'));
});

app.get('/ui/Capture5.jpg', function(req, res){
 res.sendFile(path.join(__dirname,'ui','Capture5.jpg'));
});

app.get('/ui/Capture6.jpg', function(req, res){
 res.sendFile(path.join(__dirname,'ui','Capture6.jpg'));
});

app.get('/ui/tuning-your-apache-server.png', function(req, res){
 res.sendFile(path.join(__dirname,'ui','tuning-your-apache-server.png'));
});

//counter end point variable
var counter=0;

app.get('/api.html', function(req, res){
	res.sendFile(path.join(__dirname, 'ui', 'api.html'));
});

app.get('/main.js', function(req, res){
	res.sendFile(path.join(__dirname, '', 'main.js'));
});

//counts number of times visited
app.get('/counter', function(req, res){
	counter = counter+1;
	res.send(counter.toString());
});

//store names using ?name or UI in names[]
var names = [];
app.get('/submit-name', function(req, res){
	var name = req.query.name;
	names.push(name);
	res.send(JSON.stringify(names));
});

app.get('/login', function(req,res){
    res.sendFile(path.join(__dirname, 'ui' , 'login.html'));
});

function createTemplate(article){
	var template =
		`<html>
		<head>
			<title>
				${article.title}
			</title>
			<link href= "/template-style.css" rel="stylesheet"/>
			<link href = "/ui/index-style.css" rel = "stylesheet"></link>
		</head>
		<body>
			<ul>
			<li><a href = "apache.html">Apache</a></li>
			<li><a href = "api.html">API</a></li>
			<li><a href = "/article/page-1">Article 1</a></li>
			<li><a href = "/article/page-2">Article 2</a></li>
			<li style = "float:right"><a href = "counter">counter</a></li>
		</ul>
			${article.body}
		</body>
	</html>`;
	return template;
}

app.get('/template-style.css', function (req, res){
  res.sendFile(path.join(__dirname,'ui','template-style.css'));
});

app.get('/article/:pagename', function (req, res){
    //retriving the title and body from database
    pool.query("SELECT * FROM articles WHERE page= $1",[req.params.pagename], function(err, result){
       if(err){
           res.status(500).send(err.toString());
       } else {
           if(result.rows.length === 0){
               res.status(404).send("Article Not Found!");
           } else {
               //template will be created using database
               var articleData = result.rows[0];
               res.send(createTemplate(articleData));
           }
    }
    });
});

function hash(pass, salt){
    var hashed = crypto.pbkdf2Sync(pass,salt,10000,512,'sha512');
    return ['pbkdf2','10000',salt,hashed.toString('hex')].join('$');
}

app.post('/create-user', function (req, res){
   var username = req.body.username;
   var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var hashedPassword = hash(password,salt);
   
   pool.query('insert into "user" (username,password) values ($1,$2)',[username,hashedPassword],function(err,res){
      if(err){
          res.send("error occured!");
      } else{
          res.send("user succesfully created: " + username);
      }
   });
});

//to take username and password from json object and validate
app.post('/login', function(req, res){
   var username = req.body.username;
   var password = req.body.password;
   
   pool.query('SELECT * FROM "user" WHERE username = $1', [username], function(err, result){
       if(err){
           res.status(500).send(err.toString());
       }else{
           if(result.rows.length === 0){
               res.send(403).send('invalid credentials!');
           }else{
               var dbString = result.rows[0].password;
               var salt = dbString.split('$')[2];
               var hashedPassword = hash(password, salt);
               if(hashedPassword === dbString){
                   res.send('Credentials are correct');
               }else{
                   res.send(403).send('invalid credentials!');
               }
           }
       }
   });
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});