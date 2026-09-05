# Changesets

Every user-facing change ships with a file in this directory describing the bump (`major`, `minor`, `patch`) and what changed. `pnpm changeset` writes one. On merge to `master`, the release workflow turns pending changesets into a "Version Packages" pull request; merging that publishes to npm.
