"use client";

import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import axios from "axios"
import { addUser } from "../redux/slices/userSlices";
import { useAppDispatch } from "../redux/store";
import { useRouter } from "next/navigation";

const Page = () => {
  const dispatch = useAppDispatch() 
  const router = useRouter(); 
  const [formData, setFormData] = useState({
    username:"",
    email: "",
    password: "",
  });  

  const googleAuth = () => {
    console.log("Google Auth clicked");
    window.open("http://localhost:3500/auth/google/callback", "_self");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation example
    if (!formData.email || !formData.password || !formData.username) {
      toast.error("All fields are required!");
      return;
    }

    // Form submission logic here
    console.log("Form submitted:", formData);
    try {
      axios.post("http://localhost:3500/signup",{...formData}).then((res)=>{
        const payload = res.data.user
        dispatch(addUser(payload))
        router.push("/home")
      }).catch((err)=>{
        console.log(err.message);
      })
    } catch (error:any) {
       console.log(error.message);
    }
  
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Toaster />
      <form
        className="shadow-lg flex flex-col items-center gap-6 rounded-md border p-6 w-[90%] max-w-[500px] bg-white"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h1 className="text-3xl font-semibold text-center pb-5">Sign up</h1>

        <input
          className="input w-full bg-gray-50 p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />

        <input
          className="input w-full bg-gray-50 p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          aria-label="Email"
        />

        <input
          className="input w-full bg-gray-50 p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          aria-label="Password"
        />

        <button
          className="w-full py-3 rounded-md text-white bg-blue-500 hover:bg-blue-600 font-semibold"
          type="submit"
        >
          Submit
        </button>

        <div className="flex items-center w-full gap-4">
          <hr className="flex-grow border-gray-300" />
          <p className="text-gray-500 text-sm">Or continue with</p>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button
          type="button"
          onClick={googleAuth}
          className="w-full flex items-center justify-center gap-3 bg-black text-white font-semibold py-3 rounded-md hover:bg-gray-800"
        >
          <FcGoogle className="text-2xl" /> Google
        </button>

        <p className="text-sm text-gray-500">
          allready have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Page;
