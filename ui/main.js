function loadLoginForm()
{
    var loginHTML=`
    Username:<input type="text" id="username"/><br/>
    Password:<input type="password" id="password"/><br/>
    <input type="submit" id="login_btn" value="Login"/>
    <input type="submit" id="register_btn" value="Register"/><br/><br/>
    `;
    document.getElementById("login_area").innerHTML=loginHTML;

    var login=document.getElementById("login_btn");
    login.onclick=function()
    {
        var request=new XMLHttpRequest();
        request.onreadystatechange=function()
        {
            if(request.readyState===XMLHttpRequest.DONE)
            {
                if(request.status===200)
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
        var username=document.getElementById("username").value;
        var password=document.getElementById("password").value;
        request.open("POST","/login",true);
        request.setRequestHeader("Content-Type","application/json");
        request.send(JSON.stringify({"username":username,"password":password}));
        login.value="Logging in..";
    };
    var submit=document.getElementById("register_btn");
    submit.onclick=function()
    {
        var request=new XMLHttpRequest();
        request.onreadystatechange=function()
        {
            if(request.readyState===XMLHttpRequest.DONE)
            {
                if(request.status===200)
                submit.value="Registered";
                else
                {
                    alert("Something went wrong with the server! Try again later!");
                    submit.value="Register";
                }
            }
        };
        var username=document.getElementById("username").value;
        var password=document.getElementById("password").value;
        request.open("POST","/create-user",true);
        request.setRequestHeader("Content-Type","application/json");
        request.send(JSON.stringify({"username":username,"password":password}));
        submit.value="Creating user..";
    };
}

function loadLoggedUser(username)
{
    var loginHTML=`<h4>Welcome ${username}</h4>
    <a href="/logout">Logout</a>
    `;
    document.getElementById("login_area").innerHTML=loginHTML;
}

function loadLogin()
{
    var request=new XMLHttpRequest();
    request.onreadystatechange=function()
    {
        if(request.readystate===XMLHttpRequest.DONE)
        {
            if(request.status===200)
            loadLoggedUser(this.responseText);
            else
            loadLoginForm();
        }
    };
}

loadLoginForm();