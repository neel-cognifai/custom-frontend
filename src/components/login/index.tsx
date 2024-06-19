"use client";

import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { SiGmail } from 'react-icons/si';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-10 text-center">Login</h2>
        <form>
          <div className="mb-4">
            <label className="block mb-2 text-sm">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded" required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded" required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm">Mobile Number</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded" required
            />
          </div>

          <button type="submit" className=" w-1/2 mx-auto p-4 bg-blue-500 text-white text-lg rounded cursor-pointer hover:bg-blue-600 block">Login</button>

          <hr className='mb-6 mt-6' style={{ borderTop: '1px solid #ccc' }} />

          <div className="mb-6">
            <button
              className="flex items-center justify-between w-full p-4 mb-2 border border-black-500 rounded cursor-pointer hover:bg-blue-50"
            >
              <FcGoogle className="ml-2 text-3xl" size={24} />
              <span className="text-black-500 text-lg mr-2 flex-grow text-center">Google</span>
            </button>
            <button
              className="flex items-center justify-between w-full p-4 border border-black-500 rounded cursor-pointer hover:bg-blue-50"
            >
              <SiGmail className="ml-2 text-blue-500" size={22} />
              <span className="text-black-500 text-lg mr-2 flex-grow text-center">Gmail</span>
            </button>
          </div>


          <p className="mb-2 text-center text-sm font-bold">
            Don't have an account? <a href="/signup" className="text-blue-500 no-underline">Sign Up</a>
          </p>
        </form>
      </div>
    </div>

  );
};

export default Login;


// "use client"; // Ensure this component is marked as a client-side component

// import React from 'react';
// import { FcGoogle } from 'react-icons/fc';
// import { SiGmail } from 'react-icons/si';
// import { useRouter } from 'next/router';

// const Login = () => {
//   const router = useRouter();

//   const handleGoogleLogin = () => {
//     // Replace with your actual OAuth logic or redirection
//     router.push('/auth/google'); // Example route for OAuth login
//   };

//   const handleGmailLogin = () => {
//     // Implement Gmail login logic if needed
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
//         <h2 className="text-2xl mb-10 text-center">Login</h2>

//         <div className="flex justify-between mb-6 space-x-4">
//           <button
//             onClick={handleGoogleLogin}
//             className="flex items-center justify-between w-1/2 p-4 mr-2 border border-black-500 rounded cursor-pointer hover:bg-blue-50"
//           >
//             <FcGoogle className="mr-2 text-3xl" size={24} />
//             <span className="text-black-500 text-lg  mr-2 flex-grow text-center">Google</span>
//           </button>
//           <button
//             onClick={handleGmailLogin}
//             className="flex items-center justify-between w-1/2 p-2 ml-2 border border-black-500 rounded cursor-pointer hover:bg-blue-50"
//           >
//             <SiGmail className="ml-2 text-blue-500" size={22} />
//             <span className="text-black-500 text-lg mr-2 flex-grow text-center">Gmail</span>
//           </button>
//         </div>

//         <hr className="mb-6 mt-6" style={{ borderTop: '1px solid #ccc' }} />

//         <form>
//           {/* Include your existing form fields for email, password, mobile number */}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
