function loadLoggedUser()
{
    window.location="userHome.html";  
}

function loadLogin()
{
    var request=new XMLHttpRequest();
    request.onreadystatechange=function()
    {
        if(request.readyState===XMLHttpRequest.DONE)
        {
            if(request.status===200||request.status===304)
            loadLoggedUser();
            else
            loadLoginForm();
        }
    };
    request.open("GET","/check-login",true);
    request.send(null);
}

function loadRegisterForm()
{
    var loginHTML=`<form onsubmit="register();">
    Username:<input type="text" id="username" required><br/>
    Password:<input type="password" id="password" required><br/>
    <input type="submit" id="register_btn" value="Register"><br/><br/>
    </form>
    `;
    document.getElementById("login_area").innerHTML=loginHTML;
}


function loadLoginForm()
{
    var loginHTML=`<form onsubmit="login();">
    Username:<input type="text" id="username" required><br/>
    Password:<input type="password" id="password" required><br/>
    <input type="submit" id="login_btn" value="Login"><br/><br/>
    </form>
    <br/>
    <button type="button" id="register_btn" onclick="loadRegisterForm();">Register Now</button><br/><br/>
    `;
    document.getElementById("login_area").innerHTML=loginHTML;
}
    
    function login()
    {
        var login=document.getElementById("login_btn");
            var username=document.getElementById("username").value;
            var password=document.getElementById("password").value;
            var request=new XMLHttpRequest();
            request.onreadystatechange=function()
            {
                if(request.readyState===XMLHttpRequest.DONE)
                {
                    if(request.status===200||request.status===304)
                        login.value="Success";
                    else if(request.status===403)
                        login.value="Invalid Credentials!";
                    else
                    {
                        alert("Something went wrong with the server! Try again later!");
                        login.value="Login";
                    }
                    loadLogin();
                }
            };
            request.open("POST","/login",true);
            request.setRequestHeader("Content-Type","application/json");
            request.send(JSON.stringify({"username":username,"password":password}));
            login.value="Logging in..";    
        
        
    }
    
    function register()
    {
        var submit=document.getElementById("register_btn");
        var username=document.getElementById("username").value;
        var password=document.getElementById("password").value;
        var request=new XMLHttpRequest();
            request.onreadystatechange=function()
            {
            if(request.readyState===XMLHttpRequest.DONE)
            {
                if(request.status===200||request.status===304)
                {
                    submit.value="Registered";
                    alert('Login with the created credentials to proceed!');
                }
                else
                {
                    alert("Something went wrong with the server! Try again later!");
                    submit.value="Register";
                }
                loadLoginForm();
            }
            };
            request.open("POST","/create-user",true);
            request.setRequestHeader("Content-Type","application/json");
            request.send(JSON.stringify({"username":username,"password":password}));
            submit.value="Creating user..";

    }



loadLoginForm();