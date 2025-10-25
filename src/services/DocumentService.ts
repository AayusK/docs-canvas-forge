// opened_file.cpp/h equivalent - Manages document state
export interface Document {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
  created: Date;
}

class DocumentService {
  private currentDocument: Document | null = null;
  private documents: Document[] = [];

  constructor() {
    this.loadDocuments();
  }

  private loadDocuments() {
    const stored = localStorage.getItem('documents');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.documents = parsed.map((doc: any) => ({
          ...doc,
          created: new Date(doc.created),
          lastModified: new Date(doc.lastModified),
        }));
      } catch (e) {
        console.error('Failed to load documents:', e);
      }
    }
  }

  private saveDocuments() {
    localStorage.setItem('documents', JSON.stringify(this.documents));
  }

  createDocument(title: string = 'Untitled Document'): Document {
    const doc: Document = {
      id: crypto.randomUUID(),
      title,
      content: '',
      created: new Date(),
      lastModified: new Date(),
    };
    
    this.documents.unshift(doc);
    this.currentDocument = doc;
    this.saveDocuments();
    
    return doc;
  }

  openDocument(id: string): Document | null {
    const doc = this.documents.find(d => d.id === id);
    if (doc) {
      this.currentDocument = doc;
      return doc;
    }
    return null;
  }

  saveCurrentDocument(content: string) {
    if (!this.currentDocument) {
      this.currentDocument = this.createDocument();
    }
    
    this.currentDocument.content = content;
    this.currentDocument.lastModified = new Date();
    
    const index = this.documents.findIndex(d => d.id === this.currentDocument!.id);
    if (index !== -1) {
      this.documents[index] = this.currentDocument;
    }
    
    this.saveDocuments();
  }

  renameDocument(id: string, newTitle: string) {
    const doc = this.documents.find(d => d.id === id);
    if (doc) {
      doc.title = newTitle;
      doc.lastModified = new Date();
      if (this.currentDocument?.id === id) {
        this.currentDocument.title = newTitle;
      }
      this.saveDocuments();
    }
  }

  deleteDocument(id: string) {
    this.documents = this.documents.filter(d => d.id !== id);
    if (this.currentDocument?.id === id) {
      this.currentDocument = null;
    }
    this.saveDocuments();
  }

  getCurrentDocument(): Document | null {
    return this.currentDocument;
  }

  getAllDocuments(): Document[] {
    return this.documents;
  }
}

export const documentService = new DocumentService();
