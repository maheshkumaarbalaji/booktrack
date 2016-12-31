function validation()
{
    var valid_btn=document.getElementById("valid_btn");
    valid_btn.onclick=function()
    {
        var stat=document.getElementById("status");
        var request=new XMLHttpRequest();
        request.onreadystatechange=function()
        {
            if(request.readyState===XMLHttpRequest.DONE)
            {
                if(request.status===200)
                {
                    valid_btn.innerHTML='Valid';
                    stat.value='valid';
                    valid_btn.disabled=true;
                }
                else if(request.status===403)
                {
                    valid_btn.innerHTML='Invalid';
                    stat.value='invalid';
                    document.getElementById("userid").onfocus=function()
                    {
                        valid_btn.innerHTML='Check Validity';
                    };
                }
                else
                {
                    alert('An error occurred at the server end. Try again.');
                }
            }

        };
        var username=document.getElementById("userid").value;
        request.open("POST","/check-register",true);
        request.setRequestHeader("Content-Type","application/json");
        request.send(JSON.stringify({"username":username}));
        valid_btn.innerHTML='Validating..';
    };
}

validation();