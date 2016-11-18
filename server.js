var express=require('express');
var morgan=require('morgan');
var path=require('path');
var bodyparser=require('body-parser');
var Pool=require('pg').Pool;
var crypto=require('crypto');

var app=express();
app.use(morgan('combined'));
app.use(bodyparser.json());

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
          res.send(200).send('User successfully created!');
      }
   });
});

app.listen(8080,function(){
console.log("Server listening on port 8080");
});