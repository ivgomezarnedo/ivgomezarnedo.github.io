---
name: Data Cyborg Bot
tools: [Reddit API, Twitter API, Python, AWS Lambda, FFmpeg]
image: /assets/images/data_cyborg_2.png
description:  A Twitter bot that curates and shares the most upvoted software engineering content from Reddit, combined with personal insights and discoveries. 
---


# Data Cyborg bot<br>
{% capture description %}
I created [@data_cyborg](https://twitter.com/data_cyborg) to help me stay updated on software engineering news, opinions, tutorials, and insights from industry experts.<br><br>
 The project combines the best of both worlds, Twitter and Reddit, by utilizing a bot that fetches the most upvoted posts from various software engineering-related subreddits and shares them on a dedicated Twitter account. This way, I can follow a curated reading list based on popular content from the subreddits I'm interested in, while also helping others with similar interests discover valuable resources. Additionally, I use the [Data Cyborg](https://twitter.com/data_cyborg) account to share content I find interesting, resulting in a mix of automated and human-curated content.<br><br> 
 The name ["Data Cyborg"](https://twitter.com/data_cyborg) reflects this unique combination of robot (the bot) and human (my personal curation) contributions.

{% endcapture %}
<div class="content-container">
  <div class="text-container">
    {{ description | markdownify }}
    <br>
  </div>
  <div class="gif-container">
    {% raw %}<img src="/assets/images/data_cyborg_2.png" alt="Quiniela_perfecta video">{% endraw %}
  </div>
</div>



### How it works?
A Lambda function runs several times a day with varying parameters, including the subreddit to track and the threshold score for filtering posts. Each execution queries the Reddit API for the specified subreddit and filters posts based on the threshold score.<br><br>

Next, the Lambda function compares the post ID with previously processed posts (stored in an S3 JSON file containing posts from the last three days) and selects only new posts for processing.<br><br>

- For image-based posts, the image is processed with **ffmpeg** to meet Twitter's format and size requirements.
- For video posts, **ffmpeg** is also used to combine and convert video and audio into the [format expected by Twitter](https://twittercommunity.com/t/video-track-is-not-present-uploading-mp4/103570/4).<br><br>

The text of the post is extracted and trimmed to fit within Twitter's 240-character limit, considering the inclusion of the post URL and a hashtag identifying the subreddit.<br><br>

Finally, the tweet is published using Tweepy. If the tweet is successfully published, the post ID is added to the JSON file, which is then uploaded back to S3. This ensures that only unprocessed posts are considered in future Lambda runs.<br><br>
## Technical implementation

![technical_diagram](/assets/images/Lambda-reddit-twitter-s3.drawio.png)


Project built entirely using the [AWS Free Tier](https://aws.amazon.com/free/).
- **Python**
  - **AIOHTTP**: To perform HTTP requests asynchronously.
  - **FFmpeg**: To transform the media files downloaded from Reddit into a format compatible with Twitter. 
  - **Tweepy**: To deal with the Twitter API.
- **Reddit API**: To get the data from Reddit. 
- **Twitter API**: To publish the data to Twitter (and to ensure that something is not posted twice). 