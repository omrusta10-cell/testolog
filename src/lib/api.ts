import axios from "axios";

const api = axios.create();

api.interceptors.request.use((config) => {
  const creds = localStorage.getItem("game_panel_creds");
  if (creds) {
    const parsed = JSON.parse(creds);
    config.headers["x-ssh-host"] = parsed.sshHost;
    config.headers["x-ssh-port"] = parsed.sshPort;
    config.headers["x-ssh-user"] = parsed.sshUser;
    config.headers["x-ssh-password"] = parsed.sshPassword;
    config.headers["x-db-host"] = parsed.dbHost;
    config.headers["x-db-port"] = parsed.dbPort;
    config.headers["x-db-user"] = parsed.dbUser;
    config.headers["x-db-password"] = parsed.dbPassword;
    config.headers["x-db-name"] = parsed.dbName;
  }

  // Include SSH paths
  const sshPaths = localStorage.getItem("mt2_ssh_paths");
  if (sshPaths) {
    const parsedPaths = JSON.parse(sshPaths);
    if (parsedPaths.game_dir) config.headers["x-game-path"] = parsedPaths.game_dir;
    if (parsedPaths.mysql_dir) config.headers["x-mysql-path"] = parsedPaths.mysql_dir;
    if (parsedPaths.log_dir) config.headers["x-log-path"] = parsedPaths.log_dir;
  }

  // Pass table mappings for stats
  const mappings = localStorage.getItem("mt2_table_mappings");
  if (mappings) {
    const parsedMappings = JSON.parse(mappings);
    if (parsedMappings.player) config.headers["x-player-table"] = parsedMappings.player;
  }

  // Apply table mappings if the request is for /api/db/data or /api/db/query
  if (mappings && config.url?.includes("/api/db/data")) {
    const parsedMappings = JSON.parse(mappings);
    // Parse URL params
    const url = new URL(config.url, window.location.origin);
    const table = url.searchParams.get("table");
    if (table && parsedMappings[table]) {
      url.searchParams.set("table", parsedMappings[table]);
      config.url = url.pathname + url.search;
    }
  }

  return config;
});

export default api;
