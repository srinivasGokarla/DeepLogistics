const http = require('http');
const axios = require('axios');
const cheerio = require('cheerio');

async function fetchLatestStories() {
  try {
    const response = await axios.get('https://time.com/');
    const $ = cheerio.load(response.data);
    const latestStories = [];

    
    $('.tout__list-item').each((index, element) => {
      if (index < 6) { 
        
        const title = $(element).find('.headline').text().trim();
        const link = $(element).find('.tout__list-item-link').attr('href');
        latestStories.push({ title, link });
      }
    });

    return latestStories;
  } catch (error) {
    console.error('Error fetching latest stories:', error);
    return [];
  }
}


const server = http.createServer(async (req, res) => {
  
  if (req.url === '/getTimeStories' && req.method === 'GET') {
    try {
      const latestStories = await fetchLatestStories();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(latestStories));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(8000, () => {
  console.log('Server running at http://localhost:8000/');
});

