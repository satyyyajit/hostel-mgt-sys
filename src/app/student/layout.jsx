'use client';
import Navbar from "../components/Navbar";

import SideBar from "./components/Sidebar";

export default function StudentLayout({ children }) {
    return (
        <div className="w-full">
            <Navbar />
            <div className="flex flex-row">
                <SideBar />
                <main className="flex-1 backdrop-blur p-4 md:p-6 rounded-2xl border-2 border-gray-300 m-1 relative overflow-y-auto h-[calc(100vh-5rem)]">
                    {children}
                </main>
            </div>
            
        </div>
    );
}