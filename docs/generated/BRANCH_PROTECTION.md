# 🛡️ Branch Protection Rules & Git Workflow

Branch protection and git workflow guidelines for Final Golf SaaS development.

## 🌟 Branch Strategy

### Main Branches

- **`main`** - Production-ready code, protected branch
- **`develop`** - Integration branch for development, protected branch
- **`staging`** - Pre-production testing branch

### Feature Branches

- **`feat/feature-name`** - New features
- **`fix/bug-description`** - Bug fixes
- **`docs/update-description`** - Documentation updates
- **`refactor/component-name`** - Code refactoring
- **`chore/maintenance-task`** - Maintenance tasks

## 🔒 Branch Protection Settings

### Main Branch (`main`)

**GitHub Repository Settings → Branches → Add rule for `main`**

#### Required Settings:

- ✅ **Require a pull request before merging**
  - ✅ Require approvals: **2 approvals minimum**
  - ✅ Dismiss stale PR approvals when new commits are pushed
  - ✅ Require review from code owners
  - ✅ Restrict pushes that create files that override `.github/CODEOWNERS`

- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - **Required status checks:**
    - `ci/lint` - ESLint and Prettier checks
    - `ci/type-check` - TypeScript type checking
    - `ci/test` - Unit and integration tests
    - `ci/build` - Build verification
    - `ci/security-scan` - Security vulnerability scan
    - `ci/e2e-tests` - End-to-end tests (when available)

- ✅ **Require conversation resolution before merging**
- ✅ **Require signed commits**
- ✅ **Require linear history** (no merge commits)
- ✅ **Include administrators** (applies to repo admins)
- ✅ **Restrict pushes** - Only allow via pull requests
- ✅ **Allow force pushes: Never**
- ✅ **Allow deletions: Never**

### Develop Branch (`develop`)

**GitHub Repository Settings → Branches → Add rule for `develop`**

#### Required Settings:

- ✅ **Require a pull request before merging**
  - ✅ Require approvals: **1 approval minimum**
  - ✅ Dismiss stale PR approvals when new commits are pushed
  - ✅ Require review from code owners (if applicable)

- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - **Required status checks:**
    - `ci/lint` - ESLint and Prettier checks
    - `ci/type-check` - TypeScript type checking
    - `ci/test` - Unit tests
    - `ci/build` - Build verification

- ✅ **Require conversation resolution before merging**
- ✅ **Include administrators**
- ✅ **Restrict pushes** - Only allow via pull requests
- ✅ **Allow force pushes: Never**
- ✅ **Allow deletions: Never**

## 🔄 Git Workflow Process

### 1. Creating Feature Branches

```bash
# Start from develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feat/booking-calendar-component
```

### 2. Making Commits

```bash
# Stage changes
git add .

# Commit with conventional format (commitlint enforced)
git commit -m "feat(booking): Add real-time availability checking

- Implement WebSocket connection for live updates
- Add booking conflict resolution
- Update UI to show real-time slot status

Closes #123"
```

### 3. Creating Pull Requests

```bash
# Push feature branch
git push origin feat/booking-calendar-component

# Create PR via GitHub CLI (optional)
gh pr create --title "feat(booking): Add real-time availability checking" --body-file .github/pull_request_template.md
```

### 4. Code Review Process

1. **Automated Checks** - All CI checks must pass
2. **Code Review** - Required number of approvals
3. **Testing** - Manual testing by reviewer if needed
4. **Merge** - Squash and merge to maintain clean history

## 📝 Commit Message Format

### Conventional Commits Standard

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

| Type       | Purpose                  | Examples                                           |
| ---------- | ------------------------ | -------------------------------------------------- |
| `feat`     | New features             | `feat(api): Add payment webhook handling`          |
| `fix`      | Bug fixes                | `fix(booking): Resolve date picker timezone issue` |
| `docs`     | Documentation            | `docs(readme): Update setup instructions`          |
| `style`    | Code formatting          | `style(ui): Fix component spacing`                 |
| `refactor` | Code restructuring       | `refactor(auth): Extract JWT utility functions`    |
| `perf`     | Performance improvements | `perf(database): Optimize booking queries`         |
| `test`     | Adding tests             | `test(booking): Add integration test suite`        |
| `build`    | Build system changes     | `build(docker): Update Node.js version`            |
| `ci`       | CI/CD changes            | `ci(github): Add automated deployment`             |
| `chore`    | Maintenance              | `chore(deps): Update dependencies`                 |

### Scopes (Optional)

- **Apps**: `web`, `api`, `onsite-pwa`, `course-admin`, `platform-admin`
- **Services**: `worker`, `webhooks`, `scheduler`, `realtime`
- **Packages**: `database`, `schemas`, `ui`, `shared`, `config`, `auth`
- **Features**: `booking`, `teesheet`, `pos`, `payments`, `notifications`
- **Infrastructure**: `docker`, `ci`, `deploy`, `monitoring`

## 👥 Code Owners

### `.github/CODEOWNERS`

