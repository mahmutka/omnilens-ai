import React, { useState, useRef, useCallback } from 'react';
import Camera from './components/Camera';
import Menu from './components/Menu';
import ResultModal from './components/ResultModal';
import LoadingOverlay from './components/LoadingOverlay';
import { CameraHandle, Category, AnalysisResult } from './types';
import { analyzeImage } from './services/geminiService';

const App: React.FC = () => {
  const cameraRef = useRef<CameraHandle>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectCategory = useCallback(async (category: Category) => {
    if (isProcessing) return;

    // 1. Capture Image
    const base64Image = cameraRef.current?.capture();
    
    if (!base64Image) {
      alert("Failed to capture image. Please ensure the camera is active.");
      return;
    }

    setIsProcessing(true);

    try {
      // 2. Send to Gemini
      const analysisText = await analyzeImage(base64Image, category.promptTemplate);
      
      // 3. Show Result
      setResult({
        categoryTitle: category.title,
        text: analysisText
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      alert("An error occurred during analysis. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setResult(null);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans touch-none">
      
      {/* 1. Camera View Layer */}
      <Camera ref={cameraRef} />

      {/* 2. Loading Overlay */}
      {isProcessing && <LoadingOverlay />}

      {/* 3. Perimeter Menu - Acts as the main interaction layer when modal is closed */}
      {!isModalOpen && (
        <Menu 
          onSelectCategory={handleSelectCategory} 
          isProcessing={isProcessing} 
        />
      )}

      {/* 4. Result Modal */}
      <ResultModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        result={result} 
      />
      
    </div>
  );
};

export default App;