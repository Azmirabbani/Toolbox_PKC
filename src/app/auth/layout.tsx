import React from 'react';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo & Brand dengan Image */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 mb-4 flex items-center justify-center">
            <Image
              src="/Logo_kujang.jpg"
              alt="Pupuk Kujang Logo"
              width={80}
              height={80}
              className="rounded-full object-cover"
              priority
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Toolbox PUPUK KUJANG</h2>
          <p className="mt-2 text-gray-600">Task Management & Meeting System</p>
        </div>
        
        {/* Children content (signin/signup pages) */}
        {children}
      </div>
    </div>
  );
}