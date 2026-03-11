import { useState } from 'react'
import { useTranslation } from '../../node_modules/react-i18next'
import { Link } from 'react-router-dom'
import { Menu, X, User, LogOut } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../contexts/AuthContext'
import logo from '../assets/logo.png'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const isAmharic = i18n.language === 'am'
  const { user, logout } = useAuth()

  const navigation = [
    { name: t('navbar.home'), href: '/' },
    { name: t('navbar.services'), href: '/services' },
    { name: t('navbar.gallery'), href: '/gallery' },
    { name: t('navbar.booking'), href: '/booking' },
    { name: t('navbar.contact'), href: '/contact' },
  ]

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <nav className="bg-white dark:bg-neutral-900 fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with padding */}
          <div className="flex-shrink-0 pl-2 md:pl-0">
            <Link to="/" className="flex items-center">
              {/* <img
                className="h-12 w-12"  // Slightly larger logo
                src={logo}
                alt="event"
              /> */}
              <span className="ml-3 text-3xl font-serif font-bold font-s-1000 text-green-700 dark:text-emerald-400 hidden md:block">
                Event Management
              </span>
            </Link>
          </div>

          {/* Centered Navigation Items - Desktop */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-4 py-3 rounded-md text-md font-medium transition-all duration-200 relative group mx-1"
                >
                  {item.name}
                  {/* Hover underline effect */}
                  <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 transition-all duration-200 group-hover:w-4/5"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right side items with padding */}
          <div className="flex items-center space-x-3 pr-2 md:pr-0">
            <div className="hidden md:flex items-center space-x-4">
              <div className="px-2">
                <LanguageSwitcher />
              </div>
              <div className="px-2">
                <ThemeToggle />
              </div>
              {user ? (
                <div className="flex items-center space-x-4 pl-4 border-l border-gray-200 dark:border-neutral-700 ml-2">
                  <Link
                    to="/profile"
                    className="flex items-center text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-800 transition-colors duration-200"
                  >
                    <User size={18} className="mr-2" />
                    <span className="font-medium">{user.firstName}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-500 p-2 rounded-lg bg-gray-50 dark:bg-neutral-800 transition-colors duration-200"
                    title={isAmharic ? 'ውጣ' : 'Sign out'}
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-neutral-700 ml-2">
                  <Link
                    to="/login"
                    className="text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 bg-gray-50 dark:bg-neutral-800"
                  >
                    {isAmharic ? 'ግባ' : 'Sign In'}
                  </Link>
                  <Link
                    to="/register"
                    className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border-2 border-emerald-600 hover:border-emerald-700 dark:border-emerald-700 dark:hover:border-emerald-600 shadow-sm dark:shadow-neutral-900/50"
                  >
                    {isAmharic ? 'ይመዝገቡ' : 'Sign Up'}
                  </Link>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center pl-3">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 p-3 rounded-lg bg-gray-50 dark:bg-neutral-800 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-700 shadow-lg dark:shadow-neutral-950/50">
          <div className="px-4 pt-3 pb-6 space-y-2">
            {/* Mobile navigation items */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 bg-gray-50 dark:bg-neutral-800"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="pt-4 pb-2 border-t border-gray-200 dark:border-neutral-700">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between px-2 py-2">
                  <div className="flex-grow mr-3">
                    <LanguageSwitcher />
                  </div>
                  <div className="flex-grow">
                    <ThemeToggle />
                  </div>
                </div>
                
                {user ? (
                  <div className="flex items-center justify-between pt-2">
                    <Link
                      to="/profile"
                      className="flex items-center text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-4 py-3 rounded-lg bg-gray-50 dark:bg-neutral-800 flex-grow mr-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <User size={18} className="mr-3" />
                      <span className="font-medium">{user.firstName}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-500 p-3 rounded-lg bg-gray-50 dark:bg-neutral-800 transition-colors duration-200"
                      title={isAmharic ? 'ውጣ' : 'Sign out'}
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link
                      to="/login"
                      className="text-center text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-4 py-3 rounded-lg text-base font-medium bg-gray-50 dark:bg-neutral-800 transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {isAmharic ? 'ግባ' : 'Sign In'}
                    </Link>
                    <Link
                      to="/register"
                      className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-center px-4 py-3 rounded-lg text-base font-medium border-2 border-emerald-600 hover:border-emerald-700 dark:border-emerald-700 dark:hover:border-emerald-600 shadow-sm dark:shadow-neutral-900/50 transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {isAmharic ? 'ይመዝገቡ' : 'Sign Up'}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar