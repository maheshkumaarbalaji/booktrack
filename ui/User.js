var button1=document.getElementById("button1");
button1.onclick=function(){
document.getElementById("context_title").innerHTML='Add/Manage Books';
var request=new XMLHttpRequest();
request.onreadystatechange=function(){
    if(request.readyState===XMLHttpRequest.DONE)
    {
        if(request.status===200)
        {
            var result=JSON.parse(request.responseText);
        }
    }
};
request.open("GET","/browse-books",true);
request.send(null);
};
