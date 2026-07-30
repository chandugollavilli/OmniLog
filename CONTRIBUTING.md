# Contributing to OmniLog

Thank you for your interest in contributing to OmniLog! We welcome contributions from developers, security engineers, technical writers, and SOC analysts worldwide.

---

## Code of Conduct

All contributors must adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before joining our community discussions or submitting pull requests.

---

## How to Contribute

### 1. Reporting Bugs
- Search existing issues to avoid duplicates.
- Submit a new GitHub Issue using the **Bug Report** template.
- Include OS version, logs, steps to reproduce, and environment configs.

### 2. Creating Collector Plugins
- Refer to the [Plugin Development Guide](docs/PLUGIN_DEVELOPMENT_GUIDE.md).
- Create your collector under `backend/src/collectors/<vendor>/`.
- Extend `BaseCollector` and implement `receive()`, `parse()`, `normalize()`, and `store()`.
- Add unit tests under `backend/src/tests/`.

### 3. Submitting Pull Requests (PR)
- Fork the repository and create your feature branch: `git checkout -b feature/my-new-collector`
- Ensure all TypeScript code compiles without errors (`npm run build`).
- Run Vitest unit test suite (`npm run test`).
- Commit changes using conventional commit messages: `feat(collector): add Sophos XG Syslog parser`
- Open a Pull Request targeting the `main` branch.

---

## Development Environment Setup

```bash
git clone https://github.com/omnilog/omnilog.git
cd omnilog
cp .env.example .env
docker-compose up -d --build
```
- Backend REST API: `http://localhost:5000/api/v1`
- Frontend UI: `http://localhost:3000`
