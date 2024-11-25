"use client"; // Make sure the component is client-side

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useAppSelector } from '@/app/redux/store';

const HomePage = () => {
  const user   = useAppSelector((state) => state.user);
  const router = useRouter();

  // useEffect(() => {
  //   if (user.username) {
  //     console.log(user.username, "user");
  //   } else {
  //     router.push("/login"); // Redirect if user is not authenticated
  //   }
  // }, [user.username]); // Adding dependencies to avoid infinite loop

  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
};

export default HomePage;
