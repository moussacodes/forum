## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

#satrt up docker container
sudo npm run db:dev:up

#stop docker container
sudo npm run db:dev:rm

#stop docker container, then start it, and migrate prisma
sudo npm run db:dev:restart

```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

- Author - [duckduckcodes](https://github.com/duckduckcodes)


>   P1000: remove local postgres in your computer