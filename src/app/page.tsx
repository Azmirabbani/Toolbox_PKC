import LoginForm from '@/components/ui/LoginForm';

export default function SignInPage() {
  return (
    <>
      {/* Page Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Welcome back</h3>
        <p className="text-gray-600">Sign in to access your dashboard</p>
      </div>
      
      {/* Login Form */}
      <div className="bg-white py-8 px-6 shadow rounded-lg">
        <LoginForm />
      </div>
    </>
  );
}