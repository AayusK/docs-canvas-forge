// Document management sidebar
import { X, FileText, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Document } from '@/services/DocumentService';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface DocumentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  documents: Document[];
  currentDocId: string | null;
  onOpenDocument: (doc: Document) => void;
  onDeleteDocument: (id: string) => void;
}

export const DocumentSidebar = ({
  isOpen,
  onClose,
  documents,
  currentDocId,
  onOpenDocument,
  onDeleteDocument,
}: DocumentSidebarProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      <aside className="fixed left-0 top-0 h-full w-80 bg-card border-r border-border z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Documents</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {documents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No documents yet</p>
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className={cn(
                    "group relative rounded-md p-3 cursor-pointer transition-colors hover:bg-accent/10",
                    currentDocId === doc.id && "bg-accent/20"
                  )}
                  onClick={() => onOpenDocument(doc)}
                >
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{doc.title}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        {format(doc.lastModified, 'MMM d, yyyy')}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete "${doc.title}"?`)) {
                          onDeleteDocument(doc.id);
                        }
                      }}
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </aside>
    </>
  );
};
