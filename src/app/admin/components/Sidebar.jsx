'use client';
import { 
    HomeIcon, UserIcon, ClipboardListIcon, MessageSquareIcon, 
    AlertTriangleIcon, BellIcon, UtensilsIcon, DumbbellIcon, 
    IndianRupee, LogOutIcon, Database, ReceiptIndianRupee, BedDoubleIcon
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const sidebarData = [
    { title: 'Dashboard', icon: HomeIcon, path: '/admin/dashboard' },
    { title: 'Profile', icon: UserIcon, path: '/admin/profile' },
    { title: 'Students', icon: Database, path: '/admin/student_database' },
    { title: 'Room Attendance', icon: BedDoubleIcon, path: '/admin/attendance' },
    { title: 'Booking Requests', icon: ClipboardListIcon, path: '/admin/booking' },
    { title: 'Leave Requests', icon: LogOutIcon, path: '/admin/leaves' },

    { title: 'Fee', icon: IndianRupee, path: '/admin/fee' },
    { title: 'Generate Fines', icon: ReceiptIndianRupee, path: '/admin/generate_fine' },
    { title: 'Feedbacks', icon: MessageSquareIcon, path: '/admin/feedbacks' },
    { title: 'Complaints', icon: AlertTriangleIcon, path: '/admin/complaints' },
    { title: 'Notices', icon: BellIcon, path: '/admin/notices' },

    { title: 'Mess Menu', icon: UtensilsIcon, path: '/admin/add_menu' },
    { title: 'Facilities', icon: DumbbellIcon, path: '/admin/facility' },

];

const SideBar = () => {
    const pathname = usePathname();

    return (
        <div className="h-[calc(100vh-5rem)] text-black flex flex-col pl-2">
            <div className="flex-1 mt-3 rounded-xl border-2 border-gray-300 shadow-md p-1 overflow-y-auto scroll-smooth">
                <ul className="space-y-0.5">
                    {sidebarData.map((item, index) => (
                        <li key={index}>
                            <Link
                                href={item.path}
                                className={`flex items-center gap-3 text-gray-900 p-3 rounded-md transition 
                                ${pathname === item.path ? 'bg-blue-100 font-semibold text-blue-500' : 'hover:bg-blue-200'}`}
                            >
                                <item.icon size={20} />
                                <span className="text-sm font-medium md:block hidden">{item.title}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            
        </div>
    );
};

export default SideBar;
