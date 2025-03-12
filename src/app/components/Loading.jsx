import { motion } from "framer-motion";

const Loading = () => {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="relative flex flex-col items-center">
                <motion.div
                    className="w-16 h-16 border-4 border-gray-200 border-t-4 border-t-blue-500 rounded-full"
                    animate={{
                        rotate: 360
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <p className="mt-4 text-xs text-gray-400">Loading...</p>
            </div>
        </div>
    );
};

export default Loading;
