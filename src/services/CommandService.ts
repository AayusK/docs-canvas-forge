// command.cpp/h equivalent - Handles editor commands
import { Editor } from '@tiptap/react';

export type CommandType = 
  | 'bold' 
  | 'italic' 
  | 'underline' 
  | 'strike'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bulletList'
  | 'orderedList'
  | 'alignLeft'
  | 'alignCenter'
  | 'alignRight'
  | 'undo'
  | 'redo';

export class CommandService {
  private editor: Editor | null = null;

  setEditor(editor: Editor) {
    this.editor = editor;
  }

  executeCommand(command: CommandType, value?: any) {
    if (!this.editor) return;

    const commands: Record<CommandType, () => void> = {
      bold: () => this.editor?.chain().focus().toggleBold().run(),
      italic: () => this.editor?.chain().focus().toggleItalic().run(),
      underline: () => this.editor?.chain().focus().toggleUnderline().run(),
      strike: () => this.editor?.chain().focus().toggleStrike().run(),
      heading1: () => this.editor?.chain().focus().toggleHeading({ level: 1 }).run(),
      heading2: () => this.editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      heading3: () => this.editor?.chain().focus().toggleHeading({ level: 3 }).run(),
      bulletList: () => this.editor?.chain().focus().toggleBulletList().run(),
      orderedList: () => this.editor?.chain().focus().toggleOrderedList().run(),
      alignLeft: () => this.editor?.chain().focus().setTextAlign('left').run(),
      alignCenter: () => this.editor?.chain().focus().setTextAlign('center').run(),
      alignRight: () => this.editor?.chain().focus().setTextAlign('right').run(),
      undo: () => this.editor?.chain().focus().undo().run(),
      redo: () => this.editor?.chain().focus().redo().run(),
    };

    commands[command]?.();
  }

  isCommandActive(command: CommandType): boolean {
    if (!this.editor) return false;

    const activeChecks: Record<CommandType, () => boolean> = {
      bold: () => this.editor?.isActive('bold') ?? false,
      italic: () => this.editor?.isActive('italic') ?? false,
      underline: () => this.editor?.isActive('underline') ?? false,
      strike: () => this.editor?.isActive('strike') ?? false,
      heading1: () => this.editor?.isActive('heading', { level: 1 }) ?? false,
      heading2: () => this.editor?.isActive('heading', { level: 2 }) ?? false,
      heading3: () => this.editor?.isActive('heading', { level: 3 }) ?? false,
      bulletList: () => this.editor?.isActive('bulletList') ?? false,
      orderedList: () => this.editor?.isActive('orderedList') ?? false,
      alignLeft: () => this.editor?.isActive({ textAlign: 'left' }) ?? false,
      alignCenter: () => this.editor?.isActive({ textAlign: 'center' }) ?? false,
      alignRight: () => this.editor?.isActive({ textAlign: 'right' }) ?? false,
      undo: () => false,
      redo: () => false,
    };

    return activeChecks[command]?.() ?? false;
  }

  canExecuteCommand(command: CommandType): boolean {
    if (!this.editor) return false;
    
    if (command === 'undo') return this.editor.can().undo();
    if (command === 'redo') return this.editor.can().redo();
    
    return true;
  }
}

export const commandService = new CommandService();
