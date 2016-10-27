var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;
var app = express();
app.use(morgan('combined'));

var articles={
    'article-one':{
        'title':'Article-one | Mahesh kumaar',
        'heading':'Article one',
        'content':'This is the content of my first article'
        
    },
    'article-two':{
        'title':'Article-two | Mahesh kumaar',
        'heading':'Article two',
        'content':'This is the content of my second article'
    }
};

function createTemplate(data){
    var heading=data.heading,title=data.title,content=data.content;
    var htmlTemplate=`
    <html>
    <head>
    <title>
    ${title}
    </title>
    <link rel="stylesheet" href="ui/style.css">
    </head>
    <body>
    <h1>
    ${heading}
    </h1>
    <p>
    ${content}
    </p>
    </body>
    </html>
    
    `;
    return htmlTemplate;
}

var config={
    user:'maheshkumaar',
    host:'db.imad.hasura-app.io',
    database:'maheshkumaar',
    port:'5432',
    password:process.env.DB_PASSWORD
};

var pool=new Pool(config);

app.get('/testdb',function(req,res){
    pool.query("SELECT * FROM test",function(err,result){
       if(err){
           res.status(500).send(err.toString());
       } else
       {
           res.send(JSON.stringify(result.rows));
       }
    });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

var comments=[];
app.get('/submit-comment',function(req,res){
var comment=req.query.comment;
comments.push(comment);
res.send(JSON.stringify(comments));
});


app.get('/articles/:articleName', function (req, res) {
    var articleName=req.params.articleName;
  res.send(createTemplate(articles[articleName]));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
