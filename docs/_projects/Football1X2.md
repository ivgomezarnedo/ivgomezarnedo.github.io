---
name: Football1X2
tools: [C#, Xamarin, Python, AWS Lambda, SQLite, Web Scraping]
image: /feature_graphic_f1x2.png
description: This project has an individual showcase page, not just a direct link to the project site or repo. Now you have more space to describe your awesome project!
---

<p class="text-left">
{% include elements/button.html link="https://play.google.com/store/apps/details?id=com.produccionesgs.Football1X2" text="See on Google Play" %}
</p>

# Football1X2 app
Football1X2 is a [free Android app](https://play.google.com/store/apps/details?id=com.produccionesgs.Football1X2) (IOS version coming soon) that aggregates and presents updated match information for over 10 top leagues. The app collects data from over a dozen trusted bookmakers to provide insights into the predicted outcomes of football matches:
- Home team victory: **1**.
- Draw: **X**
- Home team defeat: **2**.

![preview](/feature_graphic_f1x2.png)


As I worked on developing **Quiniela Perfecta**, I came to the realization that I was gathering a large amount of data, but only utilizing a fraction of it. In my search for similar options, I found that many available apps were vague about the origin of their data. This is where **Football1X2** sets itself apart, as we source our data directly from the most reputable and reliable sources - the bookmakers themselves.


The use of bookmakers data is crucial in providing accurate predictions. Bookmakers have access to extensive information and data about the teams and players involved in a match, which they use to make informed predictions. Additionally, bookmakers have financial incentives to provide accurate predictions, making their data more reliable than other sources. Unlike popular opinions, which can be influenced by emotions, team loyalty, and personal biases, bookmakers' predictions are based on objective data analysis.

### How it works?

With Football1X2, users can view a graphical representation of the odds for each match, which tracks the probability of each outcome as it evolves over time. The app allows users to easily browse matches across multiple leagues, and select a preferred league to display by default.
![evolutive_graphic](/f1x2_evolutive.jpeg)

<p class="text-center">
{% include elements/button.html link="https://medium.com/@ivangomezarnedo/how-to-use-expected-value-in-a-lottery-ae868726dd1e" text="Learn More (English)" %}
</p>
<p class="text-center">
{% include elements/button.html link="https://medium.com/@ivangomezarnedo/how-to-use-expected-value-in-a-lottery-ae868726dd1e" text="Learn More (Spanish)" %}
</p>


## Technical implementation

![technical_diagram](/Lambda-telegram-scraping-s3.jpg)
Project built entirely using the [AWS Free Tier](https://aws.amazon.com/free/).
- **Python**
  - **BeautifulSoap**: Web scraping.
  - **Fuzzy-search**: Teams could have different names in different bookmakers (i.e., *Real Madrid* and *R. Madrid*). Fuzzy-search have been used to univocally identify a match across several bookmakers.
  - **Sklearn**: To predict the revenue/collection of the Quiniela. Historical data has been used to train the model. 
- **SQLite**: Way more cheaper than using AWS Aurora. 
- **C# + Xamarin**: Mobile app. 95% of the code equal for Android and IOS. 