"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered } from "lucide-react";

interface RichTextEditorProps {
	content: string;
	onChange: (content: string) => void;
	placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder = "Share your thoughts..." }: RichTextEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Placeholder.configure({
				placeholder,
			}),
		],
		content,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		editorProps: {
			attributes: {
				class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[150px] px-4 py-3",
			},
		},
	});

	if (!editor) {
		return null;
	}

	return (
		<div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
			{/* Toolbar */}
			<div className="flex items-center space-x-1 border-b border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800/50">
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleBold().run()}
					className={`p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
						editor.isActive("bold") ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"
					}`}
				>
					<Bold size={16} />
				</button>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleItalic().run()}
					className={`p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
						editor.isActive("italic") ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"
					}`}
				>
					<Italic size={16} />
				</button>
				<div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-2" />
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={`p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
						editor.isActive("bulletList") ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"
					}`}
				>
					<List size={16} />
				</button>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={`p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
						editor.isActive("orderedList") ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"
					}`}
				>
					<ListOrdered size={16} />
				</button>
			</div>

			{/* Editor */}
			<EditorContent editor={editor} />
		</div>
	);
}
