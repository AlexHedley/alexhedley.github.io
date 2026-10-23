(function () {
    const feedUrl = "https://www.youtube.com/feeds/videos.xml?channel_id=UC8-LMGGm9CYwBNhY-81xXqA";
    const feedApiUrl = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(feedUrl);
    const maxVideos = 5;

    document.addEventListener("DOMContentLoaded", loadVideos);

    async function loadVideos() {
        const status = document.getElementById("youtube-status");
        const carousel = document.getElementById("youtube-videos");
        const controls = document.getElementById("youtube-controls");

        try {
            const response = await fetch(feedApiUrl);
            if (!response.ok) {
                throw new Error("Unable to load YouTube feed");
            }

            const feed = await response.json();
            const videos = (feed.items || [])
                .map(function (item) {
                    const id = getVideoId(item.link);
                    return id ? { id: id, title: item.title || "YouTube video" } : null;
                })
                .filter(Boolean)
                .slice(0, maxVideos);

            if (videos.length === 0) {
                status.textContent = "No recent videos are available.";
                return;
            }

            videos.forEach(function (video, index) {
                carousel.appendChild(createSlide(video, index));
            });

            const position = document.getElementById("youtube-position");
            let currentIndex = 0;

            function showVideo(index) {
                currentIndex = (index + videos.length) % videos.length;
                Array.from(carousel.children).forEach(function (slide, slideIndex) {
                    slide.hidden = slideIndex !== currentIndex;
                });
                position.textContent = "Video " + (currentIndex + 1) + " of " + videos.length;
            }

            document.getElementById("youtube-previous").addEventListener("click", function () {
                showVideo(currentIndex - 1);
            });
            document.getElementById("youtube-next").addEventListener("click", function () {
                showVideo(currentIndex + 1);
            });

            showVideo(0);
            status.hidden = true;
            carousel.hidden = false;
            controls.hidden = videos.length < 2;
        } catch (error) {
            status.textContent = "Unable to load videos right now. Visit the YouTube channel above.";
        }
    }

    function getVideoId(link) {
        try {
            const url = new URL(link);
            if (!["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(url.hostname)) {
                return null;
            }

            const id = url.hostname === "youtu.be" ? url.pathname.slice(1) : url.searchParams.get("v");
            return id && /^[\w-]{11}$/.test(id) ? id : null;
        } catch (error) {
            return null;
        }
    }

    function createSlide(video, index) {
        const slide = document.createElement("article");
        slide.hidden = index !== 0;

        const iframe = document.createElement("iframe");
        iframe.src = "https://www.youtube-nocookie.com/embed/" + video.id;
        iframe.title = video.title;
        iframe.loading = "lazy";
        iframe.allow = "accelerometer; autoplay; encrypted-media; picture-in-picture; web-share";
        iframe.setAttribute("allowfullscreen", "allowfullscreen");

        const title = document.createElement("h2");
        const link = document.createElement("a");
        link.href = "https://www.youtube.com/watch?v=" + video.id;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = video.title;

        title.appendChild(link);
        slide.appendChild(iframe);
        slide.appendChild(title);
        return slide;
    }
})();
