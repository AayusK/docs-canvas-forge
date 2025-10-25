// edit.cpp/h equivalent - Main editor component
import { useEditor, EditorContent as TiptapContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { useEffect } from 'react';
import { commandService } from '@/services/CommandService';
import { configService } from '@/services/ConfigService';
import './editor-styles.css';

interface EditorContentProps {
  content: string;
  onUpdate: (content: string) => void;
}

export const EditorContent = ({ content, onUpdate }: EditorContentProps) => {
  const config = configService.getConfig();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      FontFamily,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
        style: `font-family: ${config.fontFamily}; font-size: ${config.fontSize}pt; line-height: ${config.lineHeight};`,
      },
    },
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor) {
      commandService.setEditor(editor);
    }
  }, [editor]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return <TiptapContent editor={editor} className="editor-content" />;
};
