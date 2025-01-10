"use client";

import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import axios from "axios"
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../redux/store";
import { addUser } from "../redux/slices/userSlices";

const Page = () => {

  const router = useRouter();
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const googleAuth = () => {
    window.open(`${process.env.NEXT_PUBLIC_USER_SERVER_URL}/auth/google/callback`, "_self");
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
    if (!formData.email || !formData.password) {
      toast.error("All fields are required!");
      return;
    }
    console.log("Form submitted:", formData);
    axios.defaults.withCredentials = true
    console.log(process.env.NEXT_PUBLIC_USER_SERVER_URL,"user server")
    console.log(process.env.NEXT_PUBLIC_CLOUD_SERVER_URL,"cloud server")

    axios.post(`http://51.20.144.82:3500/signin`,{...formData}).then((res)=>{
         console.log(res.data);
         const payload = res.data.user
         dispatch(addUser(payload))
         router.push("/home")
    }).catch((err)=>{
        toast.error("Incorrect Email or Password");
        console.log(err.message);
    })
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Toaster />
      <form
        className="shadow-lg flex flex-col items-center gap-6 rounded-md border p-6 w-[90%] max-w-[500px] bg-white"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h1 className="text-3xl font-semibold text-center pb-5">Sign in</h1>

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
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Page;
