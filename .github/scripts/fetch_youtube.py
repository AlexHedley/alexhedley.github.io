import json
import sys
import urllib.request
import xml.etree.ElementTree as ET

FEED_URL = "https://www.youtube.com/feeds/videos.xml?channel_id=UC8-LMGGm9CYwBNhY-81xXqA"
OUTPUT = "data/youtube.json"
NS = {
    "a": "http://www.w3.org/2005/Atom",
    "yt": "http://www.youtube.com/xml/schemas/2015",
    "media": "http://search.yahoo.com/mrss/",
}

with urllib.request.urlopen(FEED_URL, timeout=30) as response:
    root = ET.fromstring(response.read())

videos = []
for entry in root.findall("a:entry", NS):
    video_id = entry.findtext("yt:videoId", namespaces=NS)
    if not video_id:
        continue
    thumbnail = entry.find("media:group/media:thumbnail", NS)
    videos.append({
        "id": video_id,
        "title": (entry.findtext("a:title", namespaces=NS) or "YouTube video").strip(),
        "published": entry.findtext("a:published", namespaces=NS),
        "url": "https://www.youtube.com/watch?v=" + video_id,
        "thumbnail": thumbnail.get("url") if thumbnail is not None else None,
    })

if not videos:
    sys.exit("No videos found in feed")

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump({"channelId": "UC8-LMGGm9CYwBNhY-81xXqA", "videos": videos}, f, indent=2)
    f.write("\n")

print("Wrote %d videos to %s" % (len(videos), OUTPUT))
