import '../styles/globals.css'
// Next-Themes
import { ThemeProvider } from 'next-themes'
// Rainbow-Kit
import '@rainbow-me/rainbowkit/styles.css'
import {
    getDefaultWallets,
    RainbowKitProvider,
    lightTheme,
    darkTheme,
    cssStringFromTheme,
} from '@rainbow-me/rainbowkit'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
// My Components
import Layout from '../components/Layout'

// Configure the chains and generate the required connectors
const { chains, provider } = configureChains(
    [chain.goerli, chain.polygon, chain.polygonMumbai],
    [
        alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_GOERLI_ALCHEMY_ID }),
        alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_POLYGON_ALCHEMY_ID }),
        alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_MUMBAI_ALCHEMY_ID }),
        publicProvider(),
    ]
)
const { connectors } = getDefaultWallets({
    appName: 'wall-eth',
    chains,
})
const wagmiClient = createClient({
    autoConnect: false,
    connectors,
    provider,
})

function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider attribute="class">
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider theme={null} chains={chains}>
                    <style
                        dangerouslySetInnerHTML={{
                            __html: `
                            :root {
                            ${cssStringFromTheme(
                                lightTheme({
                                    accentColor: '#9ca3af',
                                    borderRadius: 'medium',
                                    fontStack: 'system',
                                    overlayBlur: 'small',
                                })
                            )}
                            }
                            html[class="dark"] {
                            ${cssStringFromTheme(
                                darkTheme({
                                    accentColor: '#1f2937',
                                    borderRadius: 'medium',
                                    fontStack: 'system',
                                    overlayBlur: 'small',
                                })
                            )}
                            }
                        `,
                        }}
                    />
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </RainbowKitProvider>
            </WagmiConfig>
        </ThemeProvider>
    )
}

export default MyApp
