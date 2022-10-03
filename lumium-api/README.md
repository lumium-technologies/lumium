# lumium-api

## local database setup
setup and start postgres, then create the necessary databases by logging into `psql` as a privileged user:

```bash
CREATE ROLE development WITH LOGIN ENCRYPTED PASSWORD 'development';
CREATE DATABASE lumium WITH OWNER development;
CREATE DATABASE lumium_test WITH OWNER development;
```

## building and running
```bash
yarn && yarn build
yarn run dev # to start the development servers
yarn start # to start the production servers
```

## tests
```bash
yarn test
```
