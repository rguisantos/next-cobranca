
### Prerequisites

**Node version 14.x**

### Cloning the repository

```shell
git clone https://github.com/rguilherme10/next-cobranca.git
```

### Install packages

```shell
npm i
```

### Setup .env file


```js
DATABASE_URL='./dev.db'
SECRET_KEY_JWT=
SECRET_KEY_CRYPT=
SENHA_PADRAO=
```

### Push Prisma
```shell
npx prisma generate
npx prisma db push
```


### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command         | description                              |
| :-------------- | :--------------------------------------- |
| `dev`           | Starts a development instance of the app |
