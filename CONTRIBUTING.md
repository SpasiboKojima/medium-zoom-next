# Contributing to Medium Zoom Next

Thank you for getting involved in Medium Zoom Next!

## Concept

This module is meant to reproduce the zoom from [Medium](http://medium.com). We want to provide a great UX (User Experience) with a lightweight vanilla JavaScript solution. Thus, this package must remain focused on this core principle, yet be extended with a composable API.

## Folder structure

```js
apps
├── website // Website and examples source code
│   ├── src
│   │   ├── components  //Examples of various framework instegrations
│   │   ├── layouts
│   │   ├── pages
│   │   │   ╰── index.astro //Entry point for the website, main page
│   │   ╰── styles
│   ╰── // config files
packages
├── meidum-zoom-next //medium-zoom-next package
│   ├── .storybook //Storybook config and story files
│   ├── src
│   │   ├── __test__  //Test suits
│   │   ├── index.ts
│   │   ├── medium-zoom.css
│   │   ├── medium-zoom.ts  //Primary code
│   │   ├── types.ts
│   │   ╰── utils.ts
│   ╰── // config files
╰── // config files
```

## Requirements

- [Node](https://nodejs.org)
- [Bun](https://bun.dev/)

## Conventions

### Commits

This project follows the [conventional changelog](https://conventionalcommits.org/) guidelines. All commit messages should be formatted using the following scheme:

```
type(scope): description
```

## Workflow

### Filing issues

Reporting a bug or requesting a feature is always welcome. Feel free to [open an issue](https://github.com/spasibokojima/medium-zoom-next/issues/new/choose) with the according template which helps you create an effective report.

### Submit code

After discussing in an issue about the need to change the code, you will need to follow these steps:

- [Fork the repository](https://help.github.com/articles/fork-a-repo/)
- Clone your fork
- Install the dependencies: `bun`
- For a **documentation** change:
  - Create a branch `docs/what-you-change`
  - Make the changes
  - Run `bun run format`
- For a **bug fix**:
  - Create a branch `fix/issue-number`
  - [Write a test](packages/medium-zoom-next/src/__tests__/medium-zoom.test.js) to reproduce the bug (run `bun run test`)
  - Fix the bug in the [source code](packages/medium-zoom-next/src/medium-zoom.ts)
  - Make your test pass the previous bug
  - Run `bun run format` and fix problems if any
- For a **feature**:
  - Create a branch `feat/name-of-the-feature`
  - Add the feature to the [source code](packages/medium-zoom-next/src/medium-zoom.ts)
  - Create a story in the [storybook](packages/medium-zoom-next/.storybook) showcasing the feature
  - [Write a test](packages/medium-zoom-next/src/__tests__/medium-zoom.test.js) to ensure it's working as expected (run `bun run test`)
  - Run `bun run format` and fix problems if any
- [Create a pull request](https://help.github.com/articles/creating-a-pull-request/)

We will then review your pull request!

### Testing

#### Unit and integration tests

[Unit and integration tests](packages/medium-zoom-next/src/__tests__) with [Vitest](https://vitest.dev/) ensure that the API works as documented.

###### Commands

- Run the tests: `bun run test`
- Watch the tests: `bun run test --watch`
- Run the tests with coverage: `bun run test --coverage`

### Releasing

We rely on [release-it](https://github.com/webpro/release-it) to release new versions of this package.

#### Release flow

The release flow goes through these steps:

1. Run acceptance tests
1. Bump the project version in [`package.json`](package.json) based on [the commits](#conventions)
1. Commit the release version
1. Create the new Git tag for this release
1. Push to GitHub
1. Publish to npm

#### Release steps

##### Unstable version

1. Make sure you're on the `next` branch
1. Run `npm run release:next` (_do not_ use `bun` for releasing)
1. Follow the command-line instructions

##### Stable version

1. Make sure you're on the `master` branch
1. Run `npm run release` (_do not_ use `bun` for releasing)
1. Follow the command-line instructions

---

Thank you for contributing!