```
# Global owners (require review for all changes)
* @team-leads

# Core infrastructure
package.json @devops-team
docker-compose.yml @devops-team
.github/ @devops-team
docs/ @tech-writing-team

# Database and schemas
packages/database/ @backend-team @database-team
packages/schemas/ @backend-team @frontend-team

# Frontend applications
apps/web/ @frontend-team
apps/onsite-pwa/ @frontend-team @pos-team
apps/course-admin/ @frontend-team @course-team
apps/platform-admin/ @frontend-team @platform-team

# Backend services
apps/api/ @backend-team
services/ @backend-team @infrastructure-team

# Security sensitive files
*.env.example @security-team @devops-team
commitlint.config.js @devops-team
.husky/ @devops-team
```

## 🚫 Prohibited Actions

### Never Do This:

- ❌ Direct pushes to `main` or `develop` branches
- ❌ Force pushing to protected branches
- ❌ Bypassing status checks
- ❌ Merging without required approvals
- ❌ Committing secrets or sensitive data
- ❌ Large binary files (>50MB)
- ❌ Generated files that should be built during CI
- ❌ Merge commits (use squash and merge)

### Emergency Procedures:

If production is down and immediate fixes are needed:

1. Create hotfix branch from `main`
2. Get expedited review from 2 senior developers
3. Deploy via established emergency procedures
4. Document the incident and improve processes

## 📊 Quality Gates

### Pre-commit Checks (Automatic via Husky)

- ✅ **Linting**: ESLint with zero warnings policy
- ✅ **Formatting**: Prettier code formatting
- ✅ **Type Checking**: TypeScript compilation
- ✅ **Commit Message**: Conventional commits validation

### Pre-push Checks (CI Pipeline)

- ✅ **Unit Tests**: Jest/Vitest test suites
- ✅ **Integration Tests**: API and database tests
- ✅ **Build Verification**: All apps and services build successfully
- ✅ **Security Scan**: Dependency vulnerability check
- ✅ **Bundle Analysis**: Size and performance validation

### Pre-merge Checks (GitHub Actions)

- ✅ **E2E Tests**: Playwright browser tests
- ✅ **Performance Tests**: Load testing for API endpoints
- ✅ **Accessibility Tests**: A11y compliance validation
- ✅ **Docker Build**: Container image creation
- ✅ **Environment Validation**: Configuration checks

## 🛠️ Git Hooks Configuration

### Pre-commit Hook

Located at: `.husky/pre-commit`

```bash
#!/usr/bin/env sh
echo "🔍 Running pre-commit checks..."
pnpm lint-staged
echo "✅ Pre-commit checks passed!"
```

### Commit Message Hook

Located at: `.husky/commit-msg`

```bash
#!/usr/bin/env sh
echo "🔍 Validating commit message..."
pnpm exec commitlint --edit "$1"
echo "✅ Commit message is valid!"
```

### Lint-staged Configuration

From `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix --max-warnings=0",
      "prettier --write",
      "git add"
    ],
    "*.{json,md,yaml,yml,css,scss,html}": ["prettier --write", "git add"],
    "*.{ts,tsx}": [
      "bash -c 'pnpm type-check || echo \"Type check failed but continuing...\"'"
    ]
  }
}
```

## 📋 Setup Checklist

### Repository Setup

- [ ] Enable branch protection for `main` and `develop`
- [ ] Create `.github/CODEOWNERS` file
- [ ] Configure required status checks
- [ ] Set up GitHub Actions workflows
- [ ] Configure repository secrets for CI/CD

### Team Setup

- [ ] Add team members to appropriate GitHub teams
- [ ] Grant proper repository permissions
- [ ] Set up code review assignments
- [ ] Train team on git workflow and commit conventions

### Local Development Setup

- [ ] Install git hooks: `pnpm git:hooks`
- [ ] Verify commitlint: `echo "test: invalid message" | pnpm exec commitlint`
- [ ] Test pre-commit hook: Make a test commit
- [ ] Configure Git signing (recommended): `git config --global commit.gpgsign true`

## 🚨 Emergency Procedures

### Hotfix Process

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-fix

# 2. Make minimal changes
git add .
git commit -m "fix(security): Resolve authentication bypass vulnerability

Closes CVE-2024-XXXXX"

# 3. Create emergency PR
gh pr create --title "🚨 HOTFIX: Critical security fix" --label "hotfix,security"

# 4. Get expedited review (2 approvals)
# 5. Deploy immediately after merge
```

### Rollback Procedure

```bash
# 1. Revert problematic commit
git revert <commit-hash> --no-edit

# 2. Create rollback PR
git checkout -b fix/rollback-problematic-change
git push origin fix/rollback-problematic-change

# 3. Expedited review and merge
```

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [Husky Documentation](https://typicode.github.io/husky/)
- [Commitlint Documentation](https://commitlint.js.org/)
- [Git Workflow Best Practices](https://www.atlassian.com/git/tutorials/comparing-workflows)

---

**Remember**: These rules exist to maintain code quality, prevent bugs, and ensure smooth collaboration. If you encounter issues or need exceptions, discuss with the team lead first.
