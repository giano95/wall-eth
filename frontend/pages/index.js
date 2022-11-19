import Head from 'next/head'
import Image from 'next/image'
import { useAccount, useNetwork, useContract, useContractRead, useProvider, useSigner } from 'wagmi'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import {
    RocketLaunchIcon,
    CpuChipIcon,
    ArrowTopRightOnSquareIcon,
    ArrowLongRightIcon,
} from '@heroicons/react/24/outline'
import sliceAddress from '../utils/sliceAddress'

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
const contractAddresses = require('../constants/contractAddresses.json')
const contractAbis = require('../constants/contractAbis.json')

export default function Home() {
    // wagmi hook
    const { address, isConnecting, isDisconnected, isConnected } = useAccount()
    const { chain, chains } = useNetwork()
    const provider = useProvider()
    const { data: signer, isError, isLoading } = useSigner()

    // Staking
    const [stakingAmount, setStakingAmount] = useState(1.0)
    const [stakingTokenSymbol, setStakingTokenSymbol] = useState()
    const [stakingInfo, setStakingInfo] = useState('')
    const [withdrawStakingInfo, setWithdrawStakingInfo] = useState('')
    const [stakingBalance, setStakingBalance] = useState(0.0)

    // Funding
    const [fundingAmount, setFundingAmount] = useState(6.0)
    const [fundingInfo, setFundingInfo] = useState('')
    const [withdrawFundingInfo, setWithdrawFundingInfo] = useState('')
    const [fundingBalance, setFundingBalance] = useState(0.0)

    // Bot Creation
    const [botName, setBotName] = useState('myBot_0')
    const [botOrderInterval, setBotOrderInterval] = useState(3600)
    const [botOrderSize, setBotOrderSize] = useState(0.1)
    const [botInfo, setBotInfo] = useState('')

    // Trading
    const [tradingBalance, setTradingBalance] = useState(0.0)
    const [tradeEvents, setTradeEvents] = useState()
    const [tradedTokenSymbol, setTradedTokenSymbol] = useState()

    // NFT
    const [nftUri, setNftUri] = useState()

    async function handleStakeSubmit(e) {
        e.preventDefault()

        // Check that the amount is > 0
        if (stakingAmount <= 0) {
            setStakingInfo('Stake an amount > 0')
            return
        }

        // Parse the amount into wei
        const stakingAmountWei = ethers.utils.parseEther(stakingAmount.toString())

        // Initialize the contracts
        const wethAddress = contractAddresses[chain.id][stakingTokenSymbol]
        const wethAbi = contractAbis[chain.id]['ERC20']
        const wethContract = new ethers.Contract(wethAddress, wethAbi, signer)
        const tradingBotAddress = contractAddresses[chain.id]['TradingBotV3']
        const tradingBotAbi = contractAbis[chain.id]['TradingBotV3']
        const tradingBotContract = new ethers.Contract(tradingBotAddress, tradingBotAbi, signer)

        // Approve the bot contract to spend your WETH
        try {
            const txResponse = await wethContract.approve(tradingBotAddress, stakingAmountWei)
            setStakingInfo('Approving...')
            const txReceipt = await txResponse.wait()
            setStakingInfo('Approved!')
            console.log(txReceipt)
        } catch (error) {
            console.log(error)
            setStakingInfo('An error occured :(')
            return
        }

        // Wait 1 second
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Stake the amount into the contract
        try {
            const txResponse = await tradingBotContract.stake(
                stakingAmountWei
                // {
                // gasLimit: 5000000,
                // }
            )
            setStakingInfo('Staking...')
            const txReceipt = await txResponse.wait()
            setStakingInfo('Staked!')
        } catch (error) {
            console.log(error)
            setStakingInfo('An error occured :(')
            return
        }

        // Update the displayed staking Balance and Reset the stakingAmount
        await updateBalances()
        setStakingAmount(0.0)
    }

    async function handleFundSubmit(e) {
        e.preventDefault()

        // Check that the amount is > 0
        if (fundingAmount <= 0) {
            setFundingInfo('Fund an amount > 0')
            return
        }

        // Parse the amount into wei
        const fundingAmountWei = ethers.utils.parseEther(fundingAmount.toString())

        // Initialize the contracts
        const linkAddress = contractAddresses[chain.id]['LINK']
        const linkAbi = contractAbis[chain.id]['ERC20']
        const linkContract = new ethers.Contract(linkAddress, linkAbi, signer)
        const tradingBotAddress = contractAddresses[chain.id]['TradingBotV3']
        const tradingBotAbi = contractAbis[chain.id]['TradingBotV3']
        const tradingBotContract = new ethers.Contract(tradingBotAddress, tradingBotAbi, signer)

        // Approve the bot contract to spend your WETH
        try {
            const txResponse = await linkContract.approve(tradingBotAddress, fundingAmountWei)
            setFundingInfo('Approving...')
            const txReceipt = await txResponse.wait()
            setFundingInfo('Approved!')
            console.log(txReceipt)
        } catch (error) {
            console.log(error)
            setFundingInfo('An error occured :(')
            return
        }

        // Wait 1 second
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Stake the amount into the contract
        try {
            const txResponse = await tradingBotContract.fund(
                fundingAmountWei
                // {
                // gasLimit: 5000000,
                // }
            )
            setFundingInfo('Funding...')
            const txReceipt = await txResponse.wait()
            setFundingInfo('Fund!')
        } catch (error) {
            console.log(error)
            setFundingInfo('An error occured :(')
            return
        }

        // Update the displayed funding Balance and Reset the fundingAmount
        await updateBalances()
        setFundingAmount(0.0)
    }

    async function withdrawStaking() {
        // Initialize the contract
        const tradingBotAddress = contractAddresses[chain.id]['TradingBotV3']
        const tradingBotAbi = contractAbis[chain.id]['TradingBotV3']
        const tradingBotContract = new ethers.Contract(tradingBotAddress, tradingBotAbi, signer)

        // Withdraw the staking from the contract
        try {
            const txResponse = await tradingBotContract.unstake()
            setWithdrawStakingInfo('Withdrawing...')
            const txReceipt = await txResponse.wait()
            setWithdrawStakingInfo('Withdrawed!')
        } catch (error) {
            console.log(error)
            setWithdrawStakingInfo('An error occured :(')
            return
        }

        // Update the displayed staking Balance
        await updateBalances()
    }

    async function withdrawFunds() {
        // Initialize the contract
        const tradingBotAddress = contractAddresses[chain.id]['TradingBotV3']
        const tradingBotAbi = contractAbis[chain.id]['TradingBotV3']
        const tradingBotContract = new ethers.Contract(tradingBotAddress, tradingBotAbi, signer)

        // Withdraw the staking from the contract
        try {
            const txResponse = await tradingBotContract.withdrawFunds()
            setWithdrawFundingInfo('Withdrawing...')
            const txReceipt = await txResponse.wait()
            setWithdrawFundingInfo('Withdrawed!')
        } catch (error) {
            console.log(error)
            setWithdrawFundingInfo('An error occured :(')
            return
        }

        // Update the displayed staking Balance
        await updateBalances()
    }

    async function updateBalances() {
        const tradingBotAddress = contractAddresses[chain.id]['TradingBotV3']
        const tradingBotAbi = contractAbis[chain.id]['TradingBotV3']
        const tradingBotContract = new ethers.Contract(tradingBotAddress, tradingBotAbi, signer)

        const sBalance = await tradingBotContract.stakingBalance(address)
        const fBalance = await tradingBotContract.fundingBalance(address)
        const tBalance = await tradingBotContract.tradingBalance(address)
        const sBalanceString = ethers.utils.formatEther(sBalance)
        const fBalanceString = ethers.utils.formatEther(fBalance)
        const tBalanceString = ethers.utils.formatEther(tBalance)

        setStakingBalance(Number(sBalanceString).toFixed(8))
        setFundingBalance(Number(fBalanceString).toFixed(8))
        setTradingBalance(Number(tBalanceString).toFixed(8))
    }

    async function updateSymbols() {
        const tradingBotAddress = contractAddresses[chain.id]['TradingBotV3']
        const tradingBotAbi = contractAbis[chain.id]['TradingBotV3']
        const tradingBotContract = new ethers.Contract(tradingBotAddress, tradingBotAbi, signer)

        const stakeSymbolBytes32 = await tradingBotContract.i_stakedTokenSymbol()
        const tradeSymbolBytes32 = await tradingBotContract.i_tradedTokenSymbol()
        const stakeSymbol = ethers.utils.parseBytes32String(stakeSymbolBytes32)
        const tradeSymbol = ethers.utils.parseBytes32String(tradeSymbolBytes32)

        setStakingTokenSymbol(stakeSymbol)
        setTradedTokenSymbol(tradeSymbol)
    }

    async function handleCreateBotSubmit(e) {
        e.preventDefault()

        // Check that the amount is > 0
        if (botOrderInterval <= 0 || botOrderSize <= 0) {
            setBotInfo('Order Interval and Order Size must be >= 0')
            return
        }

        // Parse the orderSize into wei
        const botOrderSizeWei = ethers.utils.parseEther(botOrderSize.toString())

        // Initialize the contract
        const tradingBotAddress = contractAddresses[chain.id]['TradingBotV3']
        const tradingBotAbi = contractAbis[chain.id]['TradingBotV3']
        const tradingBotContract = new ethers.Contract(tradingBotAddress, tradingBotAbi, signer)

        // registerNewAutomation from the contract
        try {
            const txResponse = await tradingBotContract.registerNewAutomation(
                botName,
                ethers.utils.parseEther('0.000000000000999999'), // gasLimit
                ethers.utils.parseEther('5.0'), // fundingAmount
                botOrderInterval,
                botOrderSizeWei
            )
            setBotInfo('Creating...')
            const txReceipt = await txResponse.wait()
            setBotInfo('Bot Created!')
        } catch (error) {
            console.log(error)
            setBotInfo('An error occured :(')
            return
        }

        await mintNFT()
    }

    async function mintNFT() {
        const robotNftAddress = contractAddresses[chain.id]['RobotNFT']
        const robotNftAbi = contractAbis[chain.id]['RobotNFT']
        const robotNftContract = new ethers.Contract(robotNftAddress, robotNftAbi, signer)

        // mint the nft
        try {
            const txResponse = await robotNftContract.mint({ value: 0 })
            setBotInfo('Minting...')
            const txReceipt = await txResponse.wait()
            setBotInfo('NFT minted!')
        } catch (error) {
            console.log(error)
            setBotInfo('An error occured during nft minting:(')
            return
        }
    }

    async function updateEvents() {
        // Initialize the contract
        const tradingBotAddress = contractAddresses[chain.id]['TradingBotV3']
        const tradingBotAbi = contractAbis[chain.id]['TradingBotV3']
        const tradingBotContract = new ethers.Contract(tradingBotAddress, tradingBotAbi, signer)

        const filterTradeOccuredByUser = tradingBotContract.filters.TradeOccured(address, null)

        const tradeEvents = await tradingBotContract.queryFilter(filterTradeOccuredByUser)
        console.log(tradeEvents)
        setTradeEvents(tradeEvents)
    }

    async function updateNFT() {
        // Initialize the contract
        const robotNftAddress = contractAddresses[chain.id]['RobotNFT']
        const robotNftAbi = contractAbis[chain.id]['RobotNFT']
        const robotNftContract = new ethers.Contract(robotNftAddress, robotNftAbi, signer)

        // get the tokenId
        const tokenId = await robotNftContract.ownerToTokenId(address)

        if (Number(ethers.utils.formatEther(tokenId)) == 0) {
            console.log("user doesn't have nft yet")
            return
        }

        // get the URI
        const tokenUri = await robotNftContract.tokenURI(tokenId)
        console.log(tokenUri)

        setNftUri(tokenUri)
    }

    useEffect(() => {
        if (isConnected && signer && chain.id) {
            updateBalances()
            updateEvents()
            updateSymbols()
            updateNFT()
        }
    }, [isConnected, signer])

    if (isConnecting || isDisconnected) {
        return (
            <div className="min-h-screen w-full flex flex-col justify-center items-center">
                <div className="text-gray-800 dark:text-gray-300 text-3xl font-light">
                    Connect Your Wallet
                </div>
            </div>
        )
    }
    return (
        <div className="min-h-screen flex flex-col">
            <div className="w-full max-w-4xl mx-auto rounded-xl mt-32 px-6 flex flex-col justify-start items-center bg-white dark:bg-gray-850 shadow-md dark:shadow-lg">
                {/* Title */}
                <div className="h-16 pt-4 flex flex-row justify-center items-center text-black dark:text-white text-2xl font-semibold">
                    <div>1. Add some LINK Funds</div>
                </div>
                {/* - Funding Row - */}
                <div className="h-24 w-full px-3 flex flex-row justify-between items-start pt-5 mb-3">
                    {/* - Funding Form - */}
                    <div className="flex flex-col justify-center items-center">
                        <form onSubmit={handleFundSubmit} className="flex flex-row">
                            <button
                                type="submit"
                                className="h-12 px-5 rounded-l-lg text-white dark:text-gray-850 
                                bg-blue-500 dark:bg-blue-400 hover:bg-blue-600 hover:dark:bg-blue-500"
                            >
                                Fund
                            </button>
                            <input
                                className="h-12 w-36 text-start text-gray-500 dark:text-gray-850 bg-gray-100 dark:bg-gray-200 border-gray-100 dark:border-gray-200 rounded-r-lg"
                                name="fundingAmount"
                                id="fundingAmount"
                                type="number"
                                placeholder="6.0 LINK"
                                required={true}
                                value={fundingAmount}
                                onChange={(e) => setFundingAmount(e.target.value)}
                            />
                        </form>
                        <div className="mt-1.5 text-gray-800 dark:text-gray-300 text-sm font-semibold">
                            {fundingInfo}
                        </div>
                    </div>
                    {/* - Funding Balance - */}
                    <div className="flex flex-row justify-start items-center">
                        <div className="h-12 px-4 rounded-l-md border border-gray-200 text-gray-800 dark:text-gray-300 flex flex-col justify-center items-start">
                            <div>
                                {fundingBalance}{' '}
                                <span className="text-blue-500 dark:text-blue-400">LINK</span>{' '}
                            </div>
                        </div>
                        <Image
                            className="w-12 h-12 bg-gray-300 dark:bg-gray-200 rounded-r-md border border-gray-300 dark:border-gray-200
                            filter brightness-110 dark:brightness-100"
                            src={'/images/link-token-2.png'}
                            alt=""
                            width={36}
                            height={36}
                        />
                    </div>
                </div>
                <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-200"></div>
                {/* Title */}
                <div className="h-16 pt-4 flex flex-row justify-center items-center text-black dark:text-white text-2xl font-semibold">
                    <div>2. Stake some WETH</div>
                </div>
                {/* - Staking Row - */}
                <div className="h-24 w-full px-3 flex flex-row justify-between items-start pt-5 mb-4">
                    {/* - Stake Form - */}
                    <div className="flex flex-col justify-center items-center">
                        <form onSubmit={handleStakeSubmit} className="flex flex-row">
                            <button
                                type="submit"
                                className="h-12 px-5 rounded-l-lg text-white dark:text-gray-850 
                                bg-indigo-400 dark:bg-indigo-400 hover:bg-indigo-500 hover:dark:bg-indigo-500"
                            >
                                Stake
                            </button>
                            <input
                                className="h-12 w-36 text-start text-gray-700 dark:text-gray-850 bg-gray-100 dark:bg-gray-200 border-gray-100 dark:border-gray-200 rounded-r-lg"
                                name="stakingAmount"
                                id="stakingAmount"
                                type="number"
                                placeholder="1.0 WETH"
                                required={true}
                                value={stakingAmount}
                                onChange={(e) => setStakingAmount(e.target.value)}
                            />
                        </form>
                        <div className="mt-1.5 text-gray-800 dark:text-gray-300 text-sm font-semibold">
                            {stakingInfo}
                        </div>
                    </div>

                    {/* - Staking Balance - */}
                    <div className="flex flex-row justify-start items-center">
                        <div className="h-12 px-4 rounded-l-md border border-gray-200 text-gray-800 dark:text-gray-300 flex flex-col justify-center items-start">
                            <div>
                                {stakingBalance}{' '}
                                <span className="text-indigo-400 dark:text-indigo-300">
                                    {stakingTokenSymbol}
                                </span>{' '}
                            </div>
                        </div>
                        <Image
                            className="w-12 h-12 bg-gray-300 dark:bg-gray-200 rounded-r-md border border-gray-300 dark:border-gray-200
                            filter brightness-110 dark:brightness-100"
                            src={'/images/eth-token-2.png'}
                            alt=""
                            width={36}
                            height={36}
                        />
                    </div>
                </div>

                <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-200"></div>
                {/* - Create New Bot - */}
                <div className="w-full px-3 flex flex-col justify-start items-center">
                    {/* Title */}
                    <div className="h-16 pt-4 flex flex-row justify-center items-center text-black dark:text-white text-2xl font-semibold">
                        <div>3. Create a New Automated Bot</div>
                    </div>
                    {/* Form */}
                    {/* <form
                        onSubmit={handleCreateBotSubmit}
                        className="w-full flex flex-col justify-start items-center mt-8"
                    >
                        <div className="w-full flex flex-row justify-between items-center">
                            <div className="flex flex-col">
                                <div className="py-0.5 px-5 text-center rounded-t-lg border-t border-x border-gray-200 dark:border-gray-100">
                                    <div
                                        className="text-transparent bg-clip-text bg-gradient-to-r
                                        from-purple-500/90 via-pink-500/90 to-yellow-500/90
                                        dark:from-purple-300 dark:via-pink-300 dark:to-yellow-300"
                                    >
                                        Bot Name
                                    </div>
                                </div>
                                <input
                                    className="h-10 w-40 text-start pl-2.5 text-gray-500 dark:text-gray-850 bg-gray-200 dark:bg-gray-100 border-gray-100 dark:border-gray-200 rounded-b-md"
                                    name="botName"
                                    id="botName"
                                    type="string"
                                    required={true}
                                    value={botName}
                                    onChange={(e) => setBotName(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col">
                                <div className="py-0.5 px-5 text-center rounded-t-lg border-t border-x border-gray-200 dark:border-gray-100">
                                    <div
                                        className="text-transparent bg-clip-text bg-gradient-to-r
                                        from-purple-500/90 via-pink-500/90 to-yellow-500/90
                                        dark:from-purple-300 dark:via-pink-300 dark:to-yellow-300"
                                    >
                                        Order Interval
                                    </div>
                                </div>
                                <input
                                    className="h-10 w-40 text-start pl-2.5 text-gray-500 dark:text-gray-850 bg-gray-100 dark:bg-gray-100 border-gray-100 dark:border-gray-200 rounded-b-md"
                                    name="botOrderInterval"
                                    id="botOrderInterval"
                                    type="number"
                                    required={true}
                                    value={botOrderInterval}
                                    onChange={(e) => setBotOrderInterval(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col">
                                <div className="py-0.5 px-5 text-center rounded-t-lg border-t border-x border-gray-200 dark:border-gray-100">
                                    <div
                                        className="text-transparent bg-clip-text bg-gradient-to-r
                                        from-purple-500/90 via-pink-500/90 to-yellow-500/90
                                        dark:from-purple-300 dark:via-pink-300 dark:to-yellow-300"
                                    >
                                        Order Size
                                    </div>
                                </div>
                                <input
                                    className="h-10 w-40 text-start text-gray-500 dark:text-gray-850 bg-gray-100 dark:bg-gray-100 border-gray-100 dark:border-gray-200 rounded-b-md"
                                    name="botOrderSize"
                                    id="botOrderSize"
                                    type="number"
                                    required={true}
                                    value={botOrderSize}
                                    onChange={(e) => setBotOrderSize(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="h-10 w-24 text-center mt-10 mb-6 rounded-md text-white dark:text-gray-850 
                            bg-red-400 dark:bg-red-300 hover:bg-red-500 hover:dark:bg-red-400"
                        >
                            Create
                        </button>
                        <div className="mt-1.5 text-gray-800 dark:text-gray-300 text-sm font-semibold">
                            {botInfo}
                        </div>
                    </form> */}
                    <div className="h-72 w-full flex flex-row justify-start items-center">
                        {/* - Robot & Tree - */}
                        <div className="flex flex-row h-48">
                            <div className="h-full w-28 flex mr-2 flex-col justify-center items-center">
                                <Image
                                    className=""
                                    src={'/images/wall-eth-logo.png'}
                                    alt=""
                                    width={112}
                                    height={112}
                                />
                            </div>
                            <div className="h-full w-24 flex flex-col justify-center items-center">
                                <div className="w-full h-[1px] bg-gray-300 dark:bg-gray-200"></div>
                            </div>
                            <div className="h-full w-16 flex flex-col justify-between items-center">
                                <div className="h-1/2 w-full rounded-tl-[32px] border-t border-l border-gray-300 dark:border-gray-200"></div>
                                <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-200"></div>
                                <div className="h-1/2 w-full rounded-bl-[32px] border-b border-l border-gray-300 dark:border-gray-200"></div>
                            </div>
                        </div>
                        {/* Form */}
                        <form
                            onSubmit={handleCreateBotSubmit}
                            className="h-full w-full flex flex-row justify-center items-stretch"
                        >
                            <div className="h-full flex flex-col justify-between items-start py-6">
                                {/* Name */}
                                <div className="flex flex-row text-[15px]">
                                    <div
                                        className="h-11 w-28 pl-3 flex justify-start items-center rounded-l-md text-white dark:text-gray-850 
                                        bg-violet-400 dark:bg-violet-400"
                                    >
                                        Bot Name
                                    </div>
                                    <input
                                        className="h-11 w-40 text-[15px] text-start pl-2.5 text-gray-500 dark:text-gray-850 bg-gray-200 dark:bg-gray-100 border-gray-100 dark:border-gray-200 rounded-r-md"
                                        name="botName"
                                        id="botName"
                                        type="string"
                                        required={true}
                                        value={botName}
                                        onChange={(e) => setBotName(e.target.value)}
                                    />
                                </div>
                                {/* Order Interval */}
                                <div className="flex flex-row text-[15px]">
                                    <div
                                        className="h-11 w-28 pl-3 flex justify-start items-center rounded-l-md text-white dark:text-gray-850 
                                        bg-purple-400 dark:bg-purple-400"
                                    >
                                        Order Interval
                                    </div>
                                    <input
                                        className="h-11 w-40 text-[15px] text-start pl-2.5 text-gray-500 dark:text-gray-850 bg-gray-100 dark:bg-gray-100 border-gray-100 dark:border-gray-200 rounded-r-md"
                                        name="botOrderInterval"
                                        id="botOrderInterval"
                                        type="number"
                                        required={true}
                                        value={botOrderInterval}
                                        onChange={(e) => setBotOrderInterval(e.target.value)}
                                    />
                                </div>
                                {/* Order Size */}
                                <div className="flex flex-row text-[15px]">
                                    <div
                                        className="h-11 w-28 pl-3 flex justify-start items-center rounded-l-md text-white dark:text-gray-850 
                                        bg-fuchsia-400 dark:bg-fuchsia-400"
                                    >
                                        Order Size
                                    </div>
                                    <input
                                        className="h-11 w-40 text-[15px] text-start text-gray-500 dark:text-gray-850 bg-gray-100 dark:bg-gray-100 border-gray-100 dark:border-gray-200 rounded-r-md"
                                        name="botOrderSize"
                                        id="botOrderSize"
                                        type="number"
                                        required={true}
                                        value={botOrderSize}
                                        onChange={(e) => setBotOrderSize(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="h-full w-full flex flex-col justify-center items-end">
                                <button
                                    type="submit"
                                    className="h-10 pl-5 pr-4 text-center rounded-md text-white dark:text-gray-850 
                                       bg-gradient-to-br from-violet-400 via-purple-400 to-fuchsia-400
                                       hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500"
                                >
                                    <div className="flex flex-row justify-center items-center">
                                        <div>Launch</div>
                                        <RocketLaunchIcon className="w-6 h-6 ml-2" />
                                    </div>
                                </button>
                                <div className="w-[117px] flex flex-row justify-center items-center">
                                    <div className="mt-1.5 text-gray-800 dark:text-gray-300 text-sm font-semibold">
                                        {botInfo}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-200"></div>
                {/* - Manage your Bot - */}
                <div className="h-16 pt-4 flex flex-row justify-center items-center text-black dark:text-white text-2xl font-semibold">
                    <div>Manage Your Trading Bot</div>
                </div>
                {/* - NFT - */}
                {nftUri && (
                    <div className="w-full mt-4 flex flex-row justify-center items-center">
                        <Image
                            className=""
                            src={`https://gateway.pinata.cloud/${nftUri}`}
                            width={128}
                            height={197}
                            alt=""
                        />
                    </div>
                )}

                {/* List of Trades */}
                {tradeEvents &&
                    tradeEvents.map((tradeEvent, index) => (
                        <div
                            key={tradeEvent.transactionHash}
                            className={`h-14 w-full px-3 flex flex-row justify-center items-center ${
                                index == 0 ? 'mt-4' : 'mt-0'
                            }`}
                        >
                            <div className="w-1/3 text-left text-lg text-gray-850 dark:text-gray-100">
                                {index + 1}
                            </div>
                            <div className="w-1/3 text-black dark:text-white flex flex-row justify-center items-center">
                                <div>
                                    {Number(ethers.utils.formatEther(tradeEvent.args[1])).toFixed(
                                        8
                                    )}{' '}
                                    <span className="text-indigo-400 dark:text-indigo-300">
                                        {stakingTokenSymbol}
                                    </span>
                                </div>
                                <ArrowLongRightIcon className="w-8 h-8 mx-1" />
                                <div>
                                    {Number(ethers.utils.formatEther(tradeEvent.args[2])).toFixed(
                                        8
                                    )}{' '}
                                    <span className="text-pink-400 dark:text-pink-300">
                                        {tradedTokenSymbol}
                                    </span>
                                </div>
                            </div>
                            <div className="w-1/3 text-right text-gray-850 dark:text-gray-100">
                                <a
                                    target="_blank"
                                    href={`https://goerli.etherscan.io/tx/${tradeEvent.transactionHash}`}
                                    rel="noopener noreferrer"
                                >
                                    <span className="hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-br hover:from-purple-400 hover:via-fuchsia-400 hover:to-pink-400">
                                        {sliceAddress(tradeEvent.transactionHash)}
                                    </span>
                                </a>
                            </div>
                        </div>
                    ))}

                {/* - Manage - */}
                <div className="h-24 w-full px-3 flex flex-row justify-between items-start pt-5">
                    <div className="h-12 flex justify-start items-center text-lg text-black dark:text-white ">
                        Trading Balance
                    </div>
                    {/* - Trading Balance - */}
                    <div className="flex flex-row justify-start items-center">
                        <div className="h-12 px-4 rounded-l-md border border-gray-200 text-gray-800 dark:text-gray-300 flex flex-col justify-center items-start">
                            <div>
                                {tradingBalance}{' '}
                                <span className="text-pink-400 dark:text-pink-300">
                                    {tradedTokenSymbol}
                                </span>{' '}
                            </div>
                        </div>
                        <Image
                            className="w-12 h-12 bg-gray-300 dark:bg-gray-200 rounded-r-md border border-gray-300 dark:border-gray-200
                            filter brightness-110 dark:brightness-100"
                            src={'/images/uni-token.png'}
                            alt=""
                            width={36}
                            height={36}
                        />
                    </div>
                </div>
                <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-200"></div>
                {/* - Withdraw - */}
                <div className="h-16 pt-4 flex flex-row justify-center items-center text-black dark:text-white text-2xl font-semibold">
                    <div>Withdraw</div>
                </div>
                <div className="h-24 w-full px-3 flex flex-row justify-between items-start pt-5">
                    {/* - Withdraw Staking Button - */}
                    <div className="flex flex-col justify-center items-center">
                        <button
                            type="button"
                            onClick={withdrawStaking}
                            className="h-12 px-5 flex flex-row justify-center items-center rounded-lg text-white dark:text-gray-850 
                            bg-red-400 dark:bg-red-300 hover:bg-red-500 hover:dark:bg-red-400"
                        >
                            <ArrowTopRightOnSquareIcon className="w-5 h-5 rotate-[270deg] mr-1" />
                            <div>Staking</div>
                        </button>
                        <div className="mt-1.5 text-gray-800 dark:text-gray-300 text-sm font-semibold">
                            {withdrawStakingInfo}
                        </div>
                    </div>
                    {/* - Withdraw Button - */}
                    <div className="flex flex-col justify-center items-center">
                        <button
                            type="button"
                            onClick={withdrawFunds}
                            className="h-12 px-5 flex flex-row justify-center items-center rounded-lg text-white dark:text-gray-850 
                            bg-red-400 dark:bg-red-300 hover:bg-red-500 hover:dark:bg-red-400"
                        >
                            <div>Funding</div>
                            <ArrowTopRightOnSquareIcon className="w-5 h-5 ml-1" />
                        </button>
                        <div className="mt-1.5 text-gray-800 dark:text-gray-300 text-sm font-semibold">
                            {withdrawFundingInfo}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
