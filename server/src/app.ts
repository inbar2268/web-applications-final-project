import { initApp } from "./server";

const PORT = process.env.PORT || 5000;
const PORT_HTTPS = process.env.PORT_HTTPS || 443;

initApp()
  .then(({ server }) => {
    const port = process.env.NODE_ENV !== "production" ? PORT : PORT_HTTPS;
    server.listen(port, () => {
      if (process.env.NODE_ENV !== "production") {
        console.log(`Server running at http://localhost:${port}`);
        console.log(`WebSocket server running on ws://localhost:${port}`);
      } else {
        console.log(`HTTPS Server running on port ${port}`);
        console.log(`Secure WebSocket server running on wss://node68.cs.colman.ac.il:${port}`);
      }
    });
  })
  .catch((error) => {
    console.error("Failed to initialize application:", error);
  });