var submit=document.getElementById('sub');
submit.onclick=function(){
    var request=new XMLHttpRequest();
request.onreadystatechange=function(){
if(request.readystate==XMLHttpRequest.DONE)
{
if(request.status==200)
{
var comments=request.responseText;
window.prompt(comments);
comments=JSON.parse(comments);
var list='';
for(var i=0;i<comments.length;i++)
{
list+='<li>' + comments[i] + '</li>';
}
var ul=document.getElementById('list');
ul.innerHTML = list;
}
}
};
var Input=document.getElementById('comm');
var comment=Input.value;
request.open('get','http://maheshkumaar.imad.hasura-app.io/submit-comment?comment='+comment,true);
request.send(null);
};

