import { hc } from "hono/client";
import type { AppType } from "../../../api/src/index"; // Point to your backend file

// The client now has full autocomplete for all backend routes
export const client = hc<AppType>("http://localhost:3000");
