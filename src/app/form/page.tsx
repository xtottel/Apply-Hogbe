// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { Camera } from "lucide-react";
// import { Input } from "@/ui/input";
// import { Textarea } from "@/ui/textarea";
// import Button from "@/ui/Button";
// import { Label } from "@/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/ui/select";

// export default function RegisterPage() {
//   const [form, setForm] = useState({
//     fullName: "",
//     dob: "",
//     age: "",
//     maritalStatus: "",
//     pob: "",
//     hometown: "",
//     homeDistrict: "",
//     grewUpAt: "",
//     currentResidence: "",
//     traditionalArea: "",
//     languages: "",
//     phone: "",
//     whatsapp: "",
//     email: "",
//     digitalAddress: "",
//     motherName: "",
//     motherPhone: "",
//     fatherName: "",
//     fatherPhone: "",
//     educationLevel: "",
//     schoolName: "",
//     cocurricular: "",
//     occupation: "",
//     hobbies: "",
//     hasPageantExperience: "",
//     auditionLocation: "",
//     pageantDetails: "",
//     whyContest: "",
//     whyBeMamaHogbe: "",
//     healthCondition: "",
//     photo: null as File | null,
//   });

//   const [submitted, setSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [preview, setPreview] = useState<string | null>(null);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (name: string, value: string) => {
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     setForm((prev) => ({ ...prev, photo: file }));
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setPreview(reader.result as string);
//       reader.readAsDataURL(file);
//     } else {
//       setPreview(null);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Convert image to base64 for Supabase storage
//       let photoUrl = "";
//       if (form.photo) {
//         const base64Photo = await convertFileToBase64(form.photo);
//         photoUrl = await uploadPhotoToSupabase(base64Photo, form.phone);
//       }

//       const submissionData = {
//         ...form,
//         photoUrl: photoUrl || null,
//         clientReference: form.phone,
//       };

//       const response = await fetch("/api/submit", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(submissionData),
//       });

//       if (!response.ok) {
//         throw new Error("Submission failed");
//       }

//       // Send SMS confirmation
//       await fetch("/api/sms/success", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           phone: form.phone,
//           fullName: form.fullName,
//         }),
//       });

//       setSubmitted(true);
//     } catch (error) {
//       console.error("Submission failed:", error);
//     } finally {
//       setLoading(false);
//     }
//   };


