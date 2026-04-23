"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface AppShellProps {
	user?: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	} | null;
	children: React.ReactNode;
}

export function AppShell({ user, children }: AppShellProps) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<div className="flex h-screen bg-sand-50 dark:bg-black overflow-hidden selection:bg-terra-500/30">
			<Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
			
			<div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
				{/* Background styling for the main content area */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-terra-500/5 dark:bg-terra-500/5 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
					<div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-sage-500/5 dark:bg-sage-500/5 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
				</div>

				<Header user={user} setSidebarOpen={setIsSidebarOpen} />
				
				<main className="flex-1 overflow-y-auto p-4 lg:p-8 relative z-10">
					{children}
				</main>
			</div>
		</div>
	);
}
