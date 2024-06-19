"use client";

import React from "react";

const Dashboard = () => {
    return (
        <div className="bg-white min-h-screen p-4 ">
            <div className="flex items-center justify-between mb-6">
                <div className="text-lg font-bold mb-2">Usage: Cost</div>
                <div className="flex justify-start items-center bg-gray-100 rounded-lg">
                    <button className="text-lg font-bold px-4 py-2 rounded-l-lg text-gray-500">
                        Cost
                    </button>
                    <button className="text-lg font-bold px-4 py-2 rounded-r-lg text-gray-500 ">
                        Activity
                    </button>
                </div>
                <div className="flex items-center space-x-2 p-2">
                    <div className="border border-black rounded-2xl">
                        <div className="flex items-center justify-between p-1 rounded-2xl">
                            <span className="flex item-center mx-2 justify-conte cursor-pointer">{'<'}</span>
                            <span className="flex item-center justify-conte">june</span>
                            <span className="flex item-center mx-2 justify-conte cursor-pointer">{'>'}</span>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg cursor-pointer">Export</button>
                </div>
            </div>
            <div>
            </div>
              <hr className="my-4 border-black" />
            <div className="max-w-xl mx-auto bg-white shadow-lg mt-10 rounded-lg p-6">
                {/* Monthly Bill Section */}
                <div className="mb-6">
                    <div className="flex items-center justify-start space-x-2">
                        <h2 className="text-lg font-bold">Monthly Bill</h2>
                        <span className="text-gray-500">Jun 1 - 30</span>
                    </div>
                    <div className="flex items-center mt-4">
                        <div className="relative w-32 h-32">
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 36 36">
                                <path
                                    className="text-gray-300"
                                    d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="whitesmoke"
                                    strokeWidth="3.8"
                                />
                                <path
                                    className="text-green-500"
                                    d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3.8"
                                    strokeDasharray="3, 100"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg font-bold">3%</span>
                            </div>
                        </div>
                        <div className="ml-8">
                            <p className="text-3xl ml-2 font-bold">$9.76</p>
                            <p className="text-gray-500">/ $300.00 limit</p>
                            <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg cursor-pointer">Increase limit</button>
                        </div>
                    </div>
                </div>

                {/* Credit Grants Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold">Credit Grants <span className="text-gray-500">USD</span></h2>
                    <div className="mt-4">
                        <div className="bg-whitesmoke-200 rounded-lg overflow-hidden">
                            <div className="bg-green-500 h-2" style={{ width: "22%" }}></div>
                        </div>
                        <p className="text-right mt-1 font-bold">$557.29 / $2,530.00</p>
                    </div>
                    <table className="w-full mt-4 text-left">
                        <thead>
                            <tr className="text-gray-500">
                                <th className="py-2">RECEIVED</th>
                                <th className="py-2">STATE</th>
                                <th className="py-2">BALANCE</th>
                                <th className="py-2">EXPIRES</th>
                            </tr>
                            <td colSpan={4} className="py-2"><hr className="border-black" /></td>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-2">Jan 15, 2024</td>
                                <td className="py-2"><span className="bg-green-100 text-green-700 px-2 py-1 rounded">Available</span></td>
                                <td className="py-2">$1,962.99 / $2,500.00</td>
                                <td className="py-2">Aug 01, 2024</td>
                            </tr>
                            <td colSpan={4} className="py-2"><hr className="border-black" /></td>
                            <tr>
                                <td className="py-2">Dec 28, 2023</td>
                                <td className="py-2"><span className="bg-green-100 text-green-700 px-2 py-1 rounded">Available</span></td>
                                <td className="py-2">$9.72 / $20.00</td>
                                <td className="py-2">Jan 01, 2025</td>
                            </tr>
                            <td colSpan={4} className="py-2"><hr className="border-black" /></td>
                            <tr>
                                <td className="py-2">Nov 07, 2023</td>
                                <td className="py-2"><span className="bg-green-100 text-green-700 px-2 py-1 rounded">Available</span></td>
                                <td className="py-2">$0.00 / $10.00</td>
                                <td className="py-2">Dec 01, 2024</td>
                            </tr>
                        </tbody>
                    </table>
                    <hr className="my-4 border-black" />
                </div>

                {/* Invoices Section */}
                <div className="mt-20">
                    <h2 className="text-lg font-bold">Invoices</h2>
                    <table className="w-full mt-4 text-left">
                        <thead>
                            <tr className="text-gray-500">
                                <th className="py-2">MONTH</th>
                                <th className="py-2">STATE</th>
                                <th className="py-2 flex justify-end">BALANCE</th>
                            </tr>
                            <td colSpan={4} className="py-2"><hr className="border-black" /></td>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-2">Dec 2023</td>
                                <td className="py-2"><span className="bg-green-100 text-green-700 px-2 py-1 rounded">Paid</span></td>
                                <td className="py-2 flex justify-end">$23.60</td>
                            </tr>
                            <td colSpan={4} className="py-2"><hr className="border-black" /></td>
                            <tr>
                                <td className="py-2">Nov 2023</td>
                                <td className="py-2"><span className="bg-green-100 text-green-700 px-2 py-1 rounded">Paid</span></td>
                                <td className="py-2 flex justify-end">$11.80</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;
