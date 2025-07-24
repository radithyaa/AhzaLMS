/* eslint-disable */

"use client"
import {EditorContent, useEditor} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import MenuBar from "./MenuBar";
import TextAlign from "@tiptap/extension-text-align"
import { ControllerRenderProps } from "react-hook-form";
import type { Editor } from "@tiptap/react";

export default function TextEditor({
  value,
  onChange,
  onBlur,
  ref,
}: ControllerRenderProps<any, any>) {
    const editor: Editor | null = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
            types: ["heading", "paragraph"],
            })
        ],
        editorProps: {
            attributes: {
                class: 'min-h-75  p-4 focus:outline-none prose prose-sm sm:prose-sm md:prose-md xl:prose-lg dark:prose-invert !w-full !max-w-none'
            }
        },
        content: value ? JSON.parse(value) : "",
        onUpdate: ({editor}) => {
            onChange(JSON.stringify(editor.getJSON()))
        },
        immediatelyRender: false,
        
    })
    return (
        <div ref={ref} onBlur={onBlur} className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="focus:outline-none" />
        </div>
    )
}