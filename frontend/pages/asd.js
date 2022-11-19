import Head from 'next/head'
import Image from 'next/image'
import DarkmodeToggle from '../components/DarkmodeToggle'
import styles from '../styles/Home.module.css'
import { getRandomAvatar } from '../utils/getRandomAvatar'
import { useAccount } from 'wagmi'

export default function Home() {
    const { address, isConnecting, isDisconnected, isConnected } = useAccount()

    if (isConnecting) {
        return <div></div>
    }
    return (
        <div className="relative min-h-screen blur-md bg-blend-normal dark:bg-blend-darken">
            <div className="absolute top-0 left-0 min-h-screen w-full bg-[url('/avatars/wall-e-bot-2.png')] bg-no-repeat bg-center bg-cover"></div>
            <div className="absolute top-0 left-0 min-h-screen w-full bg-gradient-to-t from-gray-850 via-gray-850/70 to-gray-850/40"></div>
        </div>
    )
}
