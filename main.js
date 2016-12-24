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
            var username=document.getElementById("username").value;
            var password=document.getElementById("password").value;
            var name=new RegExp("^\w{1,20}$");
          /*  if(username===""||password===""||!name.test(username))
                {
                    alert('Invalid username or password.');
                    return;
                }
*/
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
        
        
    };
    var submit=document.getElementById("register_btn");
    submit.onclick=function()
    {
        var username=document.getElementById("username").value;
        var password=document.getElementById("password").value;
        var naam=new RegExp("^\w{1,20}$");
  /*          if(username===""||password===""||!naam.test(username))
                {
                    alert('Invalid username or password.');
                    return;
                }  */
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

    };
}


loadLoginForm();