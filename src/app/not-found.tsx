import Link from "next/link";
import { SearchX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="min-h-screen bg-sand-50 dark:bg-black text-sand-900 dark:text-sand-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
			{/* Ambient Background */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
				<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-terra-500/10 dark:bg-terra-500/5 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sage-500/10 dark:bg-sage-500/5 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
			</div>

			<div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
				<div className="w-24 h-24 mb-8 bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center shadow-sm border border-white/20 dark:border-white/10 relative">
					<SearchX className="w-10 h-10 text-terra-500" strokeWidth={1.5} />
				</div>
				
				<h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
					Lost your way?
				</h1>
				
				<p className="text-lg text-sand-600 dark:text-sand-400 mb-10 leading-relaxed font-light">
					The page you're looking for seems to have drifted away. Let's guide you back to familiar paths.
				</p>

				<Link 
					href="/" 
					className="w-full flex items-center justify-center h-12 bg-terra-500 hover:bg-terra-600 text-white rounded-xl shadow-md transition-all text-base font-medium group"
				>
					<ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
					Return to Home
				</Link>
			</div>
		</div>
	);
}
