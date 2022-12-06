<div align="center">
    <image src="https://raw.githubusercontent.com/D3PSI/lumium/develop/lumium-space/public/logo/parts/fg/icon.svg"></image>
</div>

# lumium
next level docs - the end-to-end secure, shared productivity platform

[discord](https://discord.gg/fCyzDzhvd4)

## dependencies
- postgres
- node v16
- yarn
- clang
- [rustup](https://rustup.rs/)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)
## local database setup
setup and start postgres, then create the necessary databases by logging into `psql` as a privileged user:

```bash
CREATE ROLE development WITH LOGIN ENCRYPTED PASSWORD 'development';
CREATE DATABASE lumium WITH OWNER development;
CREATE DATABASE lumium_test WITH OWNER development;
```

## building and running locally
```bash
yarn && yarn build
yarn run dev # to start the development servers
yarn start # to start the production servers
```

## tests
```bash
yarn test # run all test suites
(cd lumium-api && yarn test) # run backend unit tests
(cd lumium-space && yarn run cypress:test) # run cypress integration tests headless
(cd lumium-space && yarn run cypress:open) # run cypress integration tests headed
```

