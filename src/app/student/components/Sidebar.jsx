'use client';
import { HomeIcon, ClipboardListIcon, MessageSquareIcon, AlertTriangleIcon, BellIcon, UtensilsIcon, DumbbellIcon, LogOutIcon, UserIcon, IndianRupee, LucideHome, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const sidebarData = [
    { title: 'Home', icon: HomeIcon, path: '/student/dashboard' },
    { title: 'Profile', icon: UserIcon, path: '/student/profile' },
    { title: 'Feedbacks', icon: MessageSquareIcon, path: '/student/feedbacks' },
    { title: 'Complaints', icon: AlertTriangleIcon, path: '/student/complaints' },
    { title: 'Notices', icon: BellIcon, path: '/student/notices' },
    { title: 'Mess Menu', icon: UtensilsIcon, path: '/student/menu' },
    { title: 'Gym Facilities', icon: DumbbellIcon, path: '/student/gym' },
    { title: 'Transactions', icon: IndianRupee, path: '/student/transactions' },
    { title: 'Leave Requests', icon: LogOutIcon, path: '/student/leave' },
    { title: 'Room Booking', icon: Home, path: '/student/booking' },
];

const SideBar = () => {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <div className="h-[calc(100vh-5rem)]  text-black flex flex-col pl-2">
            <div className="flex-1 mt-3 rounded-xl border-2 border-gray-300 shadow-md p-1 overflow-y-auto scroll-smooth">
                <ul className="space-y-1">
                    {sidebarData.map((item, index) => (
                        <li key={index}>
                            <button
                                onClick={() => router.push(item.path)}
                                className={`w-full flex items-center gap-3 text-gray-900 p-3 rounded-md transition ${pathname === item.path ? 'bg-blue-100 font-semibold text-blue-500' : 'hover:bg-blue-200'
                                    }`}
                            >
                                <item.icon size={20} className={`${pathname === item.path ? 'bg-blue-100 font-semibold text-blue-500' : 'hover:bg-blue-200'}`} />
                                <span className="text-sm font-medium md:block hidden">{item.title}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SideBar;
