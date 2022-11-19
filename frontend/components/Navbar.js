import Image from 'next/image'
import CustomConnectButton from './CustomConnectButton'

export default function Navbar() {
    return (
        <nav className="px-4 sm:px-6 lg:px-8 xl:px-10 fixed w-full h-20 z-20 top-0 left-0 bg-gray-50 dark:bg-gray-850 shadow-xl dark:shadow-xl-inverse">
            <div className="flex flex-no-wrap w-full h-full justify-between items-center">
                {/* - Wall-ETH Logo - */}
                <div className="h-full w-60 flex flex-row justify-between items-center">
                    <div className="h-full flex flex-row justify-center items-end">
                        <Image
                            src="/avatars/robot-2.png"
                            alt="wall-eth-logo"
                            width={80}
                            height={80}
                        />
                    </div>
                    <div className="pl-3 pr-3 rounded-lg text-3xl font-extralight text-gray-800 dark:text-gray-200">
                        Wall-ETH
                    </div>
                </div>

                {/* - Connect Button - */}
                <div>
                    <CustomConnectButton />
                </div>
            </div>
        </nav>
    )
}
