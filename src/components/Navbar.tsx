import { LuFileImage, LuFileVideo } from 'react-icons/lu';
import { HashLink } from 'react-router-hash-link';
import { useState, useRef, useEffect } from 'react';
import { FiUser, FiSettings, FiLogOut, FiChevronDown } from 'react-icons/fi';

import ImageGrid from './ImageGrid';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function NavBar() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <header className={`${isHome && 'min-h-[100vh]'} relative`}>
      {isHome && <div className="wrapper">
        <div className="white-side"></div>
        <div className="blue-side"></div>
      </div>}
      <nav className="z-10 flex justify-between items-center px-[6rem] py-[2rem]">
        <Link to="/" className="flex justify-center items-center gap-4">
          <img
            src="https://camo.githubusercontent.com/b49b9311b30b33b5c18db8c62b26052414f6b5b875dec629ee8684f6af3e68d4/68747470733a2f2f66696c65732e636174626f782e6d6f652f65337261766b2e706e67"
            alt="HackClub CDN"
            width={100}
          />
          <span className="text-xl font-bold text-[#3e9478] inter">
            Hack Club CDN
          </span>
        </Link>
        <ul className="gap-14 font-semibold text-black/60 items-center hidden md:flex">
          <li>
            <HashLink to="/#about" className="nav-link" smooth={true}>
              About
            </HashLink>
          </li>
          <li>
            <HashLink to="/#features" className="nav-link" smooth={true}>
              Features
            </HashLink>
          </li>
          <li>
            {isLoading ? (
              <div className="green-glow-btn opacity-50 cursor-not-allowed">
                <svg className="animate-spin h-4 w-4 text-white inline mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </div>
            ) : isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 bg-gradient-to-br from-[#6bbf95] to-[#3e9478] text-white px-4 py-2 rounded-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 lg:min-w-[180px]"
                >
                  <img
                    src={user.image || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=3e9478&color=ffffff`}
                    alt={user.name || user.email}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=3e9478&color=ffffff`;
                    }}
                  />
                  <span className="font-medium truncate flex-1 text-left hidden lg:block">
                    {user.name || user.email.split('@')[0]}
                  </span>
                  <FiChevronDown className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.image || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=3e9478&color=ffffff`}
                          alt={user.name || user.email}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=3e9478&color=ffffff`;
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {user.name || 'User'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <a
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#3e9478] transition-colors"
                      >
                        <FiUser className="w-4 h-4" />
                        Dashboard
                      </a>
                      <a
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#3e9478] transition-colors"
                      >
                        <FiSettings className="w-4 h-4" />
                        Settings
                      </a>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth" className="green-glow-btn">
                Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
      {isHome && <div className="md:px-[6rem] md:py-[2rem] px-[2rem] flex flex-col md:flex-row md:justify-between h-[80vh]">
        <div className="left relative flex flex-col items-start md:w-[35%] md:mt-20 h-full">
            <h1 className="text-6xl text-center md:text-start">Manage all your <span className="text-[#51a079]">Media</span> in <span className="text-[#51a079]">one place</span></h1>
            <h4 className="mt-4 text-green-600">A CDN for Hack Clubbers, shipped by students for students.</h4>
            <div className="links flex gap-5">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="mt-10 block relative bg-transparent px-6 py-3 outline-2 outline-[#51a079] rounded-xl font-semibold text-[#3aa36d] hover:text-white hover:bg-[#51a079] transition-all duration-300 overflow-hidden before:w-full before:left-1/2 before:-translate-x-1/2 before:h-3 before:rounded-full before:absolute before:-bottom-1 before:blur-md before:bg-green-300">Go to Dashboard</Link>
                ) : (
                  <Link to="/auth" className="mt-10 block relative bg-transparent px-6 py-3 outline-2 outline-[#51a079] rounded-xl font-semibold text-[#3aa36d] hover:text-white hover:bg-[#51a079] transition-all duration-300 overflow-hidden before:w-full before:left-1/2 before:-translate-x-1/2 before:h-3 before:rounded-full before:absolute before:-bottom-1 before:blur-md before:bg-green-300">Get Started</Link>
                )}
                <a href="https://hackclub.com/" target='_blank' className="mt-10 block relative hover:bg-transparent px-6 py-3 outline-2 outline-[#a06351] rounded-xl font-semibold hover:text-[#a34a3a] text-white bg-[#a06351] transition-all duration-300 overflow-hidden before:w-full before:left-1/2 before:-translate-x-1/2 before:h-3 before:rounded-full before:absolute before:-bottom-1 before:blur-md before:bg-red-300">What is Hackclub?</a>
            </div>

            <div className="iconic w-15 h-15 p-3 rounded-2xl bg-amber-500 hidden sm:flex justify-center items-center text-white absolute bottom-0 mb-20 right-0 md:-left-20 lg:left-auto lg:right-0 before:absolute before:w-20 before:h-10 before:-z-10 before:bg-amber-500/60 before:-bottom-6 before:rounded-full before:blur-md">
                <LuFileImage fontSize={35} />
            </div>
            <div className="iconic w-15 h-15 p-3 rounded-2xl bg-pink-500 hidden md:flex justify-center items-center text-white md:absolute bottom-0 mb-100 -right-25 lg:-right-40 rotate-45 before:absolute before:w-20 before:h-10 before:-z-10 before:bg-pink-500/60 before:-bottom-6 before:rounded-full before:blur-md">
                <LuFileVideo fontSize={35} />
            </div>
        </div>

        <div className="right-grid mt-10 md:mt-0 md:w-1/2 h-[50vh] md:h-[80vh] pr-[1rem]">
            <ImageGrid />
        </div>
      </div>}
    </header>
  );
}
