"use client";

import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { SiGmail } from 'react-icons/si';

const Signup = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl mb-10 text-center">Sign Up</h2>

                <form>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm">Username</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded" required
                        />
                    </div>

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

                    <button type="submit" className=" w-1/2 mx-auto p-4 bg-blue-500 text-white text-lg rounded cursor-pointer hover:bg-blue-600 block">Sign Up</button>

                    <hr className='mb-6 mt-6' style={{ borderTop: '1px solid #ccc' }} />

                    <div className="mb-6">
                        <button
                            className="flex items-center justify-between w-full p-4 mb-2 border border-black-500 rounded cursor-pointer hover:bg-blue-50">
                            <FcGoogle className="ml-2 text-3xl" size={24} />
                            <span className="text-black-500 text-lg mr-2 flex-grow text-center">Google</span>
                        </button>
                        <button
                            className="flex items-center justify-between w-full p-4 border border-black-500 rounded cursor-pointer hover:bg-blue-50">
                            <SiGmail className="ml-2 text-blue-500" size={22} />
                            <span className="text-black-500 text-lg mr-2 flex-grow text-center">Gmail</span>
                        </button>
                    </div>

                    <p className="mb-2 text-center text-md font-bold">
                        Already have an account? <a href="/login" className="text-blue-500 no-underline">Login</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;

// "use client";

// import React, { useState } from 'react'; // Ensure to include the comment directive on top
// import { useRouter } from 'next/router';
// import { FcGoogle } from 'react-icons/fc';
// import { SiGmail } from 'react-icons/si';

// const Signup = () => {
//     const router = useRouter();

//     // State to manage form inputs and errors
//     const [formData, setFormData] = useState({
//         username: '',
//         email: '',
//         password: '',
//         mobile: '',
//     });

//     const [errors, setErrors] = useState({
//         username: '',
//         email: '',
//         password: '',
//         mobile: '',
//     });

//     // Function to handle form submission
//     const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();

//         // Validate form inputs
//         let newErrors = {
//             username: formData.username ? '' : 'Username is required',
//             email: formData.email ? '' : 'Email is required',
//             password: formData.password ? '' : 'Password is required',
//             mobile: formData.mobile ? '' : 'Mobile Number is required',
//         };

//         // Update errors state
//         setErrors(newErrors);

//         // If there are errors, return without submitting
//         if (Object.values(newErrors).some(error => error !== '')) {
//             return;
//         }

//         // If no errors, proceed with form submission (authentication logic)

//         // Redirect to /drug-monitor page after signup
//         router.push('/drug-monitor');
//     };

//     // Function to handle input changes
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });

//         // Clear error message when user starts typing again
//         setErrors({
//             ...errors,
//             [name]: '',
//         });
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100">
//             <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
//                 <h2 className="text-2xl mb-10 text-center">Sign Up</h2>

//                 <div className="flex justify-between mb-6 space-x-4">
//                     <button className="flex items-center justify-between w-1/2 p-4 mr-2 border border-black-500 rounded cursor-pointer hover:bg-blue-50">
//                         <FcGoogle className="mr-2 text-3xl" size={24} />
//                         <span className="text-black-500 text-lg mr-2 flex-grow text-center">Google</span>
//                     </button>
//                     <button className="flex items-center justify-between w-1/2 p-2 ml-2 border border-black-500 rounded cursor-pointer hover:bg-blue-50">
//                         <SiGmail className="ml-2 text-blue-500" size={22} />
//                         <span className="text-black-500 text-lg mr-2 flex-grow text-center">Gmail</span>
//                     </button>
//                 </div>

//                 <hr className="mb-6 mt-6" style={{ borderTop: '1px solid #ccc' }} />

//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-4">
//                         <label className="block mb-2 text-sm">Username</label>
//                         <input
//                             type="text"
//                             name="username"
//                             value={formData.username}
//                             onChange={handleChange}
//                             className={`w-full p-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded`}
//                         />
//                         {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
//                     </div>

//                     <div className="mb-4">
//                         <label className="block mb-2 text-sm">Email</label>
//                         <input
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
//                         />
//                         {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//                     </div>

//                     <div className="mb-4">
//                         <label className="block mb-2 text-sm">Password</label>
//                         <input
//                             type="password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             className={`w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded`}
//                         />
//                         {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
//                     </div>

//                     <div className="mb-6">
//                         <label className="block mb-2 text-sm">Mobile Number</label>
//                         <input
//                             type="text"
//                             name="mobile"
//                             value={formData.mobile}
//                             onChange={handleChange}
//                             className={`w-full p-2 border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} rounded`}
//                         />
//                         {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
//                     </div>

//                     <button type="submit" className="w-1/2 mx-auto p-4 bg-blue-500 text-white text-lg rounded cursor-pointer hover:bg-blue-600 block">Sign Up</button>

//                     <p className="mt-4 text-center text-md font-bold">
//                         Already have an account? <a href="/login" className="text-blue-500 no-underline">Login</a>
//                     </p>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Signup;
