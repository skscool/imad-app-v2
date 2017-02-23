var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
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

//templating
var pages = {
	'page-one':{
		title: 'Template Demo - Page 1',
		body: `<div class= "page1"><h2>This is First page to demonstrate Serverside Templating using javascript and node.js.</h2></div>`
	},
	'page-two':{
		title: 'Template Demo - Page 2',
		body: `<div class= "page2"><h2>This is Second page to demonstrate Serverside Templating using javascript and node.js.</h2></div>`
	}
};

function createTemplate(page){
	var template =
		`<html>
		<head>
			<title>
				${page.title}
			</title>
			<link href= "/template-style.css" rel="stylesheet"/>
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
			${page.body}
		</body>
	</html>`;
	return template;
};

app.get('/template-style.css', function (req, res){
  res.sendFile(path.join(__dirname,'ui','template-style.css'));
});

app.get('/:pagename', function (req, res){
  res.send(createTemplate(pages[req.params.pagename]));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
