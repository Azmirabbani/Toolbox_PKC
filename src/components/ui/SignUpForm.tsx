// src/components/ui/SignUpForm.tsx - Versi simple untuk debug
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: ""
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulasi loading
    setTimeout(() => {
      console.log("Sign up attempt:", formData)
      router.push("/auth/signin?message=Account created successfully")
      setLoading(false)
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-green-500 focus:border-green-500"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-green-500 focus:border-green-500"
          placeholder="your.email@pupukkujang.com"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
          Department
        </label>
        <select
          id="department"
          name="department"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-green-500 focus:border-green-500"
          value={formData.department}
          onChange={handleChange}
        >
          <option value="">Select department</option>
          <option value="production">Production</option>
          <option value="quality">Quality Control</option>
          <option value="safety">Safety & Environment</option>
          <option value="maintenance">Maintenance</option>
          <option value="logistics">Logistics</option>
          <option value="hr">Human Resources</option>
          <option value="finance">Finance</option>
          <option value="it">Information Technology</option>
        </select>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-green-500 focus:border-green-500"
          placeholder="Create password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-green-500 focus:border-green-500"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>

      <div className="text-center mt-4">
        <a href="/auth/signin" className="text-green-600 hover:text-green-500">
          Already have account? Sign in
        </a>
      </div>
    </form>
  )
}