// command_controller.cpp/h equivalent - Manages editor state and commands
import { useState, useEffect, useCallback } from 'react';
import { documentService, Document } from '@/services/DocumentService';
import { configService } from '@/services/ConfigService';
import { EditorToolbar } from '@/components/Editor/EditorToolbar';
import { EditorContent } from '@/components/Editor/EditorContent';
import { DocumentSidebar } from '@/components/Document/DocumentSidebar';
import { DocumentHeader } from '@/components/Document/DocumentHeader';
import { toast } from 'sonner';

export const CommandController = () => {
  const [currentDoc, setCurrentDoc] = useState<Document | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editor, setEditor] = useState<any>(null);

  useEffect(() => {
    // Load or create initial document
    const existingDoc = documentService.getCurrentDocument();
    if (existingDoc) {
      setCurrentDoc(existingDoc);
    } else {
      const newDoc = documentService.createDocument('Untitled Document');
      setCurrentDoc(newDoc);
    }

    // Auto-save setup
    const config = configService.getConfig();
    if (config.autoSave) {
      const interval = setInterval(() => {
        const doc = documentService.getCurrentDocument();
        if (doc) {
          toast.success('Document saved', { duration: 1500 });
        }
      }, config.autoSaveInterval);

      return () => clearInterval(interval);
    }
  }, []);

  const handleContentUpdate = useCallback((content: string) => {
    if (currentDoc) {
      documentService.saveCurrentDocument(content);
      setCurrentDoc({ ...currentDoc, content, lastModified: new Date() });
    }
  }, [currentDoc]);

  const handleNewDocument = () => {
    const newDoc = documentService.createDocument('Untitled Document');
    setCurrentDoc(newDoc);
    toast.success('New document created');
  };

  const handleOpenDocument = (doc: Document) => {
    const openedDoc = documentService.openDocument(doc.id);
    if (openedDoc) {
      setCurrentDoc(openedDoc);
      setSidebarOpen(false);
      toast.success(`Opened "${doc.title}"`);
    }
  };

  const handleRenameDocument = (title: string) => {
    if (currentDoc) {
      documentService.renameDocument(currentDoc.id, title);
      setCurrentDoc({ ...currentDoc, title });
      toast.success('Document renamed');
    }
  };

  const handleDeleteDocument = (id: string) => {
    documentService.deleteDocument(id);
    if (currentDoc?.id === id) {
      const newDoc = documentService.createDocument('Untitled Document');
      setCurrentDoc(newDoc);
    }
    toast.success('Document deleted');
  };

  if (!currentDoc) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DocumentSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        documents={documentService.getAllDocuments()}
        currentDocId={currentDoc.id}
        onOpenDocument={handleOpenDocument}
        onDeleteDocument={handleDeleteDocument}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DocumentHeader
          title={currentDoc.title}
          onTitleChange={handleRenameDocument}
          onNewDocument={handleNewDocument}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <EditorToolbar editor={editor} />
        
        <div className="flex-1 overflow-y-auto bg-background">
          <EditorContent
            content={currentDoc.content}
            onUpdate={handleContentUpdate}
          />
        </div>
      </div>
    </div>
  );
};
