var submit=document.getElementById('sub');
var request=new XMLHttpRequest();
submit.onclick=function(){
request.onreadystatechange=function(){
if(request.readystate==XMLHttpRequest.DONE)
{
if(request.status==200||request.status==304)
{
var comments=request.responseText;
comments=JSON.parse(comments);
var list=' ';
for(var i=0;i<comments.length;i++)
{
list+='<li>'+comments[i]+'</li>';
}
var ul=document.getElementById('ul');
ul.innerHTML=list;
}
}
};
var Input=document.getElementById('comm');
var comment=Input.value;
request.open('get','http://maheshkumaar.imad.hasura-app.io/submit-comment?comment='+comment,true);
request.send(null);
};

