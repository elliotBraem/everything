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

look at the canvas: [keypom]

key drop

it's a way to put it all together

- every.near : redeploy of the social contract, stores things and types
- near-bos-webcomponent : (thing), has the VM and definitions. Takes data and type.
- 
- every.near.page 


jsinrust

learn-anything, can I just use their app?
He sounds like a cracked dev and would probably appreciate it...

everything.dev
everything.market
everythingproject.org

graph.every.near - deploy socialdb contract

mega proposal along with the Keypom app

Editor - what does this do?

On each build, publish the json scehma of your types to your page. We can derive this from the data.

# Features

Local-first, decentralized data storage using Jazz
AI agent to create typed data from natural language
AI agent to ask questions about your inventory
AI agent to generate UI for data?
Private compute with Naptha?
Peer sharing via Calimero?
Deploy a custom marketplace
Sign transactions with OAuth OR login to session via NEAR wallet (web4?)

# Future

If everything can happen in the browser,
then everything can happen in a WASM environment.

It doesn't matter how this app is built. There are numerous ways to build it better.

This is your opportunity to integrate into it.

What is the goal that we want projects to do?

Race of sloths - create a pull request

everything is built for everyone.

Send for feedback.

## Acknowledgements

- learn-anything
- web4
- final form builder demo https://github.com/final-form/builder-demo
- tailwind rjsf https://github.com/m6io/rjsf-tailwind


<details>
  <summary>Table of Contents</summary>

- [Getting Started](#getting-started)
  - [Installing dependencies](#installing-dependencies)
  - [Running the app](#running-the-app)
  - [Building for production](#building-for-production)
  - [Running tests](#running-tests)
- [Learn more about NEAR](#learn-more-about-near)
- [Ethereum wallet login](#ethereum-wallet-login)
- [Preparing for production](#preparing-for-production)
- [Contributing](#contributing)

</details>

This project a [Vite](https://vitejs.dev/) app bootstrapped with [@near-js/client](https://github.com/near/near-api-js/tree/master/packages/client), [@tanstack/react-router](https://tanstack.com/router/latest), and [@tanstack/react-query](https://tanstack.com/query/latest). It uses [tailwind](https://tailwindcss.com/docs/installation) for styling, [shadcn](https://ui.shadcn.com/) components, and offers a [playwright suite](https://playwright.dev/) for testing.

To easily add more components, [browse the shadcn catalog](https://ui.shadcn.com/docs/components/button) and follow its installation guide. You can also easily generate themes through tools [like this one](https://zippystarter.com/tools/shadcn-ui-theme-generator), and copy and paste your colors into the [input.css](./src/input.css).

## Getting Started

### Installing dependencies

```bash
pnpm install
```

### Running the app

First, run the development server:

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

### Load shadcn component

```bash
pnpm dlx shadcn@latest add <component-name>
```

See the full [testing guide](./playwright-tests/README.md).

## Learn more about NEAR

To learn more about NEAR, take a look at the following resources:

- [NEAR Developer Portal](https://dev.near.org/) - homebase for near developers.
- [NEAR Documentation](https://docs.near.org) - learn about NEAR.
- [Frontend Docs](https://docs.near.org/build/web3-apps/quickstart) - learn about this example.

You can check out [the NEAR repository](https://github.com/near) - your feedback and contributions are welcome!

## Deploy to web4

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



### Checklist

- favicon, title, description, open graph share link
- expand to monorepo? apps, packages (marketplace)
- tests?
- auth vs unauth routes
- create thing from ai (structured outputs)
- clearer ai environment
- everything header
- how to handle offline?
- hide dev tools in production
- edit thing, wrapper around ThingForm



# Running locally

1. Install [mkcert](https://mkcert.dev/).
2. Install local certificate authority (this allows browser to trust self-signed certificates):
    ```bash
    mkcert -install
    ```
3. Create `*.near.page` SSL certificate:
    ```bash
    mkcert "*.near.page"
    ```
3. Run `web4` man-in-the-middle proxy locally:
    ```bash
    IPFS_GATEWAY_URL=https://ipfs.near.social NODE_ENV=mainnet WEB4_KEY_FILE=./_wildcard.near.page-key.pem WEB4_CERT_FILE=./_wildcard.near.page.pem npx web4-near
    ```
4. Setup browser to use [automatic proxy configuration file](https://developer.mozilla.org/en-US/docs/Web/HTTP/Proxy_servers_and_tunneling/Proxy_Auto-Configuration_PAC_file) at `http://localhost:8080/` or to use `localhost:8080` as an HTTPS proxy server.

I had to do:

`sudo sh -c 'echo "127.0.0.1 every.near.page" >> /etc/hosts'`

and 

`pnpm run dev --host every.near.page`