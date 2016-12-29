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
    user: 'iwjvachikwufws',
    database: 'dc3tdkmhq15e9e',
    host: 'ec2-54-163-234-20.compute-1.amazonaws.com',
    port: '5432',
    password: '447cc04a18b582a5eb8439c36f67f0bd06dc562e9236c5feaafe1d67b29180ce'
};


var pool=new Pool(config);

function homeTemplate(data)
{
	var content=data.content;
	var title=data.title;
	var htmlTemplate=`
	<html>
	<head>
	<title>Home</title>
	<link href="/style.css" rel="stylesheet" type="text/css" />
	</head>
	<body>
	<div id="header">
	<h1>Welcome to,</h1>
	<h2>BookList</h2>
	</div>
	<div id="splash">
    <h2>About</h2>
    <p>BookList provides user with an easy and adoptive approach to manage novels that the user has read, yet to read or would like to view 
    a review about. The site also provides timely remainders to the user regarding upcoming novels belonging to their marked genres or favourite authors.</p>
	</div>
	<div id="content">
	<h2 class="title">${title}</h2>
	<div class="story" id="login_area">
		${content}
	</div>
	</div>
	<div id="footer">
	<p>Copyright &copy; 2016 BookList. </p>
	</div>
	<script src="/main.js"></script>
	</body>
	</html>
	`;

	return htmlTemplate;
}

var pageDetails={
'LCError':{
title:'Login',
content:`
<h3>Invalid Credentials!</h3>
<h4><a href="/">Click here</a> to try logging in again.</h4>
`
},
'LSError':{
	title:'Login',
	content:`
	<h3>Error occurred at the server end.</h3>
	<h4><a href="/">Click here</a> to try logging in again.</h4>	
	`
},
'RSError':{
	title:'Register',
	content:`
	<h3>Error occurred at the server end.</h3>
	<h4><a href="/register.html">Click here</a> to try logging in again.</h4>
	`
},
'Login':{
	title:'Login',
	content:`
	<form action="/login" method="post" name="login_form">
    Username:<input type="text" name="username" pattern="^[a-zA-Z0-9_]{1,40}$" required><br/>
    Password:<input type="password" name="password" required><br/>
    <input type="submit" id="login_btn" value="Login"><br/><br/>
    </form>
    <a href="/register"> &gt&gt Register now </a>
	`
},
'Register':{
	title:'Register',
	content:`
	<form action="/create-user" method="post" name="register_form">
	Name:<input type="text" name="name" pattern="^[a-zA-Z]{0,30}$"><br/>
    Username:<input type="text" name="username" pattern="^[a-zA-Z0-9_]{1,40}$" onblur="validate("UName",this.value);" required><span id="UName">*</span><br/>
    Password:<input type="password" name="password" required><span>*</span><br/>
    <input type="submit" id="register_btn" value="Register"><br/><br/>
    </form>
	`
},
'RSuccess':{
	title:'Register',
	content:`
	<h2>Registration process was successfull.</h2>
	<h4><a href="/">Login</a> with the created credentials to proceed to the website.</h4>
	`
}
};

app.get('/',function(req,res){
res.status(200).send(homeTemplate(pageDetails['Login']));
});

app.get('/index.html',function(req,res){
res.status(200).send(homeTemplate(pageDetails['Login']));
});

app.get('/register',function(req,res){
res.status(200).send(homeTemplate(pageDetails['Register']));
});

app.get('/style.css',function(req,res){
res.sendFile(path.join(__dirname,'style.css'));
});

app.get('/img2.gif',function(req,res){
res.sendFile(path.join(__dirname,'img2.gif'));
});

app.get('/img4.gif',function(req,res){
res.sendFile(path.join(__dirname,'img4.gif'));
});

app.get('/main.js',function(req,res){
res.sendFile(path.join(__dirname,'main.js'));
});

