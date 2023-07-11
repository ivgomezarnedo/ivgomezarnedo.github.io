---
name: InFondos
tools: [AWS DynamoDB, AWS API Gateway, AWS Amplify, Python, React, SQLite]
image: /assets/images/INFONDOS_confondo-blanco.png
description:  A web application that visually presents structured data from the CNMV (equivalent to 13F filings in Spain) in a user-friendly manner. Utilizing graph theory concepts, it compiles and analyzes information and holdings for all Spanish investment funds. This enables users to see which funds hold a specific position, identify overlap in holdings between different funds, and track increases or decreases in those positions. Additionally, the platform generates biannual statistics, offering a comprehensive view of market trends and investment behaviors. 
---


# InFondos<br>
![preview](/assets/images/INFONDOS_confondo-blanco.png)

[InFondos is a web app](https://infondos.com/) that visually presents structured data from the [CNMV](https://www.cnmv.es/Portal/home.aspx) (equivalent to [13F filings](https://www.investor.gov/introduction-investing/investing-basics/glossary/form-13f-reports-filed-institutional-investment) in the US). Drawing from similar concepts as those used by [Dataroma](https://www.dataroma.com/m/home.php), [InFondos](https://infondos.com/) extends this approach to encompass the entire universe of funds and SICAVs in Spain.

Its main features are:
- **Comprehensive Data**: The application provides detailed data on all investment funds and SICAVs registered in Spain.
- **Data Visualization**: By visually presenting structured data from the [CNMV](https://www.cnmv.es/Portal/home.aspx), it allows users to easily understand and interpret complex investment information.
- **Holdings Tracking**: [InFondos](https://infondos.com/) allows users to see which funds hold a specific position and to track any increases or decreases in those positions over time.
- **Investment Opportunities**: [InFondos](https://infondos.com/) is a powerful tool for identifying potential investment opportunities. By studying the holdings of different funds, users can leverage the knowledge and strategy of investment professionals to find promising investment options. This is particularly beneficial for individual investors looking to expand their portfolio based on expert fund management strategies.
- **Overlap Analysis**: Utilizing graph theory concepts, the app identifies overlap in holdings between different funds, allowing users to understand the similarities and differences in fund strategies.
- **Market Trends**: The platform generates biannual statistics, offering users a comprehensive view of market trends and investment behaviors.
- **User-Friendly Interface**: Despite the complex data it manages, [InFondos](https://infondos.com/) offers an interface that is intuitive and easy to navigate, catering to both investment professionals and individual investors.
- **Direct Comparisons**: With [InFondos](https://infondos.com/), users can compare funds side-by-side to make informed decisions about their investments.
- **Updated Information**: [InFondos](https://infondos.com/) maintains up-to-date data by frequently refreshing information based on the latest [CNMV](https://www.cnmv.es/Portal/home.aspx) filings.

<br>



## Technical implementation
Utilizing [AWS Lambda](https://aws.amazon.com/lambda/) functions, web scraping is performed on [CNMV](https://www.cnmv.es/Portal/home.aspx) data to obtain a complete list of funds, including their internal IDs. With this information, additional web scraping is performed to generate (and download) semiannual XML files with data for all the funds.

This data is processed and combined with [OpenFigi](https://www.openfigi.com/api) data to obtain tickers and information about the funds' holdings, as this information is identified only by an ISIN code in the original data. This information is structured and inserted into [SQLite](https://www.sqlite.org/index.html) for easier analysis. Later, using other [AWS Lambda](https://aws.amazon.com/lambda/) functions, this structured data is processed and loaded into [DynamoDB](https://aws.amazon.com/dynamodb/):

![How data is processed and loaded](/assets/images/infondos_once_per_semester.drawio.png)

To access the data stored in [DynamoDB](https://aws.amazon.com/dynamodb/), an API was deployed with [AWS API Gateway](https://aws.amazon.com/api-gateway/). This enables the web application, which consists of only three dynamically loaded pages (Fund, Position, Landing), to display content based on the data returned by the API. The API triggers auxiliary [AWS Lambda](https://aws.amazon.com/lambda/) functions that query the data from [DynamoDB](https://aws.amazon.com/dynamodb/).

The website hosting was set up on [Cloudflare](https://www.cloudflare.com/), as the domain was purchased there and they offer free firewall rules, cache, and rate limiting. The REACT application was deployed using AWS Amplify due to its simplicity:

![Web architecture](/assets/images/infondos_web.drawio.png)


- **Python**
  - **AIOHTTP**: To perform HTTP requests asynchronously.
  - **BeautifulSoup**: To process XML files. 
  - **Pyenchant**: To correct special characters or encoding errors in the files. 
- **REACT**
  - **Bootstrap**: To build the user interface (responsive, community support and grid system). [Flatly](https://bootswatch.com/flatly/) was used as Theme.
  - **pako**: To deal with binary data (GZIP is used by the API to retrieve JSON data). 
  - **React Icons**: To use predefined icons like Search, Mail or Twitter. 
- **SQLite**: To easily structure the data and to facilitate data analysis (Way more cheaper than using AWS Aurora). 
- **Cloudflare**: Way more cheaper than using AWS Aurora. 
- **AWS Lambda**: To run the Python code that extracts, process and serves the data. 
- **AWS DynamoDB**: To store the data that is going to be queried by the API. 
- **AWS API Gateway**: To build the API that the web app is using to dinamycally get the data needed. 
- **AWS Amplify**: To easily deploy the React app.