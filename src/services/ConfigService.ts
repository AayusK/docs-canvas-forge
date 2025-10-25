// config.cpp/h equivalent - Manages editor configuration
export interface EditorConfig {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  autoSave: boolean;
  autoSaveInterval: number;
}

class ConfigService {
  private config: EditorConfig = {
    fontFamily: 'Arial, sans-serif',
    fontSize: 11,
    lineHeight: 1.5,
    autoSave: true,
    autoSaveInterval: 30000, // 30 seconds
  };

  getConfig(): EditorConfig {
    const stored = localStorage.getItem('editor-config');
    if (stored) {
      try {
        this.config = { ...this.config, ...JSON.parse(stored) };
      } catch (e) {
        console.error('Failed to load config:', e);
      }
    }
    return this.config;
  }

  updateConfig(updates: Partial<EditorConfig>) {
    this.config = { ...this.config, ...updates };
    localStorage.setItem('editor-config', JSON.stringify(this.config));
  }

  resetConfig() {
    this.config = {
      fontFamily: 'Arial, sans-serif',
      fontSize: 11,
      lineHeight: 1.5,
      autoSave: true,
      autoSaveInterval: 30000,
    };
    localStorage.removeItem('editor-config');
  }
}

export const configService = new ConfigService();
