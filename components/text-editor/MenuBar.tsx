"use client"

import { type Editor } from "@tiptap/react";
import { Toggle } from "../ui/toggle";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Italic,
  Link,
  ListIcon,
  ListOrdered,
  Redo,
  Underline,
  Undo,
} from "lucide-react";
import { ReactNode } from "react";

interface iAppProps {
  editor: Editor | null;
}

interface MenuToggleProps {
  icon: ReactNode;
  active: boolean;
  onToggle: () => void;
  tooltip: string;
  variant?: "default" | "outline";
}

interface HistoryButtonProps {
  icon: ReactNode;
  onClick: () => void;
  disabled: boolean;
  tooltip: string;
}

const MenuToggle = ({ icon, active, onToggle, tooltip, variant = "outline" }: MenuToggleProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Toggle
        size="sm"
        className={`size-8 rounded-xs ${active? "bg-input text-accent-foreground" : ""}`}
        variant={variant}
        pressed={active}
        onPressedChange={onToggle}
      >
          {icon}
      </Toggle>
    </TooltipTrigger>
    <TooltipContent>{tooltip}</TooltipContent>
  </Tooltip>
);

const HistoryButton = ({ icon, onClick, disabled, tooltip }: HistoryButtonProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        className="text-muted-foreground"
        size="sm"
        variant="ghost"
        type="button"
        onClick={onClick}
        disabled={disabled}
      >
        {icon}
      </Button>
    </TooltipTrigger>
    <TooltipContent>{tooltip}</TooltipContent>
  </Tooltip>
);

export default function MenuBar({ editor }: iAppProps) {
  if (!editor) return null;

  return (
    <div className="border border-t-0 border-x-0 border-input rounded-t-lg p-2 overflow-hidden bg-card flex flex-wrap gap-1 items-center">
      <TooltipProvider>
        <div className="flex flex-wrap gap-1">
          <MenuToggle
            icon={<Bold />}
            active={editor.isActive("bold")}
            onToggle={() => editor.chain().focus().toggleBold().run()}
            tooltip="Bold (⌘+B)"
          />
          <MenuToggle
            icon={<Italic />}
            active={editor.isActive("italic")}
            onToggle={() => editor.chain().focus().toggleItalic().run()}
            tooltip="Italic (⌘+I)"
          />
          <MenuToggle
            icon={<Underline />}
            active={editor.isActive("underline")}
            onToggle={() => editor.chain().focus().toggleUnderline().run()}
            tooltip="Underline (⌘+U)"
          />

          <div className="w-px h-6 bg-border mx-2"></div>

          <MenuToggle
            icon={<Heading1Icon />}
            active={editor.isActive("heading", { level: 1 })}
            onToggle={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            tooltip="Heading 1 (⌘+Alt+1)"
          />
          <MenuToggle
            icon={<Heading2Icon />}
            active={editor.isActive("heading", { level: 2 })}
            onToggle={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            tooltip="Heading 2 (⌘+Alt+2)"
          />
          <MenuToggle
            icon={<Heading3Icon />}
            active={editor.isActive("heading", { level: 3 })}
            onToggle={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            tooltip="Heading 3 (⌘+Alt+3)"
          />

          <div className="w-px h-6 bg-border mx-2"></div>

          <MenuToggle
            icon={<ListIcon />}
            active={editor.isActive("bulletList")}
            onToggle={() => editor.chain().focus().toggleBulletList().run()}
            tooltip="Bullet List (⌘+Shift+8)"
          />
          <MenuToggle
            icon={<ListOrdered />}
            active={editor.isActive("orderedList")}
            onToggle={() => editor.chain().focus().toggleOrderedList().run()}
            tooltip="Ordered List (⌘+Shift+7)"
          />
          <MenuToggle
            icon={<Link />}
            active={editor.isActive("link")}
            onToggle={() => editor.chain().focus().toggleLink().run()}
            tooltip="Link"
          />
          
        <div className="w-px h-6 bg-border mx-2"></div>

          <MenuToggle
            icon={<AlignLeft />}
            active={editor.isActive({ textAlign: "left" })}
            onToggle={() => editor.chain().focus().setTextAlign("left").run()}
            tooltip="Align Left (⌘+Shift+L)"
          />
          <MenuToggle
            icon={<AlignCenter />}
            active={editor.isActive({ textAlign: "center" })}
            onToggle={() => editor.chain().focus().setTextAlign("center").run()}
            tooltip="Align Center (⌘+Shift+E)"
          />
          <MenuToggle
            icon={<AlignRight />}
            active={editor.isActive({ textAlign: "right" })}
            onToggle={() => editor.chain().focus().setTextAlign("right").run()}
            tooltip="Align Right (⌘+Shift+R)"
          />

        <div className="w-px h-6 bg-border mx-2"></div>

          <HistoryButton
            icon={<Undo />}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            tooltip="Undo (⌘+Z)"
          />
          <HistoryButton
            icon={<Redo />}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            tooltip="Redo (⌘+Shift+Z)"
          />
        </div>


      </TooltipProvider>
    </div>
  );
}
