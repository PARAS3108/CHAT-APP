# Contributing to Chat-App

Thanks for your interest in contributing! This document describes a lightweight workflow and expectations so contributions stay easy to review.

1. Fork the repository and create a feature branch

   git checkout -b feat/short-description

2. Keep commits small and focused

   - Write clear commit messages (imperative, short summary + optional body)
   - Use rebase/squash to keep history tidy when opening PRs

3. Code style

   - JavaScript (ES2020+) with a consistent linting config (eslint present in frontend)
   - Keep formatting consistent; consider adding Prettier if needed

4. Pull Request

   - Provide a short description of the change and why it's needed
   - Include screenshots or steps to reproduce when relevant (UI changes)

5. Review and CI

   - Address comments promptly
   - If adding features, include small manual test steps in the PR description

6. Security

   - Do not commit secrets (.env, API keys). Add them to your environment or CI secrets.
