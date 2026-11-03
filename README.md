# Kinde ExpressJS SDK

The Kinde SDK for ExpressJS.

You can also use the ExpressJS starter kit [here](https://github.com/kinde-starter-kits/expressjs-starter-kit).

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com) [![Kinde Docs](https://img.shields.io/badge/Kinde-Docs-eee?style=flat-square)](https://kinde.com/docs/developer-tools) [![Kinde Community](https://img.shields.io/badge/Kinde-Community-eee?style=flat-square)](https://thekindecommunity.slack.com)

## Requirements

Please note that this SDK requires that your Node version to be `>=19.x.x`.

## Documentation

For details on integrating this SDK into your project, head over to the [Kinde docs](https://kinde.com/docs/) and see the [ExpressJS SDK](https://kinde.com/docs/developer-tools/express-sdk).

## Publishing

The core team handles publishing.

## Contributing

Please refer to Kinde’s [contributing guidelines](https://github.com/kinde-oss/.github/blob/489e2ca9c3307c2b2e098a885e22f2239116394a/CONTRIBUTING.md).

### Development

Use Node.js 24 and pnpm 12, matching the build and release workflows. These
development-tool requirements are separate from the SDK's runtime requirements.

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test:coverage --run
pnpm build
pnpm test:package
```

The package tests load the built CommonJS and ESM public entry points and check
the declared TypeScript entry points. Run them after building.

Keep `vitest` and `@vitest/coverage-v8` pinned to the same exact version. Vitest 5
clears mock call histories before each test, without resetting implementations.
Record mocked calls inside tests or `beforeEach` hooks, and await asynchronous
assertions.

## License

By contributing to Kinde, you agree that your contributions will be licensed under its MIT License.
