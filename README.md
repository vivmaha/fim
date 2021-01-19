Tool for personal finance modelling.

Command line for now with a yaml config file.

Built as a library. Probably I'll slap a UI on it in the far future.

![](https://github.com/vivmaha/fim/workflows/CI/badge.svg)

# Build

`npm run build` Produces `./dist`

# Test

`npm run test` Runs tests via jest.

`npm run test -- --verbose`

`npm run test -- --watch`

See jest docs for other options.

# Lint

`npm run lint` Runs linter

# Run

`node ./dist/bundle.js --file ./src/cli/samples/input.yml`

# Questions to answer

- Will I go into overdraft soon
- How much spending money do I have left over
  - This month
  - As a daily allowance
- Do I have enough saved for retirement
- Do I have enouch saved for my kids' college
