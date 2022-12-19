# My Setup back

---

## ![test-cov](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/FelixLgr/5af8e780e48356491492bbabd31f5ebb/raw/my-setup-back-badge.json)

## Contributing

### Getting started

Clone the project:

```bash
git clone git@github.com:Les-Cop1/my-setup-back.git
```

Add environment variables:

⚠️The MONGO_URL and MONGO_URL_TEST variables must be url encoded

```bash
cp .env.example .env
```

Set up the project:

```bash
yarn setup
```

### Development

To start the development server you need to run the following commands:

```bash
yarn start:development
```

You probably need to run a frontend server as well. You can find the frontend [here](https://github.com/Les-Cop1/my-setup).
