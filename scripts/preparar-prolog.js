import { copyFileSync, mkdirSync } from "node:fs";

// Copia Prolog y su licencia a la carpeta pública.
const destino = new URL("../public/vendor/", import.meta.url);
mkdirSync(destino, { recursive: true });
copyFileSync(
  new URL("../node_modules/tau-prolog/modules/core.js", import.meta.url),
  new URL("tau-prolog.js", destino),
);
copyFileSync(
  new URL("../node_modules/tau-prolog/LICENSE", import.meta.url),
  new URL("tau-prolog-LICENSE.txt", destino),
);
