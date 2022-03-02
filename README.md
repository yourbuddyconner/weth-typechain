## wETH Typechain

Occasionally I have the need to deploy [Canonical wETH](https://github.com/gnosis/canonical-weth) on testnets and new networks through the course of my work at [Nomad](https://nomad.xyz). 

This repository implements a Hardhat deployment pipeline as well as generated Typescript bindings for the canonical-weth smart contract. 

### Deploying to localhost

1. `npx hardhat node`
2. `npx hardhat deploy --network localhost`

### Deploying to a new network

We're going to use the example of Evmos mainnet and `WEVMOS`

**Prerequisites:**
- RPC Endpoint for new network
- Funded deployer private key 

1. Create new `WETH9` contract for your network

```
cp contracts/WETH9.sol contracts/WEVMOS9.sol
```

2. Edit the token name and symbol from `Wrapped Ether` and `WETH` to match your network

```
contract WEVMOS9 {
    string public name = "Wrapped Ether";
    string public symbol = "WEVMOS";
```

3. Add a deploy folder for your network (required due to quirk of hardhat-deploy)

```
mkdir deploy/evmos
```

4. Copy weth deploy script (lives in `deploy/deploy_weth.ts`) to your new deploy folder and edit for your network: 

```
cp deploy/deploy_weth.ts deploy/evmos/deploy_wevmos.ts
```

Edit the file accordingly:
```
  await deploy('WEVMOS9', {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
};
export default func;
func.tags = ['WEVMOS9'];
```

5. Add a network configuration to `hardhart.config.ts`

```
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    evmos: {
      url: "<INSERT RPC HERE>",
      deploy: ["deploy/evmos"]
    }
  },
```

6. Edit the `hardhat-packager` configuration to only pick up your new contract

```
  packager: {
    contracts: [
      "WEVMOS9"
    ],
    includeFactories: true,
  }
```

7. Deploy using private key as input: 

```
DEPLOYER_KEY="privatekey://<INSERT PRIVATE KEY HERE>" npx hardhat deploy --network evmos
```

If you're successful, you should see something like this: 
```
Nothing to compile
No need to generate any newer typings.
deploying "WEVMOS9" (tx: 0xbe561b26a96aa3d71b7053d97a659cd41ee46cc1e53470993afd023d98ca90dd)...: deployed at 0x1301615d3B19fe636F3059685Fe0DCc2E08D1822 with 565073 gas
```

### Verifying Contracts

You will definitely want to verify this contract if you are deploying a canonical wrapped token for your network. 

Most chains I deploy to have Blockscout, for which the hardhat tooling is *poor* at best. I recommend hand-verifying your WETH contract. 

You will need the flattened source code: 

```
npx hardhat flatten contracts/WEVMOS9.sol | pbcopy
```

Additionally, all the rest of the input parameters for contract verification can be found in the deployment file that `hardhat-deploy` created for you in `deployments/<NETWORK>/<CONTRACT>.json`

Example inputs for blockscout: 

| Input Name                         | Value                                |
| :--------------------------------- | ------------------------------------ |
| Contract Name                      | `WEVMOS9`                            |
| Include Nightly                    | No                                   |
| Compiler                           | `0.5.17+commit.d19bba13`             |
| EVM Version                        | `istanbul`                           |
| Optimization                       | Yes                                  |
| Optimization Runs                  | 200                                  |
| Solidity Contract Code             | See above command for flattened code |
| Try to fetch constructor arguments | No                                   |
| Constructor Arguments              | N/A                                     |
