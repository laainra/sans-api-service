const clientsByURL = {};

function broadcast(url, message) {
  const clients = clientsByURL[url] || [];
  clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
          client.send(message);
      }
  });
}
module.exports = (app) => {
    app.ws('/ws/dashboard/:type', (ws, req) => {
        const { type } = req.params;
        url = "dashboard-"+type;

        if (!clientsByURL[url]) {
            clientsByURL[url] = [];
        }
        clientsByURL[url].push(ws);
        console.log(clientsByURL);
      
        ws.on('message', (msg) => {
            broadcast(type,msg)
        });
      
        ws.on('close', () => {
            clientsByURL[url] = clientsByURL[url].filter((client) => client !== ws);
        });
    });

    app.ws('/ws/:url', (ws, req) => {
        const { url } = req.params;
        
        if (!clientsByURL[url]) {
            clientsByURL[url] = [];
        }
        clientsByURL[url].push(ws);
        console.log(clientsByURL);
      
        ws.on('message', (msg) => {
            broadcast(`dashboard-${url}`,msg)
        });
      
        ws.on('close', () => {
            clientsByURL[url] = clientsByURL[url].filter((client) => client !== ws);
        });
    });
}