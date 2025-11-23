import { startServer } from "./presentacion/app";

if (process.env.NODE_ENV !== "test") {
  startServer();
}