app.get('/book.js',function(req,res){
res.sendFile(path.join(__dirname,'book.js'));
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
  res.status(500).send(homeTemplate(pageDetails['LSError']));
  else
  {
    if(result.rows.length===0)
    res.status(403).send(homeTemplate(pageDetails['LCError']));
    else
    {
      var dbString=result.rows[0].password;
      var salt=dbString.split('$')[0];
      var hashedPassword=hash(password,salt);
      if(hashedPassword===dbString)
      {
        req.session.auth={userId:result.rows[0].userid};
        res.status(200).sendFile(path.join(__dirname,'userHome.html'));
      }
      else
      {
        res.status(403).send(homeTemplate(pageDetails['LCError']));
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
      res.status(500).send(homeTemplate(pageDetails['RSError']));
      else
      {
          res.status(200).send(homeTemplate(pageDetails['RSuccess']));
      }
      });
});


app.post('/check-register',function(req,res){
	var username=req.body.username;
	pool.query('SELECT * from login_details WHERE username=$1',[username],function(err,result){
		if(err)
		{
			res.status(500).send('Some error occurred at the server end.');
		}
		else
		{
			if(result.rows.length===0)
			{
				res.status(200).send('Valid username');
			}
			else
			{
				res.status(403).send('Invalid username');
			}
		}
	});
});

app.get('/userHome.html',function(req,res){
   res.sendFile(path.join(__dirname,'userHome.html'));
});

app.get('/User.js',function(req,res){
   res.sendFile(path.join(__dirname,'User.js')); 
});


app.get('/browse-books',function(req,res){
pool.query('SELECT bookid,title,genre_name  FROM book_details,genre_list WHERE book_details.genreid=genre_list.genreid',function(err,result){
  if(err)
  {
      res.status(500).send(err.toString());
  }
  else
  {
       res.status(200).send(JSON.stringify(result.rows));
  }
});   
});

function createTemplate(data)
{
    var Bookid=data.bookid;
    var Title=data.title;
    var Author=data.authorname;
    var Genre=data.genre_name;
    var Description=data.description;
    var htmlTemplate=`
    <html>
    <head>
    <title>
    ${Title}
    </title>
    <link href="/style.css" rel="stylesheet" type="text/css" />
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
		<li id="bookid"><b>BookID</b>:${Bookid}</li>
		<li><b>Author</b>:${Author}</li>
		<li><b>Genre</b>:${Genre}</li>
		<li><b>Description</b>:${Description}</li>
		</ul>
		<input type="submit" id="Readlist" value="Add to Readlist"/>
		<input type="submit" id="MarkRead" value="Mark as Read"/><br/>
		<input type="submit" id="Home" value="HomePage"/>
	    </div>
    </div>
    <div id="footer">
	<p>Copyright &copy; 2016 BookList. </p>
    </div>
    <script src="/book.js"></script>
    </body>
    </html>
`;
    return htmlTemplate;
}
app.get('/browse-books/:Title',function(req,res){
   var Title=req.params.Title;
   pool.query('SELECT bookid,title,description,genre_name,authorname FROM book_details,genre_list,author_list WHERE title=$1 AND book_details.genreid=genre_list.genreid AND book_details.authorid=author_list.authorid',[Title],function(err,result){
      if(err)
      res.status(500).send('Something went wrong with the server.');
      else
      {
          res.status(200).send(createTemplate(result.rows[0]));
      }
   });
});

app.post('/userbook-details',function(req,res){
	var bookid=req.body.bookid;
	var userid=req.session.auth.userId;
	pool.query('SELECT status FROM userbook_details WHERE userId=$1 AND bookid=$2',[userid,bookid],function(err,result){
		if(err)
		{
			res.status(500).send('Error at server end.');
		}
		else
		{
			if(result.rows.length===0)
			{
				res.status(403).send('No books were found.');
			}
			else
			{
				res.status(200).send(JSON.stringify(result.rows[0]));
			}
		}
	});
});

app.get('/add-book',function(req,res){
   var bookid=req.query.bookid;
   var status='U';
   pool.query('INSERT INTO userbook_details(userid,bookid,status) VALUES($1,$2,$3)',[req.session.auth.userId,bookid,status],function(err,result){
      if(err)
      {
          res.status(500).send('Some error occurred with the server.');
      }
      else
      {
          res.status(200).send('Book Added successfully!');
      }
   });
});

app.get('/mark-book',function(req,res){
   var bookid=req.query.bookid;
   var status='R';
   pool.query('UPDATE userbook_details SET status=$1 WHERE bookId=$2',[status,bookid],function(err,result){
      if(err)
      {
          res.status(500).send('Some error occurred with the server.');
      }
      else
      {
          res.status(200).send('Book marked as READ!');
      }
   });
});

app.get('/display-profile',function(req,res){
   var userid=req.session.auth.userId;
  pool.query('SELECT userbook_details.bookid,book_details.title FROM userbook_details,book_details WHERE userid=$1 AND userbook_details.bookid=book_details.bookid ',[userid],function(err,result){
       if(err)
       {
           res.status(500).send('Some error occurred at the server end.');
       }
       else
       {
           if(result.rows.length===0)
           {
               res.status(403).send('Credential error!');
           }
           else
          	{
               res.status(200).send(JSON.stringify(result.rows));
          	
           	}
       }
   });
});
 

app.get('/upcoming-books',function(req,res){
var userid=req.session.auth.userId;
var today=new Date();
var todayDate="" + today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();
pool.query('SELECT book_details.title,book_details.dateofrelease,genre_list.genre_name FROM book_details,genre_list WHERE book_details.dateofrelease > $1  AND book_details.genreid=genre_list.genreid',[todayDate],function(err,result){
	if(err)
	{
		res.status(500).send('Some error occurred at the server end.');
	}
	else
	{
		if(result.rows.length===0)
		{
			res.status(403).send('Error at the client end.');
		}
		else
		{
			res.status(200).send(JSON.stringify(result.rows));
		}
	}
});
});



app.get('/logout',function(req,res){
   delete req.session.auth;
   res.status(200).send('Logged out successfully.');
});


var port= process.env.PORT || 8000;

app.listen(port,function(){
console.log("Server listening on port " + port);
});
