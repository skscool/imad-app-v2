var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var config = {
    user: 'skscool',
    database: 'skscool',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);
app.get('/test-db', function(req, res){
    pool.query('SELECT * FROM test', function (err, result){
       if(err){
           res.status(500).send(err.toString());
       } else {
           res.send(JSON.stringify(result.rows));
       }
    });
});

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

//API end point
var counter=0;

app.get('/api.html', function(req, res){
	res.sendFile(path.join(__dirname, 'ui', 'api.html'));
});

app.get('/main.js', function(req, res){
	res.sendFile(path.join(__dirname, '', 'main.js'));
});

app.get('/counter', function(req, res){
	counter = counter+1;
	res.send(counter.toString());
});

var names = [];
app.get('/submit-name', function(req, res){
	var name = req.query.name;
	names.push(name);
	res.send(JSON.stringify(names));
});

function createTemplate(article){
	var template =
		`<html>
		<head>
			<title>
				${article.title}
			</title>
			<link href= "ui/template-style.css" rel="stylesheet"/>
			<link href = "ui/index-style.css" rel = "stylesheet"></link>
		</head>
		<body>
			<ul>
			<li><a href = "apache.html">Apache</a></li>
			<li><a href = "api.html">API</a></li>
			<li><a href = "page-one">Article 1</a></li>
			<li><a href = "page-two">Article 2</a></li>
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
    pool.query("SELECT * FROM articles WHERE page='" + req.params.pagename + "'", function(err, result){
       if(err){
           res.status(500).send(err.toString()+req.params.pagename);
       } else {
           if(result.rows.length === 0){
               res.status(404).send("Article "+req.params.pagename+" Not Found!");
           } else {
               console.log(`result.rows.length >> result.rows[0]`);
               var articleData = result.rows[0];
               res.send(createTemplate(articleData));
           }
    }
    });
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
