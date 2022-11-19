import Footer from './Footer'
import Navbar from './Navbar'

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen font-iceberg bg-gray-100 dark:bg-gray-800">
            <Navbar />
            <main className="flex flex-col z-10 mt-20">
                {children}
                <Footer />
            </main>
        </div>
    )
}

export default Layout
