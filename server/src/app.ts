import { initApp } from "./server";

const PORT = process.env.PORT || 3000;

initApp()
  .then(({ app, server }) => {
    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`WebSocket server running on ws://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize application:", error);
  });
