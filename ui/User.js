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
                <td>${result[i].Genre}</td>
                </tr>
                `;
            }
            htmlcontent+=`</table>
            <br>
            <button type="button" id="button4">Back to Homepage</button>
            <p>&nbsp;</p>
            <button type="button" id="button5">Next 10 Books</button>
            `;
            document.getElementById("context_area").innerHTML=htmlcontent;
        }
        else
        {
            alert("Some error occurred! Try again later.")
        }
    }
};
request.open("GET","/browse-books",true);
request.send(null);
};
