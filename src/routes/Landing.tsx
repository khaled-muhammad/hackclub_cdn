import { FaLock, FaFolder, FaTag, FaUserShield } from "react-icons/fa";

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
    </>
  );
}

export default Landing;
