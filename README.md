# poc-bidi-playwright

This project is a proof of concept for using Playwright with bidirectional communication.

## Changelog 📝

For a detailed list of changes and releases, please refer to the [Changelog](CHANGELOG.md).

## Local Development Guide 🛠️

### Requirements

Before you begin, ensure you have the following software installed:

- [pre-commit] for configuring commit hooks.
- Either [Colima][colima] or [Docker Desktop][docker-desktop] for working with containerized applications.
- Node

#### Installing Node

To install Node, you can use [nvm].

```shell script
nvm install
```

This will pick up the Node version specified in the `.nvmrc` file.

### Setup the project

Install pre-commit hooks:

```shell script
pre-commit install
```

Execute the following command to install the dependencies:

```shell script
npm install
```

Install Playwright browsers:

```shell script
npx playwright install
```

### Configure Environment Variables

This project is configured using environment variables. In order to run the tests, you need to create first a `.env`
file in the root of the project, with proper values for the environment variables used in the project.

When running it relies on [dotenvx] to manage environment variables and support
multiple environments.

Create a file named `.local.env` in the root of the project with the following content:

| Environment Variable                | Description                                                   |
|-------------------------------------|---------------------------------------------------------------|
| `PAGE_URL`                          | URL of the application page.                                  |
| `USER_USERNAME`                     | Username for the user account used in tests.                  |
| `USER_PASSWORD`                     | Password for the user account used in tests.                  |

### Running the tests

Execute the tests with in headless mode without playwright UI you can run:

```shell script
dotenvx run -f ${ENV:-.default.env} -- npx playwright test
```

If you want to run with UI you can run:

```shell script
dotenvx run -f ${ENV:-.default.env} -- npx playwright test --ui
```

## CI/CD 🔄

We rely on GitHub Actions for our continuous development process.

To access our pipelines check [Actions][this-actions] tab on this project repository.

## Additional Documentation 📚

Please refer to the following documents if you need more details on the tools and frameworks used by this application.

- [Playwright][playwright]. The official Playwright documentation.

---

[this-actions]: https://github.com/ghillaz/poc-bidi-playwright/actions
[nvm]: https://github.com/nvm-sh/nvm
[dotenvx]: https://github.com/dotenvx/dotenvx
[playwright]: https://playwright.dev/
[pre-commit]: https://pre-commit.com/
[docker-desktop]: https://www.docker.com/products/docker-desktop/
[colima]: https://github.com/abiosoft/colima
