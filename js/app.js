var blogDiv = $("#myblog");
var posts = $(blogDiv).children('div').eq(1);
var arrow = $(posts).children('div').eq(0);
var content = $(arrow).children('div').eq(0);
var item = $(content).children('div').eq(0);

$.ajax({
    url: "https://alexhedley.com/blog/feed.rss",
    type: "GET",
    dataType: "html",
    success: function(data) {
        var xml = "",
        xmlDoc = $.parseXML( data ),
        $xml = $( xmlDoc );
        
        $xml.find( "item" ).each(function(index, elem) {
            // var item = $.parseXML( elem.outerHTML );

            var title = $(elem).find( "title" ).text();
            var description = $(elem).find( "description" ).text();
            var link = $(elem).find( "link" ).text();
            var pubDate = $(elem).find( "pubDate" ).text();

            console.log(title);
            console.log(description);
            console.log(link);
            console.log(pubDate);

            var divElement = document.createElement("div");
            divElement.setAttribute("class", "col1-fluid");

            // Heading 1 - Title
            var h1 = document.createElement("h1");
            var heading = document.createTextNode(title);
            h1.appendChild(heading);
            divElement.appendChild(h1);

            // Heading 2 - Date
            var h2 = document.createElement("h2");
            var date = document.createTextNode(new Date(pubDate).toLocaleDateString());
            h2.appendChild(date);
            divElement.appendChild(h2);

            var img = document.createElement("img");
            img.setAttribute("src", "images/quote.png");
            img.setAttribute("alt", "Blog");
            img.setAttribute("class", "floated");

            var p = document.createElement("p");
            p.appendChild(img);

            var content = document.createTextNode(description);
            p.appendChild(content);

            var a = document.createElement("a");
            a.setAttribute("href", link);
            a.setAttribute("target", "_blank");
            a.setAttribute("title", "Read full post");

            var linkText = document.createTextNode("Read full post");
            a.appendChild(linkText);
            p.appendChild(a);

            divElement.appendChild(p);

            // item.appendChild(divElement);
            item.append(divElement);
        });
    },
    error: function(jqXHR, textStatus, errorThrown ){
        console.error(textStatus);
    }
});
