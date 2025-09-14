# Security

If you discover a security vulnerability in this project, please follow responsible disclosure:

1. Do not create a public issue for security reports.
2. Contact the repository owner directly (email or GitHub private message) and include:
   - A description of the issue and attack scenario
   - Steps to reproduce or a minimal PoC
   - A suggested fix, if you have one

Recommended best practices for contributors:
- Never commit secrets or credentials. Add them to `.gitignore` and use environment variables.
- Validate and sanitize user input on the server (Mongoose models and controllers should enforce types).
- Use HTTPS in production; `sameSite` and `secure` cookie flags are important for cross-site behavior.
