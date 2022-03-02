import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import { getNamedAccounts } from 'hardhat';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments} = hre;
  const {deployer} = await getNamedAccounts();

  const {deploy} = deployments;

  await deploy('WETH9', {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
};
export default func;
func.tags = ['WETH9'];