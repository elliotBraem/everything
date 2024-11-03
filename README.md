<!-- markdownlint-disable MD014 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD041 -->
<!-- markdownlint-disable MD029 -->

<div align="center">

<h1 style="font-size: 2.5rem; font-weight: bold;">everything</h1>

  <p>
    <strong>apps and packages for creating and defining things</strong>
  </p>

</div>

<details>
  <summary>Table of Contents</summary>

- [Getting Started](#getting-started)
  - [Installing dependencies](#installing-dependencies)
  - [Running the app](#running-the-app)
  - [Building for production](#building-for-production)
  - [Running tests](#running-tests)
- [Learn more about NEAR](#learn-more-about-near)
- [Contributing](#contributing)

</details>

## Getting Started

### Installing dependencies

```bash
pnpm install
```

### Running the app

First, make sure a web4 proxy server is running (see [setup](#running-web4-locally)):

```bash
pnpm run web4:start:testnet
```

Then start the dev server. This will run the app and the express proxy server.

```bash
pnpm run dev
```

### Building for production

```bash
pnpm run build
```

### Running tests

```bash
pnpm run test
```

See the full [testing guide](./playwright-tests/README.md).

## Project Structure

This project is a structured as a monorepo with [Turborepo](https://github.com/vercel/turborepo).

```cmd
.
├── apps
│   ├── api
│   └── www
├── packages
│   ├── config-eslint
│   ├── config-typescript
```

It consists of several components:

- [Vite](https://vitejs.dev/) project using [near-vite-starter template](https://github.com/NEARBuilders/near-vite-start), bundle stored on [NEARFS](https://github.com/vgrichina/nearfs), served through [Web4](https://web4.near.page/)

- Web4 NEAR login to authorize a local-first session with [Jazz](https://jazz.tools/) for data storage and sync

- Types stored on-chain in the [social-db](https://github.com/NearSocial/social-db)

- Express proxy server for Open AI requests to gpt-4o-mini for NLP and structured outputs

- Automatic form generation based on JSON Schemas, using [react-jsonschema-form](https://rjsf-team.github.io/react-jsonschema-form/docs/)

## Learn more about NEAR

To learn more about NEAR, take a look at the following resources:

- [NEAR Developer Portal](https://dev.near.org/) - homebase for near developers.
- [NEAR Documentation](https://docs.near.org) - learn about NEAR.
- [Frontend Docs](https://docs.near.org/build/web3-apps/quickstart) - learn about this example.

You can check out [the NEAR repository](https://github.com/near) - your feedback and contributions are welcome!

## Running web4 locally

1. Install [mkcert](https://mkcert.dev/).
2. Install local certificate authority (this allows browser to trust self-signed certificates):

   ```bash
   mkcert -install
   ```

3. Create `*.near.page` SSL certificate and store these at the project root:

   ```bash
   mkcert "*.near.page"
   ```

4. Run `web4` man-in-the-middle proxy locally:

   ```bash
   IPFS_GATEWAY_URL=https://ipfs.near.social NODE_ENV=mainnet WEB4_KEY_FILE=./_wildcard.near.page-key.pem WEB4_CERT_FILE=./_wildcard.near.page.pem npx web4-near
   ```

5. May have to configure hosts on MacOS:

```bash
sudo sh -c 'echo "127.0.0.1 every.near.page" >> /etc/hosts'
```

6. Run the web4 proxy server for designated network

```bash
pnpm run web4:start:testnet
```

## Deploy to web4

To deploy the main app, go to `/apps/www`, then follow the below:

1. Build the project

```cmd
pnpm run build
```

2. Create a web4 subaccount of your master account (this will be your domain).

```cmd
near account create-account fund-myself web4.MASTER_ACCOUNT.testnet '1 NEAR' autogenerate-new-keypair save-to-keychain sign-as MASTER_ACCOUNT.testnet network-config testnet sign-with-keychain send`
```

Be sure to "Store the access key in legacy keychain"!

3. Run web4-deploy to upload production bundle to nearfs and deploy it to a minimum-web4 contract to your account.

```cmd
npx github:vgrichina/web4-deploy dist web4.MASTER_ACCOUNT.testnet --deploy-contract --nearfs
```

Deploy shoudl be accessible and your website accessible at

`testnet`: MASTER_ACCOUNT.testnet.page

`mainnet`: MASTER_ACCOUNT.near.page

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you're interested in contributing to this project, please read the [contribution guide](./CONTRIBUTING).

<div align="right">
<a href="https://nearbuilders.org" target="_blank">
<img
  src="https://builders.mypinata.cloud/ipfs/QmWt1Nm47rypXFEamgeuadkvZendaUvAkcgJ3vtYf1rBFj"
  alt="Near Builders"
  height="40"
/>
</a>
</div>