"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import Button from "@/ui/Button";
import { Label } from "@/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterPage() {
  const router = useRouter();
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    age: "",
    maritalStatus: "",
    pob: "",
    hometown: "",
    homeDistrict: "",
    grewUpAt: "",
    currentResidence: "",
    traditionalArea: "",
    languages: "",
    phone: "",
    whatsapp: "",
    email: "",
    digitalAddress: "",
    motherName: "",
    motherPhone: "",
    fatherName: "",
    fatherPhone: "",
    educationLevel: "",
    schoolName: "",
    cocurricular: "",
    occupation: "",
    hobbies: "",
    hasPageantExperience: "",
    auditionLocation: "",
    pageantDetails: "",
    whyContest: "",
    whyBeMamaHogbe: "",
    healthCondition: "",
    photo: null as File | null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in by checking cookies or local storage
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include',
        });
        
        const data = await response.json();
        
        if (response.ok && data.authenticated) {
          setUserPhone(data.phone);
          setForm(prev => ({ ...prev, phone: data.phone }));
        } else {
          toast.error("Please login first");
          router.push('/login');
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        toast.error("Authentication check failed");
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, photo: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert image to base64 for Supabase storage
      let photoUrl = "";
      if (form.photo) {
        const base64Photo = await convertFileToBase64(form.photo);
        photoUrl = await uploadPhotoToSupabase(base64Photo, form.phone);
      }

      const submissionData = {
        ...form,
        photoUrl: photoUrl || null,
        clientReference: form.phone,
      };

      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      // Send SMS confirmation
      await fetch("/api/sms/success", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: form.phone,
          fullName: form.fullName,
        }),
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadPhotoToSupabase = async (
    base64Image: string,
    phone: string
  ): Promise<string> => {
    try {
      const response = await fetch("/api/upload-photo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Image,
          filename: `profile_${phone}_${Date.now()}.jpg`,
        }),
      });

      if (!response.ok) {
        throw new Error("Photo upload failed");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Upload error:", error);
      return "";
    }
  };

  if (submitted) {
    // return (
    //   <main className="min-h-screen flex items-center justify-center px-4">
    //     <div className="text-center space-y-4">
    //       <h1 className="text-2xl font-semibold">🎉 Registration Complete</h1>
    //       <p className="text-gray-600">
    //         Thank you for registering for Mama Hogbe 2025.
    //       </p>
    //     </div>
    //   </main>
    // );
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold">🎉 Registration Complete</h1>
          <p className="text-gray-600">
            Thank you for registering for Mama Hogbe 2025.
          </p>
          {userPhone && (
            <p className="text-sm text-gray-500">
              Registered with phone: {userPhone}
            </p>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-white text-black">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-4">
        {/* <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Mama Hogbe 2025 Portal</h1>
          <h2 className="text-lg text-gray-700">Official Audition Form</h2>
        </div> */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Mama Hogbe 2025 Portal</h1>
          <h2 className="text-lg text-gray-700">Official Audition Form</h2>
          {userPhone && (
            <p className="text-sm text-green-600">
              Welcome! You&apos;re logged in with: {userPhone}
            </p>
          )}
        </div>

        <Image
          src="/101.jpg"
          alt="Mama Hogbe Banner"
          width={600}
          height={100}
          className="w-full h-32 object-cover rounded"
        />

        <p className="text-sm text-gray-600">
          Please fill out the form below to register for the Mama Hogbe 2025
          auditions. Ensure all information is accurate and complete.
          <br />
          <span className="text-red-500 font-semibold">
            Note: This is not the official consent form.
          </span>
          <br />
          You will need to download and fill the official consent form
          separately.
        </p>

        {/* Section A: Personal Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="dob">Date of Birth *</Label>
            <Input
              id="dob"
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="maritalStatus">Marital Status *</Label>
            <Input
              id="maritalStatus"
              name="maritalStatus"
              value={form.maritalStatus}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="pob">Place of Birth *</Label>
            <Input
              id="pob"
              name="pob"
              value={form.pob}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="hometown">Hometown *</Label>
            <Input
              id="hometown"
              name="hometown"
              value={form.hometown}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="homeDistrict">Home District *</Label>
            <Input
              id="homeDistrict"
              name="homeDistrict"
              value={form.homeDistrict}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="grewUpAt">Where did you grow up? *</Label>
            <Input
              id="grewUpAt"
              name="grewUpAt"
              value={form.grewUpAt}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="currentResidence">Current Residence / Work *</Label>
            <Input
              id="currentResidence"
              name="currentResidence"
              value={form.currentResidence}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="traditionalArea">
              Traditional Area / 36 Town State *
            </Label>
            <Input
              id="traditionalArea"
              name="traditionalArea"
              value={form.traditionalArea}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="languages">Languages Spoken *</Label>
            <Input
              id="languages"
              name="languages"
              value={form.languages}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Contact Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* <div className="space-y-1">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div> */}


           {/* Phone number field - make it read-only if user is logged in */}
        <div className="space-y-1">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            readOnly={!!userPhone}
            className={userPhone ? "bg-gray-100" : ""}
          />
        </div>

          <div className="space-y-1">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input
              id="whatsapp"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="digitalAddress">Digital Address</Label>
            <Input
              id="digitalAddress"
              name="digitalAddress"
              value={form.digitalAddress}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="motherName">Mother&apos;s Name *</Label>
            <Input
              id="motherName"
              name="motherName"
              value={form.motherName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="motherPhone">Mother&apos;s Phone *</Label>
            <Input
              id="motherPhone"
              name="motherPhone"
              value={form.motherPhone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="fatherName">
              Father&apos;s / Guardian&apos;s Name *
            </Label>
            <Input
              id="fatherName"
              name="fatherName"
              value={form.fatherName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="fatherPhone">Father&apos;s Phone *</Label>
            <Input
              id="fatherPhone"
              name="fatherPhone"
              value={form.fatherPhone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Education & Occupation */}
        <div className="space-y-1">
          <Label>Highest Level of Education *</Label>
          <Select
            value={form.educationLevel}
            onValueChange={(value) =>
              handleSelectChange("educationLevel", value)
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select one" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="JHS">JHS</SelectItem>
              <SelectItem value="SHS">SHS</SelectItem>
              <SelectItem value="Tertiary">Tertiary</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="schoolName">Name of School / Institution</Label>
          <Input
            id="schoolName"
            name="schoolName"
            value={form.schoolName}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="cocurricular">
            Co-Curricular Activity / Position Held
          </Label>
          <Input
            id="cocurricular"
            name="cocurricular"
            value={form.cocurricular}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="occupation">Occupation</Label>
          <Input
            id="occupation"
            name="occupation"
            value={form.occupation}
            onChange={handleChange}
          />
        </div>

        {/* Interests & Goals */}
        <div className="space-y-1">
          <Label htmlFor="hobbies">Hobbies / Talents</Label>
          <Input
            id="hobbies"
            name="hobbies"
            value={form.hobbies}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1">
          <Label>Have you participated in a pageant before? *</Label>
          <Select
            value={form.hasPageantExperience}
            onValueChange={(value) =>
              handleSelectChange("hasPageantExperience", value)
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Where do you want to attend the audition? *</Label>
          <Select
            value={form.auditionLocation}
            onValueChange={(value) =>
              handleSelectChange("auditionLocation", value)
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dzodze">Dzodze</SelectItem>
              <SelectItem value="Abor">Abor</SelectItem>
              <SelectItem value="Denu">Denu</SelectItem>
              <SelectItem value="Agbozume">Agbozume</SelectItem>
              <SelectItem value="Anloga">Anloga</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {form.hasPageantExperience === "Yes" && (
          <div className="space-y-1">
            <Label htmlFor="pageantDetails">
              If yes, state which one and the year
            </Label>
            <Input
              id="pageantDetails"
              name="pageantDetails"
              value={form.pageantDetails}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="space-y-1">
          <Label htmlFor="whyContest">
            Why do you want to contest and win Mama Hogbe Crown? *
          </Label>
          <Textarea
            id="whyContest"
            name="whyContest"
            value={form.whyContest}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="whyBeMamaHogbe">
            Why do you want to be Mama Hogbe? *
          </Label>
          <Textarea
            id="whyBeMamaHogbe"
            name="whyBeMamaHogbe"
            value={form.whyBeMamaHogbe}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="healthCondition">
            Do you have any health conditions?
          </Label>
          <Input
            id="healthCondition"
            name="healthCondition"
            value={form.healthCondition}
            onChange={handleChange}
          />
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label>Upload Profile Photo *</Label>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
              {preview ? (
                <Image
                  fill
                  src={preview}
                  alt="Preview"
                  className="object-cover w-full h-full rounded-full"
                />
              ) : (
                <Camera className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
                required
              />
            </div>
          </div>
        </div>

        <hr className="my-8" />

        <section className="text-center space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Consent Form</h3>
          <p className="text-sm text-gray-600">
            Please download, print, and fill the official consent form. Bring it
            along on the audition day.
          </p>
          <Button asChild variant="primary">
            <a
              href="/2025 Audition Consent Form.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Consent Form
            </a>
          </Button>
        </section>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Submitting..." : "Submit Registration"}
        </Button>
      </form>
    </main>
  );
}
