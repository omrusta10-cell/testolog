import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { Client } from "ssh2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// SSH Helper
const getSSHClient = (headers: any) => {
  return new Promise<Client>((resolve, reject) => {
    const conn = new Client();
    const config = {
      host: headers["x-ssh-host"],
      port: parseInt(headers["x-ssh-port"] || "22"),
      username: headers["x-ssh-user"],
      password: headers["x-ssh-password"],
      readyTimeout: 40000, // Increase timeout to 40 seconds
      keepaliveInterval: 10000,
      keepaliveCountMax: 3,
    };

    if (!config.host || !config.username) {
      return reject(new Error("SSH credentials missing in headers"));
    }

    console.log(`Attempting SSH connection to ${config.host}:${config.port}...`);

    conn
      .on("ready", () => {
        console.log("SSH Connection Ready");
        resolve(conn);
      })
      .on("error", (err) => {
        console.error("SSH Connection Error:", err.message);
        reject(err);
      })
      .on("timeout", () => {
        console.error("SSH Connection Timeout");
        reject(new Error("SSH Connection Timeout (Handshake failed)"));
      })
      .connect(config);
  });
};

// MySQL Helper
const getDbConnection = async (headers: any) => {
  const config = {
    host: headers["x-db-host"],
    user: headers["x-db-user"],
    password: headers["x-db-password"],
    database: headers["x-db-name"],
    port: parseInt(headers["x-db-port"] || "3306"),
  };

  if (!config.host || !config.user) {
    throw new Error("Database credentials missing in headers");
  }

  return await mysql.createConnection(config);
};

// --- API ROUTES ---

// File Explorer: List Files
app.get("/api/files", async (req, res) => {
  const dirPath = (req.query.path as string) || "/usr/game";
  try {
    const conn = await getSSHClient(req.headers);
    conn.sftp((err, sftp) => {
      if (err) throw err;
      sftp.readdir(dirPath, (err, list) => {
        conn.end();
        if (err) return res.status(500).json({ error: err.message });
        res.json(list.map(item => ({
          name: item.filename,
          isDirectory: item.attrs.isDirectory(),
          size: item.attrs.size,
          mtime: item.attrs.mtime
        })));
      });
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// File Editor: Read File
app.get("/api/files/read", async (req, res) => {
  const filePath = req.query.path as string;
  if (!filePath) return res.status(400).json({ error: "Path required" });

  try {
    const conn = await getSSHClient(req.headers);
    conn.sftp((err, sftp) => {
      if (err) throw err;
      const stream = sftp.createReadStream(filePath);
      let data = "";
      stream.on("data", (chunk) => (data += chunk));
      stream.on("end", () => {
        conn.end();
        res.json({ content: data });
      });
      stream.on("error", (err) => {
        conn.end();
        res.status(500).json({ error: err.message });
      });
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// File Editor: Write File
app.post("/api/files/write", async (req, res) => {
  const { path: filePath, content } = req.body;
  if (!filePath) return res.status(400).json({ error: "Path required" });

  try {
    const conn = await getSSHClient(req.headers);
    conn.sftp((err, sftp) => {
      if (err) throw err;
      sftp.writeFile(filePath, content, (err) => {
        conn.end();
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
      });
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Command Execution (Quest, Build, etc.)
app.post("/api/exec", async (req, res) => {
  const { command, cwd } = req.body;
  try {
    const conn = await getSSHClient(req.headers);
    const fullCommand = cwd ? `cd ${cwd} && ${command}` : command;
    conn.exec(fullCommand, (err, stream) => {
      if (err) throw err;
      let output = "";
      let errorOutput = "";
      stream.on("close", (code: number) => {
        conn.end();
        res.json({ output, errorOutput, code });
      }).on("data", (data: any) => {
        output += data;
      }).stderr.on("data", (data) => {
        errorOutput += data;
      });
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Database: List Tables
app.get("/api/db/tables", async (req, res) => {
  try {
    const db = await getDbConnection(req.headers);
    const [rows] = await db.query("SHOW TABLES");
    await db.end();
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Database: Get Table Data
app.get("/api/db/data", async (req, res) => {
  const table = req.query.table as string;
  if (!table) return res.status(400).json({ error: "Table required" });
  try {
    const db = await getDbConnection(req.headers);
    const [rows] = await db.query(`SELECT * FROM ${table} LIMIT 100`);
    await db.end();
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Test Connection
app.get("/api/test-connection", async (req, res) => {
  try {
    const sshConn = await getSSHClient(req.headers);
    sshConn.end();
    const dbConn = await getDbConnection(req.headers);
    await dbConn.end();
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- VITE MIDDLEWARE ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
