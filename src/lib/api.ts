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
  return config;
});

export default api;
