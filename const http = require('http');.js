const http = require('http');
const https = require('https');
const url = require('url');

// Create a server
const server = http.createServer(handleRequest);

// Define the request handler function
function handleRequest(req, res) {
  // Parse the requested URL
  const requestedUrl = url.parse(req.url, true);
  const path = requestedUrl.pathname;

  // Extract the target URL from the query parameters
  const targetUrl = requestedUrl.query.url;

  if (path === '/fetch') {
    // Check if the target URL is provided
    if (!targetUrl) {
      res.statusCode = 400;
      res.end('Please provide a target URL');
      return;
    }

    // Send a request to the target URL
    const protocol = targetUrl.startsWith('https') ? https : http;
    protocol.get(targetUrl, (response) => {
      let responseData = '';

      // Receive the response data
      response.on('data', (chunk) => {
        responseData += chunk;
      });

      // Send the response back to the browser
      response.on('end', () => {
        res.statusCode = response.statusCode;
        res.setHeader('Content-Type', response.headers['content-type']);
        res.end(responseData);
      });
    }).on('error', (error) => {
      res.statusCode = 500;
      res.end(`Error retrieving data from ${targetUrl}: ${error.message}`);
    });
  } else {
    // Return a 404 Not Found response for all other paths
    res.statusCode = 404;
    res.end('Not Found');
  }
}

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
