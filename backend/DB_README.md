DB troubleshooting & tips

This file documents common causes and fixes for Prisma/MongoDB connection failures (Prisma P2010 / server selection timeout).

1) Check your DATABASE_URL
- The Prisma datasource uses `DATABASE_URL` (see `prisma/schema.prisma`).
- Ensure the connection string is a valid MongoDB URI (SRV or non-SRV). Example SRV:
  mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database>?retryWrites=true&w=majority

2) IP access / Network
- If you're using MongoDB Atlas, make sure your current IP is allowed in the project's Network Access (IP whitelist).
- For quick local testing, you can temporarily allow access from anywhere (0.0.0.0/0) — do not use this permanently for production.

3) Cluster state
- Verify the Atlas cluster is running and healthy. If the cluster is paused or undergoing maintenance, connections will fail.

4) TLS / OpenSSL issues
- Rarely, the Node/OpenSSL build on your machine may be incompatible with the Atlas server. Upgrading Node to an LTS release or updating OpenSSL can help.

5) Use the centralized Prisma client
- This project includes a single shared Prisma client in `backend/db/config.js` with a `connectToDB()` helper that retries on failure and logs actionable hints.

6) Helpful debugging steps
- From your machine, try connecting with the `mongo` shell or `mongosh` using the same DATABASE_URL to see more detailed network/TLS errors.
- Example (if you have mongosh installed):

  mongosh "<your DATABASE_URL>"

- Check the exact error in logs. A `Server selection timeout` + `No available servers` usually means network/allowlist or cluster down.

7) If you still see P2010
- Share the exact error and your `DATABASE_URL` (redact credentials) and whether you can `mongosh` successfully connect from the same machine.


How this repo starts the server
- `backend/server.js` will call `connectToDB()` before starting the HTTP server. If DB connection fails it will exit with code 1 so you can fix the infra and restart.


Contact
- If this is a deployed environment (Render, Heroku, etc.), make sure the provider's deployment environment variables include `DATABASE_URL` and that Atlas allows the provider's egress IPs or uses VPC peering.
