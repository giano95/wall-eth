import { useTheme } from 'next-themes'

export default function DarkmodeToggle({ className = '' }) {
    const { theme, setTheme, resolvedTheme } = useTheme()

    function toggleTheme() {
        if (resolvedTheme == 'light') {
            setTheme('dark')
        } else if (resolvedTheme == 'dark') {
            setTheme('light')
        } else {
            console.log('ERROR: theme value unmatching: ' + theme)
        }
    }

    return (
        <div className={`${className} flex items-center justify-center`}>
            <button
                onClick={toggleTheme}
                className=" bg-gray-350 dark:bg-gray-500 relative inline-flex h-[26px] md:h-[30px] w-[48px] md:w-[56px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75"
            >
                <span
                    aria-hidden="true"
                    className="translate-x-0 dark:translate-x-[22px] dark:md:translate-x-[26px] pointer-events-none inline-block h-[22px] md:h-[26px] w-[22px] md:w-[26px] transform rounded-full
                bg-white dark:bg-gray-700 shadow-lg ring-0 transition duration-200 ease-in-out"
                >
                    {/* moon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-[20px] w-[20px] m-[1px] md:m-[3px] hidden dark:block"
                        viewBox="0 0 20 20"
                        fill="#6b7280"
                    >
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                    {/* sun */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-[20px] w-[20px] m-[1px] md:m-[3px] dark:hidden"
                        viewBox="0 0 20 20"
                        fill="#B7BCC5"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                            clipRule="evenodd"
                        />
                    </svg>
                </span>
            </button>
        </div>
    )
}
