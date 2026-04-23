"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	// Avoid hydration mismatch
	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className="w-10 h-10 rounded-2xl bg-subtle/20 animate-pulse" />
		);
	}

	return (
		<button
			type="button"
			aria-label="Toggle theme"
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			className="p-2.5 rounded-2xl text-foreground/40 hover:text-foreground hover:bg-terra-500/5 transition-all active:scale-95 group relative"
		>
			{theme === "dark" ? (
				<Sun className="w-5 h-5 transition-all duration-500 group-hover:rotate-45 text-terra-500" />
			) : (
				<Moon className="w-5 h-5 transition-all duration-500 group-hover:-rotate-12 text-terra-500" />
			)}
			<span className="sr-only">Toggle theme</span>
		</button>
	);
}
