# NestJS MCP Server for GitHub PR Review

A comprehensive Model Context Protocol (MCP) server built with NestJS and TypeScript for automated GitHub Pull Request review and Notion integration.

## Features

- 🔄 GitHub PR fetching and analysis
- 📝 Notion integration for storing reviews
- 🔌 MCP protocol support for Claude Desktop
- 🚀 Multiple transport modes (STDIO, HTTP, SSE)
- 🧪 Comprehensive testing suite
- 🐳 Docker support

## Quick Start

1. **Install dependencies:**
npm install

2. **Setup environment:**
cp .env.example .env


3. **Run the setup script:**
chmod +x setup.sh
./setup.sh


4. **Start development server:**
npm run start:dev


## MCP Tools Available

- `fetch_pr`: Fetch GitHub PR details and changes
- `create_notion_page`: Create Notion pages with PR analysis

## Claude Desktop Integration

Add to your MCP settings:

{
"github-pr-reviewer": {
"command": "node",
"args": ["dist/main.js"],
"env": {
"GITHUB_TOKEN": "your_token",
"NOTION_API_KEY": "your_key",
"NOTION_PAGE_ID": "your_page_id"
}
}
}


## API Endpoints (HTTP Mode)

- `GET /health` - Health check
- `POST /mcp/list-tools` - List available MCP tools
- `POST /mcp/call-tool` - Execute MCP tool

## Testing

npm run test # Unit tests
npm run test:e2e # End-to-end tests
npm run test:cov # Coverage report


## Docker

docker-compose up -d


## Development

The server supports multiple transport modes:

### STDIO Mode (Default)
Perfect for Claude Desktop integration:


MCP_TRANSPORT=stdio npm run start:prod


### HTTP Mode
For web-based integrations:


MCP_TRANSPORT=http npm run start:prod


## Project Structure

src/
├── app.module.ts # Main application module
├── main.ts # Application entry point
├── github/ # GitHub integration module
│ ├── github.module.ts
│ └── github.service.ts
├── notion/ # Notion integration module
│ ├── notion.module.ts
│ └── notion.service.ts
└── mcp/ # MCP server implementation
├── mcp.module.ts
├── mcp-server.service.ts
├── mcp.controller.ts
└── pr-analyzer.service.ts# mcp-pr-reviewer
