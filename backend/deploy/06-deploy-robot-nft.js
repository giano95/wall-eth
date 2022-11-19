const { networkConfig, developmentChains } = require('../helper-hardhat-config')
const { verify } = require('../utils/verify')
require('../utils/prototype/array')
const { waitNBlocks } = require('../utils/waitNBlocks')

module.exports = async function (hre) {
    const { deployments, getNamedAccounts, network, config, ethers } = hre
    const { deploy } = deployments

    const chainId = network.config.chainId

    const { deployer, user } = await getNamedAccounts()

    // Set the args
    const _truflationClientAddress = networkConfig[chainId]['_truflationClientAddress']
    const args = [_truflationClientAddress]

    // if we haven't set the args for this network pass
    if (args.haveNull()) {
        console.log("You haven't set the args in 'networkConfig' for this network: " + chainId)
        return
    }

    // Actually deploy the contract
    const contract = await deploy('RobotNFT', {
        from: deployer,
        args: args,
        log: true,
        autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && config.etherscan.apiKey[network.name]) {
        await waitNBlocks(3)
        console.log('Verifying...')
        await verify(contract.address, args)
    }
}

module.exports.tags = ['all', 'robot-nft']
