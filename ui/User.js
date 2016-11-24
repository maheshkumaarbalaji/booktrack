function loadPage()
{
  var loadingHTML=`
  <input type="submit" id="button1" value="Browse Books"/>
    <input type="submit" id="button2" value="View Profile"/><br>
    <input type="submit" id="button3" value="View Upcoming Books"/>
    <input type="submit" id="logout" value="Logout"/>
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
                <td>${result[i].bookid}</td>
                <td><a href="/browse-books/${result[i].title}">${result[i].title}</a></td>
                <td>${result[i].genre_name}</td>
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
        else if(request.status===500)
        {
            alert("Some error occurred at the server end.");
        }
        else
        {
          alert('Some error occurred. Try again later.');
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
                <p><b><u>Your Readlist has the following BOOKS:</u></b></p>
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
                    <td>${result[i].bookid}</td>
                    <td><a href="/browse-books/${result[i].title}">${result[i].title}</a></td>
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
          else if(request.status===500)
          {
              alert('Some error occurred at the server side.');
          }
          else
          {
            alert('Something went wrong. Try again.'); 
          }
      }
  };
  request.open("GET","/display-profile",true);
  request.send(null);
  };

  var button3=document.getElementById("button3");
  button3.onclick=function(){
  document.getElementById("context_title").innerHTML='Upcoming Books';
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
            <th>Title</th>
            <th>Genre</th>
            <th>Release Date</th>
            </tr>
            `;
            var i;
            for(i=0;i<result.length;i++)
            {
                htmlcontent+=`<tr> 
                <td><a href="/browse-books/${result[i].title}">${result[i].title}</a></td>
                <td>${result[i].genre_name}</td>
                <td>${result[i].dateofrelease}</td>
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
        else if(request.status===500)
        {
            alert("Some error occurred at the server end.");
        }
        else if(request.status===403)
        {
          alert('No new Book releases in the next 10 days.');
        }
        else
        {
          alert('Something went wrong. Try again later.');
        }
    }
  };
  request.open("GET","/upcoming-books",true);
  request.send(null);
  };
  logout=document.getElementById("logout");
  logout.onclick=function()
  {
      document.getElementById("context_title").innerHTML='';
      document.getElementById("context_area").innerHTML=`
      <h2><b>You were logged out successfully!</b></h2><br>
      <p><input type="submit" id="home" value="Homepage"/></p>
      `;
      document.getElementById("home").onclick=function()
      {
          window.location="index.html";
      };
  };

}
loadPage();