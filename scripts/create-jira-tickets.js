const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const JIRA_DOMAIN = process.env.JIRA_DOMAIN;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY;

if (!JIRA_DOMAIN || !JIRA_EMAIL || !JIRA_API_TOKEN || !JIRA_PROJECT_KEY) {
    console.error('Error: Please set JIRA_DOMAIN, JIRA_EMAIL, JIRA_API_TOKEN, and JIRA_PROJECT_KEY in your .env file');
    process.exit(1);
}

const storiesPath = path.join(__dirname, 'jira_stories_sentinel.json');
const stories = JSON.parse(fs.readFileSync(storiesPath, 'utf8'));

const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');

const createJiraIssue = (story) => {
    return new Promise((resolve, reject) => {
        let summary = story.title;
        if (!summary && story.description) {
            summary = story.description.split('.')[0];
            if (summary.length > 255) summary = summary.substring(0, 252) + '...';
        }
        if (!summary) summary = 'No Title';

        let descriptionBody = story.description || '';

        if (story.module) descriptionBody += `\n\n*Module:* ${story.module}`;
        if (story.riskLevel) descriptionBody += `\n*Risk Level:* ${story.riskLevel}`;
        if (story.dependency) descriptionBody += `\n*Dependency:* ${story.dependency}`;
        if (story.jiraId) descriptionBody += `\n*Ref ID:* ${story.jiraId}`;

        if (story.acceptanceCriteria && Array.isArray(story.acceptanceCriteria) && story.acceptanceCriteria.length > 0) {
            descriptionBody += `\n\n*Acceptance Criteria:*\n${story.acceptanceCriteria.map(ac => `- ${ac}`).join('\n')}`;
        }

        const data = JSON.stringify({
            fields: {
                project: { key: JIRA_PROJECT_KEY },
                summary: summary,
                description: {
                    type: 'doc',
                    version: 1,
                    content: [
                        {
                            type: 'paragraph',
                            content: [{ type: 'text', text: descriptionBody }]
                        }
                    ]
                },
                issuetype: { name: 'Task' }
            }
        });

        const options = {
            hostname: JIRA_DOMAIN,
            path: '/rest/api/3/issue',
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = https.request(options, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => { responseBody += chunk; });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(responseBody));
                } else {
                    reject({
                        statusCode: res.statusCode,
                        body: responseBody,
                        summary: summary
                    });
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
};

const runImport = async () => {
    console.log(`Starting import of ${stories.length} stories to Jira project ${JIRA_PROJECT_KEY}...`);

    for (const story of stories) {
        let summary = story.title || (story.description && story.description.split('.')[0]) || 'No Title';
        try {
            console.log(`Creating: ${summary}...`);
            const result = await createJiraIssue(story);
            console.log(`✅ Created ${result.key}`);
        } catch (error) {
            console.error(`❌ Failed to create ${summary}`);
            if (error.body) console.error(`Response: ${error.body}`);
            else console.error(error);
        }
    }
    console.log('Import complete.');
};

runImport();
