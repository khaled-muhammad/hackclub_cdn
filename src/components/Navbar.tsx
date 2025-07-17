import { LuFileImage, LuFileVideo } from 'react-icons/lu';
import ImageGrid from './ImageGrid';

export default function NavBar() {
  return (
    <header className="min-h-[100vh] relative">
      <div className="wrapper">
        <div className="white-side"></div>
        <div className="blue-side"></div>
      </div>
      <nav className="z-10 flex justify-between items-center px-[6rem] py-[2rem]">
        <a href="/" className="flex justify-center items-center gap-4">
          <img
            src="https://camo.githubusercontent.com/b49b9311b30b33b5c18db8c62b26052414f6b5b875dec629ee8684f6af3e68d4/68747470733a2f2f66696c65732e636174626f782e6d6f652f65337261766b2e706e67"
            alt="HackClub CDN"
            width={100}
          />
          <span className="text-xl font-bold text-[#3e9478] inter">
            Hack Club CDN
          </span>
        </a>
        <ul className="flex gap-14 font-semibold text-black/60 items-center">
          <li>
            <a href="#" className="nav-link">
              About
            </a>
          </li>
          <li>
            <a href="#" className="nav-link">
              Features
            </a>
          </li>
          <li>
            <a href="#" className="nav-btn">
              Login
            </a>
          </li>
        </ul>
      </nav>
      <div className="px-[6rem] py-[2rem] flex flex-col justify-center h-[80vh]">
        <div className="left relative flex flex-col items-start w-[35%] mt-20 h-full">
            <h1 className="text-6xl">Manage all your <span className="text-[#51a079]">Media</span> in <span className="text-[#51a079]">one place</span></h1>
            <h4 className="mt-4 text-green-600">A CDN for Hack Clubbers, shipped by students for students.</h4>
            <div className="links flex gap-5">
                <a href="#" className="mt-10 block relative bg-transparent px-6 py-3 outline-2 outline-[#51a079] rounded-xl font-semibold text-[#3aa36d] hover:text-white hover:bg-[#51a079] transition-all duration-300 overflow-hidden before:w-full before:left-1/2 before:-translate-x-1/2 before:h-3 before:rounded-full before:absolute before:-bottom-1 before:blur-md before:bg-green-300">Get Started</a>
                <a href="https://hackclub.com/" target='_blank' className="mt-10 block relative hover:bg-transparent px-6 py-3 outline-2 outline-[#a06351] rounded-xl font-semibold hover:text-[#a34a3a] text-white bg-[#a06351] transition-all duration-300 overflow-hidden before:w-full before:left-1/2 before:-translate-x-1/2 before:h-3 before:rounded-full before:absolute before:-bottom-1 before:blur-md before:bg-red-300">What is Hackclub?</a>
            </div>

            <div className="iconic w-15 h-15 p-3 rounded-2xl bg-amber-500 flex justify-center items-center text-white absolute bottom-0 mb-20 right-0 before:absolute before:w-20 before:h-10 before:-z-10 before:bg-amber-500/60 before:-bottom-6 before:rounded-full before:blur-md">
                <LuFileImage fontSize={35} />
            </div>
            <div className="iconic w-15 h-15 p-3 rounded-2xl bg-pink-500 flex justify-center items-center text-white absolute bottom-0 mb-100 -right-40 rotate-45 before:absolute before:w-20 before:h-10 before:-z-10 before:bg-pink-500/60 before:-bottom-6 before:rounded-full before:blur-md">
                <LuFileVideo fontSize={35} />
            </div>
        </div>
        <ImageGrid />
      </div>
    </header>
  );
}
