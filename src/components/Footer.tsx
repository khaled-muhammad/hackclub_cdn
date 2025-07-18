import { FaGithub, FaHeart, FaCloud, FaRocket, FaUsers } from 'react-icons/fa';
import { FiMail, FiExternalLink } from 'react-icons/fi';

export default function Footer() {
    return (
        <footer className="relative bg-gradient-to-br from-[#f0fdf4] via-[#ecfdf5] to-[#f6fbf9] overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-10 left-20 w-24 h-24 bg-gradient-to-br from-[#caffe5]/20 to-[#7EEBC6]/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-tl from-[#3e9478]/15 to-[#caffe5]/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-gradient-to-r from-[#7EEBC6]/10 to-[#3e9478]/5 rounded-full blur-lg animate-pulse delay-2000"></div>
                
                {/* Subtle wave at top */}
                <div className="absolute top-0 left-0 w-full h-20 opacity-20">
                    <svg viewBox="0 0 1200 120" className="w-full h-full">
                        <path d="M0,60 Q300,20 600,60 T1200,40 L1200,0 L0,0 Z" fill="#3e9478" opacity="0.1"/>
                    </svg>
                </div>
            </div>

            <div className="container mx-auto px-6 py-16 relative z-10">
                <img className='absolute w-100 top-5 -left-30 -z-10 opacity-35' src='https://camo.githubusercontent.com/b49b9311b30b33b5c18db8c62b26052414f6b5b875dec629ee8684f6af3e68d4/68747470733a2f2f66696c65732e636174626f782e6d6f652f65337261766b2e706e67' alt="HackClub CDN" />
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand section */}
                    <div className="lg:col-span-2">
                        <div className="p-4 backdrop-blur-xs ring-3 ring-[#62ddb4] rounded-3xl w-fit">
                            <div className="flex items-center gap-3 mb-6">
                                <h3 className="text-2xl font-bold text-[#3e9478]">HackClub CDN</h3>
                            </div>
                            <p className="text-[#317f65] text-lg mb-6 max-w-md">
                                A secure, fast, and reliable content delivery network built for developers. 
                                Store, manage, and deliver your files with confidence.
                            </p>
                            <div className="flex gap-4">
                                <a href="https://github.com/khaled-muhammad/hackclub_cdn" target='_blank' className="group flex items-center gap-2 bg-[#e7f8f2] hover:bg-[#3e9478] px-4 py-2 rounded-lg transition-all duration-300">
                                    <FaGithub className="text-[#3e9478] group-hover:text-white transition-colors" />
                                    <span className="text-[#3e9478] group-hover:text-white text-sm font-medium">GitHub</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-[#3e9478] mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#features" className="text-[#317f65] hover:text-[#3e9478] transition-colors duration-200 flex items-center gap-2 group">
                                    <FaRocket className="text-xs opacity-60 group-hover:opacity-100 transition-opacity" />
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/hackclub/cdn" target='_blank' className="text-[#317f65] hover:text-[#3e9478] transition-colors duration-200 flex items-center gap-2 group">
                                    <FaCloud className="text-xs opacity-60 group-hover:opacity-100 transition-opacity" />
                                    API Docs
                                </a>
                            </li>
                            <li>
                                <a href="https://hackclub.com/slack" target='_blank' className="text-[#317f65] hover:text-[#3e9478] transition-colors duration-200 flex items-center gap-2 group">
                                    <FaUsers className="text-xs opacity-60 group-hover:opacity-100 transition-opacity" />
                                    Community
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-semibold text-[#3e9478] mb-6">Get in Touch</h4>
                        <div className="space-y-4">
                            <a href="mailto:khaledmuhmmed99@gmail.com" className="group flex items-center gap-3 text-[#317f65] hover:text-[#3e9478] transition-colors duration-200">
                                <div className="w-8 h-8 bg-[#e7f8f2] group-hover:bg-[#3e9478] rounded-lg flex items-center justify-center transition-colors duration-200">
                                    <FiMail className="text-[#3e9478] group-hover:text-white text-sm" />
                                </div>
                                <span className="text-sm">khaledmuhmmed99@gmail.com</span>
                            </a>
                            <a href="#" className="group flex items-center gap-3 text-[#317f65] hover:text-[#3e9478] transition-colors duration-200">
                                <div className="w-8 h-8 bg-[#e7f8f2] group-hover:bg-[#3e9478] rounded-lg flex items-center justify-center transition-colors duration-200">
                                    <FiExternalLink className="text-[#3e9478] group-hover:text-white text-sm" />
                                </div>
                                <span className="text-sm">Status Page</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="border-t border-[#caffe5]/30 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2 text-[#317f65]">
                            <span className="text-sm">Made with</span>
                            <FaHeart className="text-red-400 text-sm animate-pulse" />
                            <span className="text-sm">by the Khaled Muhammad</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-[#317f65]">
                            <a href="#" className="hover:text-[#3e9478] transition-colors duration-200">Privacy Policy</a>
                            <a href="#" className="hover:text-[#3e9478] transition-colors duration-200">Terms of Service</a>
                            <span>© 2025 HackClub CDN</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}