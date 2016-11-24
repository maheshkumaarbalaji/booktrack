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

app.get('/index.html',function(req,res){
res.sendFile(path.join(__dirname,'ui','index.html'));
});

app.get('/style.css',function(req,res){
res.sendFile(path.join(__dirname,'ui','style.css'));
});

app.get('/img2.gif',function(req,res){
res.sendFile(path.join(__dirname,'ui','img2.gif'));
});

app.get('/img4.gif',function(req,res){
res.sendFile(path.join(__dirname,'ui','img4.gif'));
});

app.get('/main.js',function(req,res){
res.sendFile(path.join(__dirname,'ui','main.js'));
});

app.get('/book.js',function(req,res){
res.sendFile(path.join(__dirname,'ui','book.js'));
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
res.status(500).send(err.toString());
else
{
if(result.rows.length===0)
res.status(403).send("Username/password is invalid");
else
{
var dbString=result.rows[0].password;
var salt=dbString.split('$')[0];
var hashedPassword=hash(password,salt);
if(hashedPassword===dbString)
{
    req.session.auth={userId:result.rows[0].userid};
    res.status(200).send("Login Successfull.");
}
else
{
res.status(403).send("username/password is invalid.");
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
      res.status(500).send(err.toString());
      else
      {
          res.status(200).send('User successfully created!');
      }
   });
});

app.get('/check-login',function(req,res){
	if(req.session && req.session.auth && req.session.auth.userId)
	{
		res.status(200).send('You are logged in to the website');
	}
	else
	{
		res.status(403).send('You are not logged in to the website.');
	}
});

app.post('/check-register',function(req,res){
	var username=req.body.username;
	pool.query('SELECT * FROM login_details WHERE username=$1',[username],function(err,result){
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
   res.sendFile(path.join(__dirname,'ui','userHome.html'));
});

app.get('/User.js',function(req,res){
   res.sendFile(path.join(__dirname,'ui','User.js')); 
});


app.get('/browse-books',function(req,res){
pool.query('SELECT BookId,Title,Genre_Name  FROM Book_Details,Genre_list WHERE Book_Details.GenreId=Genre_list.GenreId',function(err,result){
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
   pool.query('SELECT BookId,Title,Description,Genre_Name,AuthorName FROM Book_Details,Genre_list,Author_list WHERE Title=$1 AND Book_Details.GenreId=Genre_list.GenreId AND Book_Details.AuthorId=Author_list.AuthorID',[Title],function(err,result){
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
	pool.query('SELECT Status FROM UserBook_details WHERE userId=$1 AND BookId=$2',[userid,bookid],function(err,result){
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
   pool.query('INSERT INTO UserBook_details(UserId,BookId,Status) VALUES($1,$2,$3)',[req.session.auth.userId,bookid,status],function(err,result){
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
   pool.query('UPDATE UserBook_details SET Status=$1 WHERE BookId=$2',[status,bookid],function(err,result){
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
  pool.query('SELECT UserBook_details.BookId,Book_details.Title FROM UserBook_details,Book_Details WHERE UserId=$1 AND UserBook_details.BookId=Book_Details.BookId ',[userid],function(err,result){
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
today.setDate(today.getDate()+10);
var futureDate= "" + today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();
pool.query('SELECT Book_Details.Title,Book_Details.DateofRelease,Genre_list.Genre_Name FROM UserBook_details,Book_Details,Genre_list WHERE UserBook_details.userId=$1 AND UserBook_details.BookId=Book_Details.BookId AND Book_Details.DateofRelease > $2 AND Book_Details.DateofRelease < $3 AND Book_Details.GenreId=Genre_list.GenreId',[userid,todayDate,futureDate],function(err,result){
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



app.listen(8080,function(){
console.log("Server listening on port 8080");
});
