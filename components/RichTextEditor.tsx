'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { FontFamily } from '@tiptap/extension-font-family';
import { ImageResize } from 'tiptap-extension-resize-image';
import { useEffect, useState } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered,
  Link as LinkIcon, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight,
  Undo, Redo, Quote, Minus, Highlighter, Palette, Type, Upload,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const fontSizeOptions = [
  { label: 'Small', value: '14px' },
  { label: 'Normal', value: '16px' },
  { label: 'Large', value: '20px' },
  { label: 'XL', value: '24px' },
  { label: 'XXL', value: '32px' },
];

const fontFamilyOptions = [
  { label: 'Default', value: 'Inter, sans-serif' },
  { label: 'Serif', value: 'Georgia, serif' },
  { label: 'Mono', value: 'monospace' },
];

const textColors = [
  { label: 'Default', value: '#1A1A1A' },
  { label: 'Gray', value: '#6B7280' },
  { label: 'Red', value: '#DC2626' },
  { label: 'Green', value: '#16A34A' },
  { label: 'Blue', value: '#2563EB' },
  { label: 'Purple', value: '#9333EA' },
  { label: 'Orange', value: '#EA580C' },
];

const highlightColors = [
  { label: 'Yellow', value: '#FEF08A' },
  { label: 'Green', value: '#BBF7D0' },
  { label: 'Blue', value: '#BFDBFE' },
  { label: 'Pink', value: '#FBCFE8' },
  { label: 'Orange', value: '#FED7AA' },
];

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);
  const [showFontFamilyPicker, setShowFontFamilyPicker] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: {},
        orderedList: {},
        listItem: {},
      }),
      Link.configure({ openOnClick: false, HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' } }),
      ImageResize.configure({ inline: true }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      HorizontalRule,
      FontFamily.configure({ types: ['textStyle'] }),
    ],
    content: content || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
        'data-placeholder': placeholder || 'Write your content here...',
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  if (!editor) return <div className="border border-gray-300 rounded-lg p-4"><div className="h-[350px] flex items-center justify-center text-gray-400">Loading editor...</div></div>;

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);
    if (url === null) return;
    if (url === '') editor.chain().focus().unsetLink().run();
    else editor.chain().focus().setLink({ href: url }).run();
  };

  const addImageFromUrl = () => {
    const url = window.prompt('Enter image URL:');
// @ts-ignore
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const uploadImageFromPC = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
// @ts-ignore
        reader.onload = (e) => editor.chain().focus().setImage({ src: e.target?.result as string }).run();
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const setFontSize = (size: string) => { editor.chain().focus().setMark('textStyle', { fontSize: size }).run(); setShowFontSizePicker(false); };
  const setFontFamily = (font: string) => { editor.chain().focus().setFontFamily(font).run(); setShowFontFamilyPicker(false); };
  const setTextColor = (color: string) => { editor.chain().focus().setColor(color).run(); setShowColorPicker(false); };
  const setHighlight = (color: string) => { editor.chain().focus().setHighlight({ color }).run(); setShowHighlightPicker(false); };

  const ToolbarButton = ({ onClick, active, disabled, children, title }: any) => (
    <button type="button" onClick={onClick} disabled={disabled} className={`p-2 rounded hover:bg-gray-200 transition-colors ${active ? 'bg-gray-200 text-[#0B3B2F]' : 'text-gray-600'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} title={title}>{children}</button>
  );

  const DropdownPicker = ({ show, setShow, options, onSelect, buttonIcon: Icon, buttonText }: any) => (
    <div className="relative">
      <button onClick={() => setShow(!show)} className="p-2 rounded hover:bg-gray-200 text-gray-600 flex items-center gap-1" title={buttonText}>
        <Icon className="w-4 h-4" />
      </button>
      {show && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-2 flex flex-col min-w-[100px] max-h-60 overflow-y-auto">
          {options.map((opt: any) => (
            <button key={opt.value} onClick={() => onSelect(opt.value)} className="text-left px-3 py-2 text-sm hover:bg-gray-50" style={opt.value.includes('#') ? { backgroundColor: opt.value } : { fontSize: opt.value }}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><Undo className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><Redo className="w-4 h-4" /></ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><Bold className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><Italic className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><UnderlineIcon className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><Strikethrough className="w-4 h-4" /></ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <DropdownPicker show={showFontFamilyPicker} setShow={setShowFontFamilyPicker} options={fontFamilyOptions} onSelect={setFontFamily} buttonIcon={Type} buttonText="Font Family" />
        <DropdownPicker show={showFontSizePicker} setShow={setShowFontSizePicker} options={fontSizeOptions} onSelect={setFontSize} buttonIcon={Type} buttonText="Font Size" />
        <DropdownPicker show={showColorPicker} setShow={setShowColorPicker} options={textColors} onSelect={setTextColor} buttonIcon={Palette} buttonText="Text Color" />
        <DropdownPicker show={showHighlightPicker} setShow={setShowHighlightPicker} options={highlightColors} onSelect={setHighlight} buttonIcon={Highlighter} buttonText="Highlight" />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1"><Heading1 className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2"><Heading2 className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3"><Heading3 className="w-4 h-4" /></ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List"><List className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List"><ListOrdered className="w-4 h-4" /></ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left"><AlignLeft className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align Center"><AlignCenter className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align Right"><AlignRight className="w-4 h-4" /></ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton onClick={addLink} active={editor.isActive('link')} title="Insert Link"><LinkIcon className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={addImageFromUrl} title="Insert Image from URL"><ImageIcon className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={uploadImageFromPC} title="Upload Image from PC"><Upload className="w-4 h-4" /></ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote"><Quote className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Line"><Minus className="w-4 h-4" /></ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
