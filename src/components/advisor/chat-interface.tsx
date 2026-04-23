"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect, FormEvent } from "react";
import type { UIMessage } from "ai";
import { Send, User, Bot, AlertCircle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clearConversation } from "@/actions/advisor";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface ChatInterfaceProps {
	initialMessages: UIMessage[];
	conversationId: string;
}

export function ChatInterface({ initialMessages, conversationId }: ChatInterfaceProps) {
	const router = useRouter();
	const t = useTranslations("advisor");
	const [error, setError] = useState<string | null>(null);
	const [isClearing, setIsClearing] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const chat = useChat({
		transport: new DefaultChatTransport({
			api: "/api/chat",
			body: { conversationId },
		}),
		messages: initialMessages,
		onError: (err: Error) => {
			if (err.message.includes("429")) {
				setError(t("rateLimitError"));
			} else {
				setError(t("generalError"));
			}
		}
	});

	const { messages, sendMessage, status } = chat;
	const isLoading = status === "streaming" || status === "submitted";

	// Auto-scroll to bottom
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const text = inputValue.trim();
		if (!text || isLoading) return;
		setError(null);
		setInputValue("");
		sendMessage({ role: "user", parts: [{ type: "text", text }] });
	};

	const handleClear = async () => {
		if (confirm(t("clearConfirm"))) {
			setIsClearing(true);
			await clearConversation(conversationId);
			setIsClearing(false);
			router.refresh();
		}
	};

	return (
		<div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto border rounded-xl overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b bg-white dark:bg-slate-900">
				<div>
					<h2 className="font-semibold text-lg">{t("title")}</h2>
					<p className="text-sm text-slate-500">{t("subtitle")}</p>
				</div>
				<button 
					onClick={handleClear}
					disabled={isClearing}
					className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
					title={t("clearTooltip")}
				>
					<Trash2 size={18} />
				</button>
			</div>

			{/* Error Banner */}
			<AnimatePresence>
				{error && (
					<motion.div 
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 text-sm flex items-center justify-between"
					>
						<div className="flex items-center gap-2">
							<AlertCircle size={16} />
							<span>{error}</span>
						</div>
						<button onClick={() => setError(null)} className="hover:underline">{t("dismiss")}</button>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Messages Area */}
			<div className="flex-1 overflow-y-auto p-4 space-y-6">
				{messages.length === 0 ? (
					<div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
						<div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
							<Bot size={32} className="text-indigo-600 dark:text-indigo-400" />
						</div>
						<div className="text-center max-w-md px-4">
							<h3 className="font-medium text-slate-900 dark:text-white mb-2">{t("emptyStateTitle")}</h3>
							<p className="text-sm">{t("emptyStateSubtitle")}</p>
						</div>
					</div>
				) : (
					messages.map((message) => (
						<motion.div 
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							key={message.id} 
							className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
						>
							{message.role !== "user" ? (
								<div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 mt-1">
									<Bot size={16} className="text-indigo-600 dark:text-indigo-400" />
								</div>
							) : (
								<div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
									<User size={16} className="text-slate-600 dark:text-slate-300" />
								</div>
							)}
							
							<div className={`max-w-[80%] rounded-2xl p-4 ${
								message.role === "user" 
									? "bg-indigo-600 text-white rounded-tr-sm rtl:rounded-tr-2xl rtl:rounded-tl-sm" 
									: "bg-white dark:bg-slate-800 border shadow-sm rounded-tl-sm rtl:rounded-tl-2xl rtl:rounded-tr-sm text-slate-800 dark:text-slate-200"
							}`}>
								<div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
									{message.parts
										?.filter((p: any) => p.type === "text")
										.map((p: any) => p.text)
										.join("") ?? ""
									}
								</div>
							</div>
						</motion.div>
					))
				)}
				{isLoading && (
					<div className="flex gap-4 justify-start">
						<div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 mt-1">
							<Bot size={16} className="text-indigo-600 dark:text-indigo-400" />
						</div>
						<div className="bg-white dark:bg-slate-800 border shadow-sm rounded-2xl rounded-tl-sm rtl:rounded-tl-2xl rtl:rounded-tr-sm p-4 flex items-center gap-1">
							<div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
							<div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
							<div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
						</div>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			{/* Input Area */}
			<div className="p-4 bg-white dark:bg-slate-900 border-t">
				<form onSubmit={handleSubmit} className="flex gap-2">
					<input
						type="text"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						placeholder={t("placeholder")}
						className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						disabled={isLoading}
					/>
					<button 
						type="submit" 
						disabled={isLoading || !inputValue.trim()}
						className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors rtl:rotate-180"
					>
						<Send size={18} />
					</button>
				</form>
				<p className="text-xs text-center text-slate-500 mt-2">
					{t("disclaimer")}
				</p>
			</div>
		</div>
	);
}
