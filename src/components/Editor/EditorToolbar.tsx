// graphics.cpp/h equivalent - Toolbar UI
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CommandType, commandService } from '@/services/CommandService';
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
  editor: any;
}

interface ToolbarButton {
  command: CommandType;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const toolbarGroups: ToolbarButton[][] = [
  [
    { command: 'undo', icon: Undo, label: 'Undo' },
    { command: 'redo', icon: Redo, label: 'Redo' },
  ],
  [
    { command: 'bold', icon: Bold, label: 'Bold' },
    { command: 'italic', icon: Italic, label: 'Italic' },
    { command: 'underline', icon: Underline, label: 'Underline' },
    { command: 'strike', icon: Strikethrough, label: 'Strike' },
  ],
  [
    { command: 'heading1', icon: Heading1, label: 'Heading 1' },
    { command: 'heading2', icon: Heading2, label: 'Heading 2' },
    { command: 'heading3', icon: Heading3, label: 'Heading 3' },
  ],
  [
    { command: 'bulletList', icon: List, label: 'Bullet List' },
    { command: 'orderedList', icon: ListOrdered, label: 'Ordered List' },
  ],
  [
    { command: 'alignLeft', icon: AlignLeft, label: 'Align Left' },
    { command: 'alignCenter', icon: AlignCenter, label: 'Align Center' },
    { command: 'alignRight', icon: AlignRight, label: 'Align Right' },
  ],
];

export const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  if (!editor) return null;

  const handleCommand = (command: CommandType) => {
    commandService.executeCommand(command);
  };

  const isActive = (command: CommandType) => {
    return commandService.isCommandActive(command);
  };

  const canExecute = (command: CommandType) => {
    return commandService.canExecuteCommand(command);
  };

  return (
    <div className="sticky top-0 z-10 flex items-center gap-1 px-4 py-2 bg-toolbar-bg border-b border-border">
      {toolbarGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="flex items-center gap-1">
          {group.map(({ command, icon: Icon, label }) => (
            <Button
              key={command}
              variant="ghost"
              size="sm"
              onClick={() => handleCommand(command)}
              disabled={!canExecute(command)}
              className={cn(
                "h-8 w-8 p-0 hover:bg-toolbar-hover transition-colors",
                isActive(command) && "bg-accent/10 text-accent"
              )}
              title={label}
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}
          {groupIndex < toolbarGroups.length - 1 && (
            <Separator orientation="vertical" className="h-6 mx-1" />
          )}
        </div>
      ))}
    </div>
  );
};
