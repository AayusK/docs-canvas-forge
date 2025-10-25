// Document header with title editing
import { useState, useRef, useEffect } from 'react';
import { Menu, FilePlus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DocumentHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onNewDocument: () => void;
  onToggleSidebar: () => void;
}

export const DocumentHeader = ({
  title,
  onTitleChange,
  onNewDocument,
  onToggleSidebar,
}: DocumentHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editedTitle.trim()) {
      onTitleChange(editedTitle.trim());
    } else {
      setEditedTitle(title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditedTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <header className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleSidebar}
        className="h-9 w-9 p-0"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <FileText className="h-5 w-5 text-primary" />

      {isEditing ? (
        <Input
          ref={inputRef}
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="h-8 max-w-xs"
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="text-lg font-medium hover:text-primary transition-colors px-2 py-1 rounded hover:bg-accent/10"
        >
          {title}
        </button>
      )}

      <div className="ml-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={onNewDocument}
          className="gap-2"
        >
          <FilePlus className="h-4 w-4" />
          New
        </Button>
      </div>
    </header>
  );
};
