# Scripts

## Jira ticket import

Creates Jira issues from `jira_stories_sentinel.json`.

### Setup

1. Install dependencies (includes `dotenv`):
   ```bash
   npm install
   ```

2. Create a `.env` in the **project root** with:
   ```
   JIRA_DOMAIN=your-domain.atlassian.net
   JIRA_EMAIL=your-email@example.com
   JIRA_API_TOKEN=your-api-token
   JIRA_PROJECT_KEY=KAN
   ```

3. Put your stories in `scripts/jira_stories_sentinel.json` (array of objects with `title`, `description`, and optional `module`, `riskLevel`, `dependency`, `jiraId`, `acceptanceCriteria`).

### Run

From project root:

```bash
npm run jira:import
```

Or:

```bash
node scripts/create-jira-tickets.js
```
