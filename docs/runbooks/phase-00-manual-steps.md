# Phase 00 manual steps

The following owner actions cannot be completed by the coding agent:

- [ ] Create Firebase staging and production projects and service accounts.
- [ ] Create the Atlas staging database, least-privilege user, and IP allowlist.
- [ ] Create the Render service from `render.yaml` and set its environment variables.
- [ ] Create separate Vercel projects for `apps/storefront` and `apps/crm`, with those root directories.
- [ ] Configure GitHub branch protection requiring the CI workflow.
- [ ] Verify `GET /api/health` returns 200 on staging.
