import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/app.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

const clearDevelopmentServiceWorkers = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));

  if ("caches" in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.filter((name) => name.startsWith("festivaltyp-")).map((name) => caches.delete(name)));
  }
};

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.error("Service worker registration failed", error);
    });
  });
} else if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    clearDevelopmentServiceWorkers().catch((error) => {
      console.error("Service worker cleanup failed", error);
    });
  });
}
