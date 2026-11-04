# GitHub publishing runbook

> **Status:** this runbook was not executed in the build environment because `gh` is not installed
> and no GitHub token is available. Everything below is ready to run after authentication.

The local repository is initialized on `main` with all files committed. The intended repository name
is `booknest-library`; `README.md` is the specification because no `TASKS.md` or issue list was
present in the workspace.

## 1. Authenticate

Install the GitHub CLI if needed, then sign in:

```bash
winget install --id GitHub.cli
gh auth login
gh auth status
```

For project boards, refresh scopes if prompted:

```bash
gh auth refresh -s project
```

## 2. Create and push the repository

```bash
OWNER="$(gh api user --jq .login)"
gh repo create "$OWNER/booknest-library" \
  --public \
  --source=. \
  --remote=origin \
  --push \
  --description "A calm, accessible small-library management demo built with vanilla JavaScript and Vite."
```

If the repository already exists:

```bash
git remote add origin "https://github.com/$OWNER/booknest-library.git"
git push -u origin main
```

Add topics and metadata:

```bash
gh repo edit "$OWNER/booknest-library" \
  --add-topic library-management \
  --add-topic vanilla-javascript \
  --add-topic vite \
  --add-topic accessibility \
  --add-topic chartjs \
  --add-topic github-pages \
  --enable-issues \
  --enable-projects
```

## 3. Labels and milestone

```bash
for label in "type:feature:2f6b54" "type:bug:b85c3b" "type:docs:4d7f8f" \
  "type:test:82638f" "area:ui:d6a756" "area:data:2f6b54" \
  "area:security:b85c3b" "needs-triage:5f6b63"; do
  name="${label%:*}"
  color="${label##*:}"
  gh label create "$name" --color "$color" --force
done

gh api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  "/repos/$OWNER/booknest-library/milestones" \
  -f title="v0.1.0" \
  -f description="Production-quality repository foundation and BookNest demo release."
```

## 4. Issues

Because there was no supplied task list, create one issue per workstream from
[PLAN.md](PLAN.md). Example:

```bash
gh issue create \
  --title "BN-005: Accessible searchable book catalogue" \
  --body "Search, filter, sort and deep-link the catalogue, with a native details dialog and an axe scan." \
  --label "type:feature" \
  --label "area:ui" \
  --milestone "v0.1.0"
```

If the delivered work is being recorded retroactively, close each issue with a comment pointing to
the relevant commit and release. Do not claim a pull request review that did not happen.

For future work, create the issue first, branch from `main`, and open a PR:

```bash
git switch -c feat/loan-workflow
# ...work...
git push -u origin feat/loan-workflow
gh pr create --fill --base main
```

## 5. Project board

```bash
gh project create --owner "$OWNER" --title "BookNest v0.1.0"
gh project list --owner "$OWNER"
```

Add issues from the GitHub UI or with `gh project item-add`. Suggested columns: **Backlog**,
**Ready**, **In progress**, **Review**, **Done**.

## 6. Branch protection

In **Settings → Branches**, add a rule for `main`:

- Require a pull request before merging.
- Require approvals: 1 (or 0 for a solo assignment, but keep status checks).
- Require status checks to pass: `quality` and `e2e`.
- Require branches to be up to date before merging.
- Block force pushes and deletions.
- Do not allow bypassing the above settings.

## 7. Pages

In **Settings → Pages → Build and deployment**, choose **GitHub Actions**.

The deploy workflow runs after `CI` succeeds on `main`.

## 8. Release

```bash
git tag -a v0.1.0 -m "BookNest v0.1.0"
git push origin main --tags
gh release create v0.1.0 \
  --title "BookNest v0.1.0" \
  --notes-file docs/releases/v0.1.0.md
```

## 9. Final verification

```bash
gh repo view "$OWNER/booknest-library" --web
gh run list --limit 5
gh release view v0.1.0
```

Confirm that CI and Pages are green, the release links to the tag, and the README screenshot and
badges render.

## Security

- Do not commit `.env` files, tokens or real library data.
- Use GitHub's private vulnerability reporting (see `SECURITY.md`).
- Dependabot opens grouped weekly PRs for npm and Actions.
- Treat the demo credentials as public by design.
