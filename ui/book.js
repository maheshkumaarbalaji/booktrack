function loadvalue()
{
      var Req=new XMLHttpRequest();
      var str=document.getElementById("bookid").innerHTML;
      var bookid=parseInt(str.split(':')[1]);
      var button4=document.getElementById("Readlist");
      var button5=document.getElementById("MarkRead");
      Req.onreadystatechange=function(){
          if(Req.readyState===XMLHttpRequest.DONE)
          {
            if(Req.status===200)
            {
                button4.value="Added!";
                button4.disabled=true;
                var result=JSON.parse(this.responseText);
                if(result.status==='R')
                {
                  button5.value="Completed!";
                  button5.disabled=true;
                }
                else
                  button5.value="Mark as Read";
            }
            else 
            {
              button4.value="Add to ReadList";
              button5.value="Mark as Read";
            }
        }
      };
      Req.open("POST","/userbook-details",true);
      Req.setRequestHeader("Content-Type","application/json");
      Req.send(JSON.stringify({"bookid":bookid}));    
}
function loadPage()
{
	 var button4=document.getElementById("Readlist");
  	button4.onclick=function()
  	{
      var str=document.getElementById("bookid").innerHTML;
      var bookid=str.split(':')[1];
      var request=new XMLHttpRequest();
      request.onreadystatechange=function()
      {
        if(request.readyState===XMLHttpRequest.DONE)
        {
          if(request.status===200)
          {
            button4.value="Added!";
            button4.disabled=true;
          }
          else
          {
            alert('Some error occurred at the server end.');
            button4.value="Readlist";
          }
        }
      };
      request.open("GET","/add-book?bookid=" + bookid,true);
      request.send(null);
      button4.value="Adding..";      
    };

  var button5=document.getElementById("MarkRead");
  button5.onclick=function()
  {
    var str=document.getElementById("bookid").innerHTML;
    var bookid=str.split(':')[1];
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
      if(request.readyState===XMLHttpRequest.DONE)
      {
          if(request.status===200)
          {
              button5.value="Marked!";
              button5.disabled=true;
          }
          else
          {
              alert('Some error occurred at the server end.');
              button5.value="MarkRead";
          }
      }
    };
    request.open("GET","/mark-book?bookid=" + bookid,true);
    request.send(null);
    button5.value="Updating..";    
  };
  document.getElementById("Home").onclick=function()
  {
  		window.location="/userHome.html";
  };
}
loadvalue();
loadPage();
