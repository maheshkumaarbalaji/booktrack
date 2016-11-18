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
                <td>${result[0].BookId}</td>
                <td><a href="/browse-books/${result[0].Title}">${result[0].Title}</a></td>
                <td>${result[0].Genre}</td>
                </tr>
                `;
            }
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
