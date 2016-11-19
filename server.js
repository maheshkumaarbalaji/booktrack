var express=require('express');
var morgan=require('morgan');
var path=require('path');
var bodyparser=require('body-parser');
var Pool=require('pg').Pool;
var crypto=require('crypto');
var session=require('express-session');

var app=express();
app.use(morgan('combined'));
app.use(bodyparser.json());
app.use(session({
    secret:'vamefa00',
    cookie:{maxage:30*24*60*60*1000}
}));

var config = {
    user: 'maheshkumaar',
    database: 'maheshkumaar',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};


var pool=new Pool(config);

app.get('/',function(req,res){
res.sendFile(path.join(__dirname,'ui','index.html'));
});

app.get('/style.css',function(req,res){
res.sendFile(path.join(__dirname,'ui','style.css'));
});

app.get('/main.js',function(req,res){
res.sendFile(path.join(__dirname,'ui','main.js'));
});


function hash(input,salt)
{
    var hashed=crypto.pbkdf2Sync(input,salt,10000,64,'sha512');
    return [salt,hashed.toString('hex')].join('$');
}

app.post('/login',function(req,res){
var username=req.body.username;
var password=req.body.password;
pool.query('SELECT * FROM login_details WHERE username=$1',[username],function(err,result){
if(err)
res.send(500).send(err.toString());
else
{
if(result.rows.length===0)
res.send(403).send("Username/password is invalid");
else
{
var dbString=result.rows[0].password;
var salt=dbString.split('$')[0];
var hashedPassword=hash(password,salt);
if(hashedPassword===dbString)
{
    req.session.auth={userId:result.rows[0].userid};
    res.send(200).send("Login Successfull.");
}
else
{
res.send(403).send("username/password is invalid.");
}
}
}
});
});

app.post('/create-user',function(req,res){
   var username=req.body.username;
   var password=req.body.password;
   var salt=crypto.randomBytes(64).toString('hex');
   var dbString=hash(password,salt);
   pool.query('INSERT INTO login_details(username,password) VALUES($1,$2)',[username,dbString],function(err,result){
      if(err)
      res.send(500).send(err.toString());
      else
      {
          req.session.auth={userId:result.rows[0].userid};
          res.send(200).send('User successfully created!');
      }
   });
});

app.get('/userHome.html',function(req,res){
   res.sendFile(path.join(__dirname,'ui','userHome.html'));
});

app.get('/User.js',function(req,res){
   res.sendFile(path.join(__dirname,'ui','User.js')); 
});


app.get('/browse-books',function(req,res){
pool.query('SELECT BookId,Title,Genre_Name  FROM Book_Details,Genre_list WHERE Book_Details.GenreId=Genre_list.GenreId',function(err,result){
  if(err)
  {
      res.send(500).send(err.roString());
  }
  else
  {
       res.send(JSON.stringify(result.rows));
  }
});   
});

function createTemplate(data)
{
    var Title=data.Title;
    var Author=data.AuthorName;
    var Genre=data.Genre_Name;
    var Description=data.Description;
    var htmlTemplate=`
    <html>
<head>
<title>
${Title}
</title>
<link rel="stylesheet" type="text/css" href="/ui/style.css"/>
</head>
<body>
<div id="header">
	<h1>Welcome to,</h1>
	<h2>BookList</h2>
</div>
<div id="content">
	<h2 class="title">${Title}</h2>
	<div class="story1" id="context_area">
		<ul id="Book_Desc">
		<li>Author:${Author}</li>
		<li>Genre:${Genre}</li>
		<li>Description:${Description}</li>
		</ul>
	</div>
</div>
<div id="footer">
	<p>Copyright &copy; 2016 BookList. </p>
</div>
</body>
</html>
`;
    return htmlTemplate;
}
app.get('/browse-books/:Title',function(req,res){
   var Title=req.params.Title;
   var obj;
   pool.query('SELECT Title,Description,Genre_Name,AuthorName FROM Book_Details,Genre_list,Author_list WHERE Title=$1 AND Book_Details.GenreId=Genre_list.GenreId AND Book_Details.AuthorId=Author_list.AuthorID',[Title],function(err,result){
      if(err)
      res.send(500).send('Something went wrong with the server.');
      else
      {
          res.send(200).send(createTemplate(result.rows[0]));
      }
   });
});

app.get('/logout',function(req,res){
   delete req.session.auth;
   res.send('Logged out successfully.');
});

app.listen(8080,function(){
console.log("Server listening on port 8080");
});