# MCP Integration Guide for Crunchloop NestJS Todo API

This guide explains how to build, run, and connect an MCP client to the NestJS Todo API project.

## 1. Build the Project

```bash
npm install
npm run build
```

## 2. Running the MCP Server

You can run the MCP server directly from the compiled output:

```bash
node dist/main.js
```

This is the recommended method for MCP integration.

## 3. Example MCP Server Configuration

Add the following entry to your `mcp_config.json` file (adjust the path as needed):

```json
"nestjs-todo-mcp": {
  "command": "node",
  "args": [
    "/home/user/Projects/crunchloop-nestjs-mcp/dist/main.js"
  ]
}
```

## 4. Connecting an MCP Client

- Ensure your MCP client (e.g., Windsurf, Codeium, etc.) is configured to use the above server.
- The server exposes all todo list and todo item features via HTTP-based MCP tools, including guards and middleware.
- Response format is MCP-compliant: `{ content: [{ type: 'text', text: 'response message' }] }`

## 5. Available MCP Tools

- Todo Lists: get, create, update, delete
- Todo List Items: get, create, update, delete

For detailed API usage, refer to the main README or your MCP client documentation.

---

For any issues, ensure the server is built and running from `dist/main.js` and that your MCP client points to the correct configuration.

---

**Note:**
If you make changes to the code and want to test them:
1. Rebuild the project:
   ```bash
   npm run build
   ```
2. Kill the running server (on port 3000) with:
   ```bash
   lsof -t -i :3000 && kill -9 $(lsof -t -i :3000)
   ```
3. Restart the MCP server (`node dist/main.js`)
4. Refresh your MCP client (e.g., Windsurf, Codeium) to reload the server and new tools.
