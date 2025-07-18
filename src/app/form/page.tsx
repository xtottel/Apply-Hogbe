'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '',
    dob: '',
    age: '',
    maritalStatus: '',
    pob: '',
    hometown: '',
    homeDistrict: '',
    grewUpAt: '',
    currentResidence: '',
    traditionalArea: '',
    languages: '',
    phone: '',
    whatsapp: '',
    email: '',
    digitalAddress: '',
    motherName: '',
    motherPhone: '',
    fatherName: '',
    fatherPhone: '',
    educationLevel: '',
    schoolName: '',
    cocurricular: '',
    occupation: '',
    hobbies: '',
    hasPageantExperience: '',
    pageantDetails: '',
    whyContest: '',
    whyBeMamaHogbe: '',
    healthCondition: '',
    pin: '',
    photo: null as File | null,
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setForm((prev) => ({ ...prev, photo: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Send to backend
      console.log('Submitted:', form)
      setSubmitted(true)
    } catch (error) {
      console.error('Submission failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold">🎉 Registration Complete</h1>
          <p className="text-gray-600">Thank you for registering for Mama Hogbe 2025.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-white text-black">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-4">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Mama Hogbe 2025 Portal</h1>
          <h2 className="text-lg text-gray-700">Official Audition Form</h2>
        </div>

        <Image
          src="/Banner.jpg"
          alt="Mama Hogbe Banner"
          width={600}
          height={100}
          className="w-full h-32 object-cover rounded"
        />

        {/* PIN */}
        <Input label="PIN" name="pin" value={form.pin} onChange={handleChange} required />

        {/* Section A: Personal Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} required />
          <Input label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} required />
          <Input label="Age" name="age" type="number" value={form.age} onChange={handleChange} required />
          <Input label="Marital Status" name="maritalStatus" value={form.maritalStatus} onChange={handleChange} required />
          <Input label="Place of Birth" name="pob" value={form.pob} onChange={handleChange} required />
          <Input label="Hometown" name="hometown" value={form.hometown} onChange={handleChange} required />
          <Input label="Home District" name="homeDistrict" value={form.homeDistrict} onChange={handleChange} required />
          <Input label="Where did you grow up?" name="grewUpAt" value={form.grewUpAt} onChange={handleChange} required />
          <Input label="Current Residence / Work" name="currentResidence" value={form.currentResidence} onChange={handleChange} required />
          <Input label="Traditional Area / 36 Town State" name="traditionalArea" value={form.traditionalArea} onChange={handleChange} required />
          <Input label="Languages Spoken" name="languages" value={form.languages} onChange={handleChange} required />
        </div>

        {/* Contact Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} required />
          <Input label="WhatsApp Number" name="whatsapp" value={form.whatsapp} onChange={handleChange} />
          <Input label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} />
          <Input label="Digital Address" name="digitalAddress" value={form.digitalAddress} onChange={handleChange} />
          <Input label="Mother's Name" name="motherName" value={form.motherName} onChange={handleChange} required />
          <Input label="Mother's Phone" name="motherPhone" value={form.motherPhone} onChange={handleChange} required />
          <Input label="Father's / Guardian's Name" name="fatherName" value={form.fatherName} onChange={handleChange} required />
          <Input label="Father's Phone" name="fatherPhone" value={form.fatherPhone} onChange={handleChange} required />
        </div>

        {/* Education & Occupation */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Highest Level of Education</label>
          <select
            name="educationLevel"
            value={form.educationLevel}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            required
          >
            <option value="">Select one</option>
            <option value="JHS">JHS</option>
            <option value="SHS">SHS</option>
            <option value="Tertiary">Tertiary</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <Input label="Name of School / Institution" name="schoolName" value={form.schoolName} onChange={handleChange} />
        <Input label="Co-Curricular Activity / Position Held" name="cocurricular" value={form.cocurricular} onChange={handleChange} />
        <Input label="Occupation" name="occupation" value={form.occupation} onChange={handleChange} />

        {/* Interests & Goals */}
        <Input label="Hobbies / Talents" name="hobbies" value={form.hobbies} onChange={handleChange} />

        <div className="space-y-2">
          <label className="block text-sm font-medium">Have you participated in a pageant before?</label>
          <select
            name="hasPageantExperience"
            value={form.hasPageantExperience}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            required
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <Input label="If yes, state which one and the year" name="pageantDetails" value={form.pageantDetails} onChange={handleChange} />
        <TextArea label="Why do you want to contest and win Mama Hogbe Crown?" name="whyContest" value={form.whyContest} onChange={handleChange} />
        <TextArea label="Why do you want to be Mama Hogbe?" name="whyBeMamaHogbe" value={form.whyBeMamaHogbe} onChange={handleChange} />
        <Input label="Do you have any health conditions?" name="healthCondition" value={form.healthCondition} onChange={handleChange} />

        {/* Upload */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">Upload Profile Photo</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm" required />
        </div>

                <hr className="my-8" />

<section className="text-center space-y-3">
  <h3 className="text-lg font-semibold text-gray-800">Consent Form</h3>
  <p className="text-sm text-gray-600">
    Please download, print, and fill the official consent form. Bring it along on the audition day.
  </p>

  <a
    href="/2025 Audition Consent Form.pdf"
    download
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
  >
    Download Consent Form
  </a>
</section>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:opacity-90 transition"
        >
          {loading ? 'Submitting...' : 'Submit Registration'}
        </button>




      </form>
    </main>
  )
}

// 🔧 Helper Components
interface InputProps {
  label: string
  name: string
  value: string | number
  onChange: React.ChangeEventHandler<HTMLInputElement>
  type?: string
  required?: boolean
}

function Input({ label, name, value, onChange, type = 'text', required = false }: InputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        required={required}
      />
    </div>
  )
}

interface TextAreaProps {
  label: string
  name: string
  value: string
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>
}

function TextArea({ label, name, value, onChange }: TextAreaProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>
      <textarea
        name={name}
        rows={3}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        required
      />
    </div>
  )
}
