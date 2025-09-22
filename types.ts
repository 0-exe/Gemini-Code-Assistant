export enum SupportedLanguage {
  Python = "Python",
  JavaScript = "JavaScript",
  Java = "Java",
  CPP = "C++",
  CSharp = "C#",
  CSharpWinForms = "C# (Windows Forms)",
  HTML_CSS = "HTML/CSS",
}

export interface SavedSnippet {
  id: string;
  title: string;
  description: string;
  prompt: string;
  code: string;
  language: SupportedLanguage;
  createdAt: string;
}

export interface TestGenerationOutput {
  testCode: string;
  setupInstructions: string;
}

export interface UploadedFile {
  name: string;
  mimeType: string;
  data: string; // base64 encoded data
}
