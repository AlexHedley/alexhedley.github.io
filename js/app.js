var blogDiv = $("#myblog");
var posts = $(blogDiv).children('div').eq(1);
var arrow = $(posts).children('div').eq(0);
var content = $(arrow).children('div').eq(0);
var item = $(content).children('div').eq(0);

function getSafeLink(href, allowMailto) {
    if (!href) {
        return null;
    }

    var link = document.createElement("a");
    link.href = href;
    if (link.protocol === "http:" || link.protocol === "https:" || (allowMailto && link.protocol === "mailto:")) {
        return link.href;
    }
    return null;
}

function appendSafeHtml(parent, html) {
    var parsed = new DOMParser().parseFromString(html, "text/html");
    var allowedElements = ["A", "B", "BLOCKQUOTE", "BR", "CODE", "EM", "H3", "H4", "H5", "I", "IMG", "LI", "OL", "P", "PRE", "S", "STRONG", "U", "UL"];
    var blockedElements = ["IFRAME", "OBJECT", "SCRIPT", "STYLE", "SVG"];

    if (!parsed.body.children.length && /<\/?[a-z][^>]*>/i.test(parsed.body.textContent)) {
        parsed = new DOMParser().parseFromString(parsed.body.textContent, "text/html");
    }

    function appendNodes(source, target) {
        Array.prototype.forEach.call(source.childNodes, function(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                target.appendChild(document.createTextNode(node.nodeValue));
                return;
            }

            if (node.nodeType !== Node.ELEMENT_NODE || blockedElements.indexOf(node.tagName) !== -1) {
                return;
            }

            if (allowedElements.indexOf(node.tagName) === -1) {
                appendNodes(node, target);
                return;
            }

            var element = document.createElement(node.tagName.toLowerCase());
            if (node.tagName === "IMG") {
                var safeImageUrl = getSafeLink(node.getAttribute("src"), false);
                if (safeImageUrl) {
                    element.src = safeImageUrl;
                    element.alt = node.getAttribute("alt") || "";
                    target.appendChild(element);
                }
                return;
            }

            if (node.tagName === "A") {
                var safeHref = getSafeLink(node.getAttribute("href"), true);
                if (safeHref) {
                    element.href = safeHref;
                    element.target = "_blank";
                    element.rel = "noopener noreferrer";
                }
            }
            appendNodes(node, element);
            target.appendChild(element);
        });
    }

    appendNodes(parsed.body, parent);
}

$.ajax({
    url: "https://alexhedley.com/blog/feed.rss",
    type: "GET",
    dataType: "html",
    success: function(data) {
        var xml = "",
        xmlDoc = $.parseXML( data ),
        $xml = $( xmlDoc );
        
        $xml.find( "item" ).each(function(index, elem) {
            var title = $(elem).find( "title" ).text();
            var description = $(elem).find( "description" ).text();
            var link = $(elem).find( "link" ).text();
            var pubDate = $(elem).find( "pubDate" ).text();

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

            var descriptionElement = document.createElement("div");
            descriptionElement.setAttribute("class", "blog-description");
            descriptionElement.appendChild(img);
            appendSafeHtml(descriptionElement, description);
            divElement.appendChild(descriptionElement);

            var readMore = document.createElement("p");
            var a = document.createElement("a");
            var safeLink = getSafeLink(link, false);
            if (safeLink) {
                a.setAttribute("href", safeLink);
                a.setAttribute("target", "_blank");
                a.setAttribute("rel", "noopener noreferrer");
            }
            a.setAttribute("title", "Read full post");
            a.appendChild(document.createTextNode("Read full post"));
            readMore.appendChild(a);
            divElement.appendChild(readMore);

            item.append(divElement);
        });
    },
    error: function(jqXHR, textStatus, errorThrown ){
        console.error(textStatus);
    }
});
