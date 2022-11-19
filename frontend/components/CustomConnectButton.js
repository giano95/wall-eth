import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import { WalletIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function CustomConnectButton() {
    return (
        <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                return (
                    <div
                        {...(!mounted && {
                            'aria-hidden': true,
                            style: {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!mounted || !account || !chain) {
                                return (
                                    // -- Connect Button --
                                    <button
                                        className="flex justify-center items-center bg-gray-750 dark:bg-gray-200 text-white dark:text-black rounded-lg px-5 py-2.5 text-center mr-3 xs:mr-0 hover:scale-105"
                                        onClick={openConnectModal}
                                        type="button"
                                    >
                                        <WalletIcon className="w-5 h-5" />
                                        <span className="ml-1.5 text-sm xs:text-base xs:font-light">
                                            Connect
                                        </span>
                                    </button>
                                )
                            }
                            if (chain.unsupported) {
                                return (
                                    // -- Change Network Button --
                                    <button
                                        className="flex justify-center items-center bg-gray-750 dark:bg-gray-200 text-white dark:text-black rounded-lg px-5 py-2.5 text-center mr-3 xs:mr-0 hover:scale-105"
                                        onClick={openChainModal}
                                        type="button"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                        <span className="ml-1.5 text-sm xs:text-base xs:font-light">
                                            Wrong Network
                                        </span>
                                    </button>
                                )
                            }

                            return (
                                <div className="flex flex-row gap-2 xs:gap-4 h-11">
                                    {/* -- Select Chain Button -- */}
                                    <button
                                        onClick={openChainModal}
                                        type="button"
                                        className="flex items-center bg-gray-750 dark:bg-gray-200 px-4 xs:px-8 py-3 rounded-lg hover:scale-105"
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                style={{
                                                    background: chain.iconBackground,
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: 999,
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {chain.iconUrl && (
                                                    <div className="filter  ">
                                                        <Image
                                                            src={chain.iconUrl}
                                                            alt={chain.name ?? 'Chain icon'}
                                                            width={24}
                                                            height={24}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <span className="hidden xs:block xs:ml-2 text-sm xs:text-base xs:font-light text-white dark:text-black">
                                            {chain.name}
                                        </span>
                                    </button>
                                    {/* -- Open Account Button -- */}
                                    <button
                                        onClick={openAccountModal}
                                        className="flex flex-row justify-center items-center bg-gray-750 dark:bg-gray-200 px-4 xs:px-8 py-4 rounded-lg hover:scale-105"
                                    >
                                        <div className="text-sm xs:text-base xs:font-light text-white dark:text-black">
                                            {account.displayName}
                                        </div>
                                    </button>
                                </div>
                            )
                        })()}
                    </div>
                )
            }}
        </ConnectButton.Custom>
    )
}
