---
name: Football1X2
tools: [C#, Xamarin, Python, AWS Lambda, SQLite, Web Scraping]
image: /assets/images/feature_graphic_f1x2.png
description: Football1X2 is an app that aggregates and presents updated match information for over 10 top leagues. The app collects data from over a dozen trusted bookmakers to provide insights into the predicted outcomes of football matches.
---

<p class="text-left">
{% include elements/button.html link="https://play.google.com/store/apps/details?id=com.produccionesgs.Football1X2" text="Google Play" %}
</p>

# Football1X2 app<br>
Football1X2 is a [free Android app](https://play.google.com/store/apps/details?id=com.produccionesgs.Football1X2) (IOS version coming soon) that aggregates and presents updated match information for over 10 top leagues. The app collects data from over a dozen trusted bookmakers to provide insights into the predicted outcomes of football matches:
- Home team victory: **1**.
- Draw: **X**
- Home team defeat: **2**.

![preview](/assets/images/feature_graphic_f1x2.png)


As I worked on developing [Quiniela Perfecta](/projects/quinielaperfecta), I came to the realization that I was gathering a large amount of data, but only utilizing a fraction of it. In my search for similar options, I found that many available apps were vague about the origin of their data. This is where **Football1X2** sets itself apart, as we source our data directly from the most reputable and reliable sources - the bookmakers themselves.


The use of bookmakers data is crucial in providing accurate predictions. Bookmakers have access to extensive information and data about the teams and players involved in a match, which they use to make informed predictions. Additionally, bookmakers have financial incentives to provide accurate predictions, making their data more reliable than other sources. Unlike popular opinions, which can be influenced by emotions, team loyalty, and personal biases, bookmakers' predictions are based on objective data analysis.<br><br><br>

{% capture heading %}
### How it works?
{% endcapture %}

{% capture description %}

With Football1X2, users can view a graphical representation of the odds for each match, which tracks the probability of each outcome (1-X-2) as it evolves over time.<br>
The app allows users to easily browse matches across multiple leagues, and select a preferred league to display by default.

{% endcapture %}

<div class="content-container">
  <div class="text-container">
    {{ heading | markdownify }}
    {{ description | markdownify }}
    <br>
  <p class="text-center">
{% include elements/button.html link="https://medium.com/@ivangomezarnedo/how-to-use-expected-value-in-a-lottery-ae868726dd1e" text="Learn More" %}
</p>
  </div>
  <div class="gif-container">
    {% raw %}<img src="/assets/images/f1x2_evolutive.jpeg" alt="Evolutive graphic">{% endraw %}
  </div>
</div>


## Technical implementation

![technical_diagram](/assets/images/architecture_qp.jpg)
Project built entirely using the [AWS Free Tier](https://aws.amazon.com/free/).
- **Python**
  - **AIOHTTP**: To perform HTTP requests asynchronously.
  - **BeautifulSoap**: Web scraping.
  - **Fuzzy-search**: Teams could have different names in different bookmakers (i.e., *Real Madrid* and *R. Madrid*). Fuzzy-search have been used to univocally identify a match across several bookmakers.
  - **Sklearn**: To predict the revenue/collection of the Quiniela. Historical data has been used to train the model. 
- **SQLite**: Way more cheaper than using AWS Aurora. 
- **C# + Xamarin**: Mobile app. 95% of the code equal for Android and IOS. 