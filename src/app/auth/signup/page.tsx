// src/app/auth/signup/page.tsx
import SignUpForm from '@/components/ui/SignUpForm';

export default function SignUpPage() {
  return (
    <>
      {/* Page Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Create Account</h3>
        <p className="text-gray-600">Join our platform today</p>
      </div>
      
      {/* Sign Up Form */}
      <div className="bg-white py-8 px-6 shadow rounded-lg">
        <SignUpForm />
      </div>
    </>
  );
}

// Alternative: Jika masih error, coba versi simple ini dulu
export function SimpleSignUpPage() {
  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Create Account</h3>
      <p className="text-gray-600 mb-6">Join our platform today</p>
      
      <div className="bg-white p-8 rounded-lg shadow">
        <p className="text-gray-700">Sign up form akan muncul di sini</p>
        {/* Jika ini muncul, berarti masalah di SignUpForm component */}
      </div>
    </div>
  );
}