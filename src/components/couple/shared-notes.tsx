"use client";

import { useState, useTransition } from "react";
import { Lock, Send, Trash2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addSharedNote, deleteSharedNote } from "@/actions/couple-notes";
import type { AppSharedNote as SharedNote } from "@/lib/types/app-types";

interface SharedNotesProps {
	notes: SharedNote[];
}

export function SharedNotes({ notes }: SharedNotesProps) {
	const [newNote, setNewNote] = useState("");
	const [isPending, startTransition] = useTransition();

	const handleAddNote = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newNote.trim()) return;

		startTransition(async () => {
			await addSharedNote(newNote);
			setNewNote("");
		});
	};

	const handleDeleteNote = (id: string) => {
		startTransition(async () => {
			await deleteSharedNote(id);
		});
	};

	return (
		<div className="bg-white/50 dark:bg-black/20 border border-sand-200 dark:border-sand-800 rounded-3xl p-6 md:p-8 flex flex-col h-[500px]">
			
			<div className="flex items-center justify-between mb-6">
				<div>
					<h2 className="text-xl font-medium text-sand-900 dark:text-sand-100 flex items-center">
						Shared Notes <Lock className="w-4 h-4 ml-2 text-sand-400" />
					</h2>
					<p className="text-sm text-sand-500 mt-1 flex items-center">
						<ShieldCheck className="w-3 h-3 mr-1 text-sage-500" />
						End-to-end encrypted for your eyes only
					</p>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
				{notes.length === 0 ? (
					<div className="h-full flex flex-col items-center justify-center text-sand-400 text-center">
						<Lock className="w-8 h-8 mb-3 opacity-50" />
						<p>No notes yet. Share a thought, a memory, or an encouragement.</p>
					</div>
				) : (
					notes.map((note) => (
						<div key={note.id} className="group flex flex-col p-4 bg-sand-50 dark:bg-sand-900/30 rounded-2xl border border-sand-100 dark:border-sand-800/50">
							<p className="text-sand-800 dark:text-sand-200 text-sm md:text-base leading-relaxed mb-3 whitespace-pre-wrap">
								{note.encryptedContent}
							</p>
							<div className="flex items-center justify-between text-xs text-sand-400">
								<span>{new Date(note.createdAt).toLocaleDateString()}</span>
								<button
									onClick={() => handleDeleteNote(note.id)}
									disabled={isPending}
									className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 focus:opacity-100 p-1"
								>
									<Trash2 className="w-3.5 h-3.5" />
								</button>
							</div>
						</div>
					))
				)}
			</div>

			<form onSubmit={handleAddNote} className="relative mt-auto shrink-0">
				<textarea
					value={newNote}
					onChange={(e) => setNewNote(e.target.value)}
					placeholder="Leave a private note..."
					className="w-full bg-white dark:bg-black/40 border border-sand-200 dark:border-sand-800 rounded-2xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-terra-500 resize-none"
					rows={3}
					disabled={isPending}
				/>
				<Button
					type="submit"
					size="icon"
					disabled={!newNote.trim() || isPending}
					className="absolute bottom-3 right-3 w-8 h-8 bg-terra-500 hover:bg-terra-600 text-white rounded-full shadow-md transition-transform active:scale-95"
				>
					<Send className="w-4 h-4" />
				</Button>
			</form>
		</div>
	);
}
