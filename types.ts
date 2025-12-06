export interface Category {
  id: string;
  title: string;
  icon: string;
  description: string;
  promptTemplate: string;
}

export interface AnalysisResult {
  text: string;
  categoryTitle: string;
}

export interface CameraHandle {
  capture: () => string | null;
}
