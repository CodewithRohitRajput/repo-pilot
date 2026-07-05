# AI_NOTES.md

## AI Tools Used

This project was developed with the assistance of ChatGPT (GPT-5.5).

AI was primarily used for:

- Debugging OAuth integration
- Understanding GitHub Webhooks
- Designing MongoDB schemas
- Slack Webhook integration
- Improving project structure
- Deployment guidance
- Documentation

---

## Architecture Decisions

The following decisions were made manually:

- Used Node.js + Express + TypeScript for the backend.
- Used Next.js App Router for the frontend.
- Used MongoDB for storing users, repositories, events, and rules.
- Used JWT stored in HTTP-only cookies for authentication.
- Chose GitHub OAuth instead of GitHub App authentication to keep the project simpler while satisfying the assignment requirements.

---

## Hardest Bug

The most difficult issue encountered was duplicate webhook processing.

Initially, GitHub generated multiple webhook events (such as `opened` followed by `labeled`) which caused duplicate Slack notifications and duplicate database entries.

This was solved by storing GitHub's `x-github-delivery` ID in the database and ignoring events that had already been processed.

---

## What I Would Improve

If given more time, I would add:

- Per repository automation rules
- Multiple rules for each user
- Retry mechanism for failed webhook processing
- GitHub App authentication
- Better dashboard analytics
- Real-time dashboard updates using WebSockets

---

## Example Prompt

One example of how AI was used:

> Explain how gitHub webhooks, OAuth, and slack can be connected in an event-driven architecture using Node js and typescript.