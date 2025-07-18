import { useEffect, useState, useRef } from 'react';
import { FiImage, FiUpload } from 'react-icons/fi';

interface ImageItem {
  id: number;
  url: string;
}

const ImageGrid = () => {
  const sampleImages = [
    'https://hc-cdn.hel1.your-objectstorage.com/s/v3/749fed5fd6f02f9cb0f71a2e99d586fc60840254_screenshot_2025-07-17_162350.png',
    'https://hc-cdn.hel1.your-objectstorage.com/s/v3/8d031caaeea5bb98d3b1269dd45d4f5cf518bfc5_favicon__1_.png',
    'https://hc-cdn.hel1.your-objectstorage.com/s/v3/c9e3ce3c8fe9a183fbd6f557aab47388cc5c121d_Upside_down_gray_cat.png_v_1685551065',
    'https://hc-cdn.hel1.your-objectstorage.com/s/v3/547b7e0588cab033c14b99f39c3342f593991527_night-ocean-landscape-full-moon-stars-shine_107791-7397.jpg_semt_ais_hybrid_w_740',
    'https://hc-cdn.hel1.your-objectstorage.com/s/v3/feeaa1f30c7b5ab073c2a15291773ee870ab0048_MyDarlingWallpaperwithRustCreamNavyAbstract_2.png_v_1714434047_width_2048',
    'https://hc-cdn.hel1.your-objectstorage.com/s/v3/415038b32da538c5cecbe9a6d192bbfdfda89497_Blue-Red-Abstract-Wallpaper-Mural.jpg_v_1630171715',
    'https://hc-cdn.hel1.your-objectstorage.com/s/v3/631333dac100cf5919381239792c168a5972635b_4cbe8d_f1ed2800a49649848102c68fc5a66e53mv2.gif_fit_476_2C280_ssl_1',
    'https://hc-cdn.hel1.your-objectstorage.com/s/v3/4b8dd5a85f4e72a077d1f9c9f777b1bdc77b68d0_close-up-white-cat-with-blue-eyes-121224.jpg',
    'https://hc-cdn.hel1.your-objectstorage.com/s/v3/8cc0879cc3ad25220639dff1eda350e8fefd27e6_4641611401ecb508c625eebe448da663.gif',
    'https://hc-cdn.hel1.your-objectstorage.com/s/v3/8ebd20637c759617d6e68d6cc1d50b3a73afde69_6553880705836414d8c74f52_616f13c877f31341ccc486bc_05.PIZZA_BOY.gif',
    'https://hc-cdn.hel1.your-objectstorage.com/s/v3/33faa264c3ff339b9c406186106d03466a2fa741_120430.gif',
    'https://hc-cdn.hel1.your-objectstorage.com/s/v3/8093f1702157bec190bf1cdb7373bf6b8704b242_hq720.jpg_sqp_-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD_rs_AOn4CLACmz-5bThcSEO22XteyyOE7FcT3w',
    'https://hc-cdn.hel1.your-objectstorage.com/s/v3/c6fcf41fe05a2f1dc73253814f0746cb8e434e71_toptal-blog-image-1511848774845-37af5a0a36d3b4e38f471ba818809bed.gif',
    'https://hc-cdn.hel1.your-objectstorage.com/s/v3/c7cf65a81f4358b3a2339eb43ae0cfc7457dbbf4_original-e8c365daa123096eafdcf934036fa0ee.gif',
    'https://hc-cdn.hel1.your-objectstorage.com/s/v3/386159c7e97808995893f54e54049280354afa8e_props-product-photography.webp',
  ];

  const [images, setImages] = useState<ImageItem[]>([]);
  const [duplicatedImages, setDuplicatedImages] = useState<ImageItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const initialImages = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      url: sampleImages[Math.floor(Math.random() * sampleImages.length)]
    }));
    
    setImages(initialImages);
    
    setDuplicatedImages([...initialImages]);
    
    const interval = setInterval(() => {
      setImages(prevImages => {
        const newImages = [...prevImages];
        const randomIndex = Math.floor(Math.random() * newImages.length);
        const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
        
        newImages[randomIndex] = {
          ...newImages[randomIndex],
          url: randomImage,
          id: Date.now() + randomIndex
        };
        
        setDuplicatedImages([...newImages]);
        
        return newImages;
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
      <div className="grid-container h-full w-full overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-5 left-5 w-20 h-20 rounded-full bg-gradient-to-br from-[#caffe5] to-[#3e9478]/20 blur-xl z-0"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-gradient-to-tl from-[#caffe5] to-[#3e9478]/10 blur-xl z-0"></div>
        
        {/* Grid header */}
        {/* <div className="relative z-10 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiImage className="text-[#3e9478]" />
            <span className="font-medium text-[#3e9478]">Media Gallery</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
            <FiUpload className="text-[#3e9478] text-sm" />
            <span className="text-xs text-[#3e9478]">Upload Media</span>
          </div>
        </div> */}
        
        {/* Main scrolling grid */}
        <div 
          ref={containerRef}
          className="grid-scroll-container h-full overflow-hidden"
        >
          <div className="animate-scroll grid grid-cols-3 gap-3">
            {/* Original images */}
            {images.map((image) => (
              <div 
                key={`${image.id}-${image.url}`} 
                className="image-item relative overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-xl"
                style={{ aspectRatio: '1/1' }}
              >
                <img 
                  src={image.url} 
                  alt="Grid item" 
                  className="w-full h-full object-cover transition-opacity duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3e9478]/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span className="text-white text-xs font-medium truncate">image_{image.id}.png</span>
                </div>
              </div>
            ))}
            
            {/* Duplicated images for seamless scrolling */}
            {duplicatedImages.map((image) => (
              <div 
                key={`dup-${image.id}-${image.url}`} 
                className="image-item relative overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-xl"
                style={{ aspectRatio: '1/1' }}
              >
                <img 
                  src={image.url} 
                  alt="Grid item" 
                  className="w-full h-full object-cover transition-opacity duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3e9478]/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span className="text-white text-xs font-medium truncate">image_{image.id}.png</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default ImageGrid; 