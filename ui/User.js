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
            var htmlcontent=`
            <table>
            <tr>
            <th>BookID</th>
            <th>Title</th>
            <th>Genre</th>
            </tr>
            `;
            for(var i=0;i<result.length;i++)
            {
                htmlContent+=`<tr>
                <td>${result[i].BookId}</td>
                <td><a href="/browse-books/${result[i].Title}">${result[i].Title}</a></td>
                <td>${result[i].Genre_Name}</td>
                </tr>
                `;
            }
            htmlcontent+=`</table>
            <br>
            <button type="button" id="button4">Back to Homepage</button>
            <p>&nbsp;</p>
            `;
            document.getElementById("context_area").innerHTML=htmlcontent;
            document.getElementById("button4").onclick=function()
            {
              window.location="userHome.html";  
            };
            
        }
        else
        {
            alert("Some error occurred! Try again later.");
        }
    }
};
request.open("GET","/browse-books",true);
request.send(null);
};

var button2=document.getElementById("button2");
button2.onclick=function()
{
  document.getElementById("context_title").innerHTML='User Profile';
  var request=new XMLHttpRequest();
  request.onreadystatechange=function(){
      if(request.readyState===XMLHttpRequest.DONE)
      {
          if(request.status===200)
          {
                var result=JSON.parse(request.responseText);
                var htmlcontent=`
                <table>
                <tr>
                <th>BookID</th>
                <th>Title</th>
                </tr>
                `;
                for(var i=0;i<result.length;i++)
                {
                    htmlContent+=`<tr>
                    <td>${result[i].BookId}</td>
                    <td><a href="/browse-books/${result[i].Title}">${result[i].Title}</a></td>
                    </tr>
                    `;
                }
                htmlcontent+=`</table>
                <br>
                <button type="button" id="button4">Back to Homepage</button>
                <p>&nbsp;</p>
                `;
                document.getElementById("context_area").innerHTML=htmlcontent;
                document.getElementById("button4").onclick=function()
                {
                    window.location="userHome.html";  
                };
            
          }
          else
          {
              alert('Some error occurred at the server side.');
          }
      }
  };
  request.open("GET","/display-profile",true);
  request.send(null);
};


var button4=document.getElementById("Readlist");
button4.onclick=function()
{
    var str=document.getElementById("bookid").innerHTML;
    var bookid=str.split(':')[1];
    var request=new XMLHttpRequest();
  request.onreadystatechange=function(){
      if(request.readyState===XMLHttpRequest.DONE)
      {
          if(request.status===200)
          {
              button4.value="Added!";
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
button4.onclick=function()
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