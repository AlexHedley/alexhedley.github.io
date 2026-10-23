(function () {
    const feedUrl = "https://www.youtube.com/feeds/videos.xml?channel_id=UC8-LMGGm9CYwBNhY-81xXqA";
    const maxVideos = 5;

    document.addEventListener("DOMContentLoaded", loadVideos);

    async function loadVideos() {
        const status = document.getElementById("youtube-status");
        const carousel = document.getElementById("youtube-videos");
        const controls = document.getElementById("youtube-controls");

        try {
            const response = await fetch(feedUrl);
            if (!response.ok) {
                throw new Error("Unable to load YouTube feed");
            }

            const xml = new DOMParser().parseFromString(await response.text(), "application/xml");
            if (xml.getElementsByTagName("parsererror").length > 0) {
                throw new Error("Unable to parse YouTube feed");
            }

            const entries = Array.from(xml.getElementsByTagNameNS("*", "entry"));
            const videos = entries
                .map(function (entry) {
                    const idElement = entry.getElementsByTagNameNS("*", "videoId")[0];
                    const titleElement = entry.getElementsByTagNameNS("*", "title")[0];
                    const id = idElement && idElement.textContent.trim();
                    return id && /^[\w-]{11}$/.test(id)
                        ? { id: id, title: titleElement ? titleElement.textContent.trim() : "YouTube video" }
                        : null;
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
