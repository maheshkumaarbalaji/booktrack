function validate(field,value)
{
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
        if(request.readyState===XMLHttpRequest.DONE)
        {
            if(request.status===200)
            {
                document.getElementById(field).innerHTML=this.responseText;
            }
            else if(request.status===403)
            {
                document.getElementById(field).innerHTML='Username already exists';   
            }
            else if(request.status===500)
            {
                document.getElementById(field).innerHTML='Server error';
            }
        }
        request.open("POST","/check-register",true);
        request.setRequestHeader("Content-Type":"application/json");
        request.send(JSON.stringify({"username":value}));  
        document.getElementById(field).innerHTML='Validating...'; 
    };
}