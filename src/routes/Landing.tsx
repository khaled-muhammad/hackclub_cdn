import { FaLock, FaFolder, FaTag, FaUserShield, FaRocket, FaCloud, FaUsers, FaCode, FaGlobe } from "react-icons/fa";
import { FiShield } from "react-icons/fi";

function Landing() {
  const cdnFeatures = [
    {
      name: "Privacy Controls",
      key: "privacy",
      description:
        "Manage who can view, access, or share your files with strong privacy settings.",
      icon: FaLock,
    },
    {
      name: "Folder Organization",
      key: "folders",
      description:
        "Structure your files in nested folders for easier navigation and management.",
      icon: FaFolder,
    },
    {
      name: "File Tags",
      key: "tags",
      description:
        "Add tags to files for quick filtering, searching, and better categorization.",
      icon: FaTag,
    },
    {
      name: "Secure Authentication",
      key: "auth",
      description:
        "Protect your account with strong login methods, including password and multi‑factor authentication.",
      icon: FaUserShield,
    },
  ];

  const aboutStats = [
    {
      icon: FaRocket,
      number: "99.9%",
      label: "Uptime"
    },
    {
      icon: FaGlobe,
      number: "150+",
      label: "Countries"
    },
    {
      icon: FaUsers,
      number: "10K+",
      label: "Developers"
    },
    {
      icon: FaCode,
      number: "24/7",
      label: "Support"
    }
  ];

  return (
    <>
      <section id="features" className="flex gap-4 flex-col relative overflow-hidden py-20">
        <div className="absolute inset-0 -z-20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f0fdf4] via-[#ecfdf5] to-[#f6fbf9]"></div>
          
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[#caffe5]/30 to-[#7EEBC6]/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-tl from-[#3e9478]/20 to-[#caffe5]/30 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-[#7EEBC6]/15 to-[#3e9478]/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-bl from-[#caffe5]/25 to-[#3e9478]/15 rounded-full blur-xl animate-pulse delay-500"></div>
          
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <svg viewBox="0 0 1200 800" className="w-full h-full">
              <defs>
                <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#caffe5" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#7EEBC6" stopOpacity="0.1"/>
                </linearGradient>
                <linearGradient id="wave2" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3e9478" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#caffe5" stopOpacity="0.1"/>
                </linearGradient>
              </defs>
              
              <path d="M0,200 Q300,150 600,200 T1200,180 L1200,0 L0,0 Z" fill="url(#wave1)" className="animate-pulse"/>
              <path d="M0,800 Q300,750 600,780 T1200,760 L1200,800 Z" fill="url(#wave2)" className="animate-pulse delay-1000"/>
            </svg>
          </div>
          
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, #3e9478 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <h1 className="text-6xl text-[#3e9478] font-bold text-center relative z-10">
          Features
        </h1>
        <div className="features-list grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-x-20 gap-y-20 justify-around mt-10 px-10 md:px-30 max-w-400 self-center relative z-10">
          {cdnFeatures.map((feature) => (
            <div className="card-wrapper relative">
              <div className="absolute w-1/2 min-w-60 h-2/3 bg-[#dff9f0] -z-10 rounded-4xl -left-10 -top-10"></div>
              <div
                key={feature.key}
                className="feature-card bg-[#e7f8f2] px-6 pb-2 pt-6 rounded-2xl flex flex-col items-center gap-4 ring-0 hover:ring-8 hover:drop-shadow-none transition-all duration-300 ring-[#f6fbf9] h-full drop-shadow-xl"
              >
                <h3 className="text-3xl font-semibold text-[#3e9478]">
                  {feature.name}
                </h3>
                <p className="mt-3 text-[#317f65] font-medium">
                  {feature.description}
                </p>
                <div className="water-bubble">
                  <feature.icon size={60} className="text-[#3e9478]/70" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section id="about" className="relative overflow-hidden py-20">
        <div className="absolute inset-0 -z-20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f6fbf9] via-[#f0fdf4] to-[#ecfdf5]"></div>
          
          <div className="absolute top-32 right-16 w-28 h-28 bg-gradient-to-br from-[#caffe5]/25 to-[#7EEBC6]/15 rounded-full blur-xl animate-pulse delay-500"></div>
          <div className="absolute bottom-40 left-20 w-36 h-36 bg-gradient-to-tl from-[#3e9478]/15 to-[#caffe5]/25 rounded-full blur-2xl animate-pulse delay-1500"></div>
          <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-gradient-to-r from-[#7EEBC6]/20 to-[#3e9478]/10 rounded-full blur-lg animate-pulse delay-3000"></div>
          
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 1200 600" className="w-full h-full">
              <defs>
                <linearGradient id="aboutWave1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3e9478" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#caffe5" stopOpacity="0.1"/>
                </linearGradient>
              </defs>
              <path d="M0,300 Q200,250 400,300 T800,280 Q1000,270 1200,300 L1200,600 L0,600 Z" fill="url(#aboutWave1)" className="animate-pulse"/>
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-bold text-[#3e9478] mb-6">About HackClub CDN</h2>
            <p className="text-xl text-[#317f65] max-w-3xl mx-auto leading-relaxed">
              A modern, developer-first content delivery network built by the HackClub community. 
              We provide fast, secure, and reliable file hosting with a focus on simplicity and performance.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="space-y-8">
              <div className="bg-[#e7f8f2]/50 backdrop-blur-sm p-8 rounded-3xl border border-[#caffe5]/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#3e9478] to-[#7EEBC6] rounded-xl flex items-center justify-center">
                    <FaCloud className="text-white text-xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#3e9478]">Our Mission</h3>
                </div>
                <p className="text-[#317f65] text-lg leading-relaxed">
                  To democratize content delivery by providing a free, open-source CDN that empowers developers 
                  worldwide to share their creations without barriers. We believe in making the web faster and 
                  more accessible for everyone.
                </p>
              </div>

              <div className="bg-[#e7f8f2]/50 backdrop-blur-sm p-8 rounded-3xl border border-[#caffe5]/30">
                <div className="flex items-center gap-4 mb-6">
                                     <div className="w-12 h-12 bg-gradient-to-br from-[#7EEBC6] to-[#3e9478] rounded-xl flex items-center justify-center">
                     <FiShield className="text-white text-xl" />
                   </div>
                  <h3 className="text-2xl font-bold text-[#3e9478]">Built for Developers</h3>
                </div>
                <p className="text-[#317f65] text-lg leading-relaxed">
                  From simple drag-and-drop uploads to powerful API integrations, our platform is designed 
                  with developers in mind. Clean documentation, reliable endpoints, and a supportive community 
                  make building with us a joy.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                {aboutStats.map((stat) => (
                  <div 
                    key={stat.label}
                    className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-[#caffe5]/30 hover:border-[#3e9478]/30 transition-all duration-300 hover:transform hover:scale-105"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#3e9478]/10 to-[#7EEBC6]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-[#3e9478]/20 group-hover:to-[#7EEBC6]/30 transition-all duration-300">
                        <stat.icon className="text-[#3e9478] text-2xl" />
                      </div>
                      <div className="text-4xl font-bold text-[#3e9478] mb-2">{stat.number}</div>
                      <div className="text-[#317f65] font-medium">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#caffe5]/30 to-[#7EEBC6]/20 rounded-full blur-xl -z-10"></div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-[#e7f8f2]/80 to-[#f0fdf4]/60 backdrop-blur-sm p-12 rounded-4xl border border-[#caffe5]/30 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-[#3e9478] mb-4">Ready to Get Started?</h3>
              <p className="text-[#317f65] text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of developers who trust HackClub CDN for their file hosting needs. 
                Start uploading your files today and experience the difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://github.com/khaled-muhammad/hackclub_cdn" 
                  target="_blank"
                  className="group bg-gradient-to-br from-[#3e9478] to-[#7EEBC6] text-white px-8 py-4 rounded-xl font-semibold hover:transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FaCode className="group-hover:rotate-12 transition-transform" />
                  View on GitHub
                </a>
                <a 
                  href="https://hackclub.com/slack" 
                  target="_blank"
                  className="group bg-white/80 backdrop-blur-sm text-[#3e9478] px-8 py-4 rounded-xl font-semibold border border-[#3e9478]/20 hover:border-[#3e9478]/40 hover:bg-[#e7f8f2] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FaUsers className="group-hover:scale-110 transition-transform" />
                  Join Community
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Landing;