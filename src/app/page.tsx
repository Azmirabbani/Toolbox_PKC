'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  // Array gambar untuk carousel
  const images = [
    { src: '/proxy-file.webp', alt: 'PT Pupuk Kujang Factory 1' },
    { src: '/proxy-file.jpg', alt: 'PT Pupuk Kujang Factory 2' },
    { src: '/emp pupuk kujang.jpg', alt: 'PT Pupuk Kujang Employees' },
    { src: '/pk cikmapek.jpg', alt: 'PT Pupuk Kujang Cikmapek' },
    { src: '/pupukkujang_cover.jpg', alt: 'PT Pupuk Kujang Cover' },
  ];

  // Auto slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Ganti gambar setiap 4 detik

    return () => clearInterval(interval);
  }, [images.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulasi login
    console.log('Login attempt:', { username, password });
    
    // Simulasi loading
    setTimeout(() => {
      // Set cookie atau token
      document.cookie = 'auth-token=sample-token; path=/';
      
      // Redirect ke dashboard
      router.push('/dashboard');
      setLoading(false);
    }, 1000);
  };

  return (
    // PENTING: Ini akan override semua layout wrapper
    <div className="fixed inset-0 w-screen h-screen flex overflow-hidden bg-white">
      {/* Left Side - Login Form (Desktop: 50%, Mobile: 100%) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4 sm:px-8 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg space-y-4 sm:space-y-6 lg:space-y-8">
          
          {/* Logo Section */}
          <div className="text-center">
            <div className="mx-auto mb-4 sm:mb-6">
              <div className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 relative mx-auto">
                {/* Try to use the actual logo first, fallback to placeholder */}
                <div className="w-full h-full bg-emerald-100 rounded-full flex items-center justify-center overflow-hidden">
                  <Image
                    src="/Logo_kujang.jpg"
                    alt="Pupuk Kujang Logo"
                    fill
                    className="object-contain"
                    priority
                    onError={(e) => {
                      // Fallback jika gambar tidak ada
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = '<div class="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-emerald-600 rounded-full flex items-center justify-center"><span class="text-white font-bold text-lg sm:text-xl lg:text-2xl">PK</span></div>';
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Header */}
            <div className="mb-4 sm:mb-6 lg:mb-8">
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                Toolbox
              </h1>
              <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-emerald-700 mb-2 sm:mb-4">
                Pupuk Kujang
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base xl:text-lg">
                Sign in to access your toolbox
              </p>
            </div>
          </div>
          
          {/* Login Form Container */}
          <div className="bg-white shadow-xl rounded-lg sm:rounded-xl lg:rounded-2xl border border-gray-100 overflow-hidden w-full">
            <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 lg:py-10 xl:py-12">
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 lg:py-3 text-sm sm:text-base border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                    placeholder="Enter your username"
                    required
                  />
                </div>
                
                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 lg:py-3 text-sm sm:text-base border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-2 sm:py-3 lg:py-4 px-4 sm:px-6 rounded-md sm:rounded-lg text-sm sm:text-base lg:text-lg font-bold hover:from-emerald-700 hover:to-green-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    "LOGIN"
                  )}
                </button>
              </form>
              
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Right Side - Image (Desktop Only: 50%) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-emerald-500 to-green-600 items-center justify-center p-4 xl:p-6 relative overflow-hidden">
        <div className="w-full max-w-lg xl:max-w-xl 2xl:max-w-2xl">
          
          {/* Factory Image Carousel - DIPERBESAR */}
          <div className="aspect-[5/4] relative rounded-2xl xl:rounded-3xl overflow-hidden mb-6 xl:mb-8 shadow-2xl ring-4 ring-white/20">
            <div className="relative w-full h-full">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    onError={(e) => {
                      // Fallback jika gambar tidak ada
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      if (target.parentElement?.parentElement) {
                        target.parentElement.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-white bg-emerald-400"><div class="text-center"><div class="w-20 h-20 xl:w-24 xl:h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"><span class="text-3xl xl:text-4xl">🏭</span></div><p class="text-base xl:text-lg font-medium">Factory Image</p></div></div>';
                      }
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          </div>
          
          {/* Company Info */}
          <div className="text-center text-white">
            <h3 className="text-lg xl:text-xl 2xl:text-2xl font-bold mb-2 xl:mb-3">PT Pupuk Kujang</h3>
            <p className="text-green-100 text-sm xl:text-base 2xl:text-lg mb-4 xl:mb-6">
              Leading Fertilizer Industry in Indonesia
            </p>
            
            {/* Indicator Dots */}
            <div className="flex items-center justify-center space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
          
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-8 right-8 xl:top-12 xl:right-12 w-16 h-16 xl:w-20 xl:h-20 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-8 left-8 xl:bottom-12 xl:left-12 w-12 h-12 xl:w-16 xl:h-16 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/3 right-4 xl:right-6 w-10 h-10 xl:w-12 xl:h-12 bg-white/5 rounded-full"></div>
      </div>
      
      {/* Mobile Background Decoration */}
      <div className="lg:hidden absolute inset-0 bg-emerald-600 opacity-5 -z-10"></div>
      <div className="lg:hidden absolute top-8 right-8 w-16 h-16 bg-emerald-100 rounded-full opacity-30"></div>
      <div className="lg:hidden absolute bottom-16 left-8 w-12 h-12 bg-green-100 rounded-full opacity-40"></div>
    </div>
  );
}