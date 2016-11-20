function loadPage()
{
  var loadingHTML=`
  <input type="submit" id="button1" value="Browse Books"/>
    <input type="submit" id="button2" value="View Profile"/><br>
    <input type="submit" id="button3" value="View Upcoming Books"/>
    <hr>
    <h2>Button Illustrations</h2>
    
        <ul>
            <li><b>Browse Books:</b> Browse through the various novels available and add books that you would like to read or mark those that you have read.</li>
            <li><b>View Profile:</b> Take a view of all the books in differenet genres that you have read or not read but added to your read list and 
            those books that you read recently.</li>
            <li><b>View Upcoming Books:</b>Take a look at all the books in your favourite genres that are to be released within the next 10 days.</li>
        </ul>
  `;
    document.getElementById("context_area").innerHTML=loadingHTML;
  var button1=document.getElementById("button1");
  button1.onclick=function(){
  document.getElementById("context_title").innerHTML='Add/Manage Books';
  var request=new XMLHttpRequest();
  request.onreadystatechange=function()
  {
    if(request.readyState===XMLHttpRequest.DONE)
    {
        if(request.status===200||request.status===304)
        {
           var result=JSON.parse(this.responseText);
            var htmlcontent=`
            <table>
            <tr>
            <th>BookID</th>
            <th>Title</th>
            <th>Genre</th>
            </tr>
            `;
            var i;
            for(i=0;i<result.length;i++)
            {
                htmlcontent+=`<tr>
                <td>${result[i].BookId}</td>
                <td><a href="/browse-books/${result[i].Title}">${result[i].Title}</a></td>
                <td>${result[i].Genre_Name}</td>
                </tr>
                `;
            }
            htmlcontent+=`</table>
            <br>
            <input type="submit" id="button4" value="Homepage"/>
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
                var result=JSON.parse(this.responseText);
                var htmlcontent=`
                <table>
                <tr>
                <th>BookID</th>
                <th>Title</th>
                </tr>
                `;
                var i;
                for(i=0;i<result.length;i++)
                {
                    htmlcontent+=`<tr>
                    <td>${result[i].BookId}</td>
                    <td><a href="/browse-books/${result[i].Title}">${result[i].Title}</a></td>
                    </tr>
                    `;
                }
                htmlcontent+=`</table>
                <br>
                <input type="submit" id="button4" value="Back to Homepage"/>
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
}
loadPage();