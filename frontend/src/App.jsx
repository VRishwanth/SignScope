import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, Loader, AlertCircle, Sun, Moon, Image as ImageIcon, XCircle } from 'lucide-react';

// --- Theme Toggle Component ---
const ThemeToggle = ({ theme, toggleTheme }) => (
  <button
    onClick={toggleTheme}
    className="absolute top-4 right-4 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
    aria-label="Toggle dark mode"
  >
    {theme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
  </button>
);

// --- Main App Component ---
export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  
  // Ref for the file input
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setPrediction(null);
      setError(null);
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError('Please select an image file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrediction(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
try {
      const response = await fetch('https://signscope-backend.onrender.com/predict', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server error occurred.');
      }

      const data = await response.json();
      setPrediction(data);

    } catch (err) {
      setError(err.message || 'Failed to get prediction. Please ensure the Flask server is running.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClear = () => {
      setSelectedFile(null);
      setPreview(null);
      setPrediction(null);
      setError(null);
      setIsLoading(false);
      // Also clear the file input value
      if(fileInputRef.current) {
          fileInputRef.current.value = "";
      }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center font-sans p-4 transition-colors duration-300">
      <div className="w-full max-w-2xl mx-auto relative">
        
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        
        <Header />

        <main className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Upload Traffic Sign</h2>
              {preview ? (
                <ImagePreview preview={preview} onClear={handleClear} />
              ) : (
                <ImageUploader onButtonClick={() => fileInputRef.current.click()} />
              )}
               <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg"
                className="hidden"
              />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Prediction</h2>
                {isLoading && <LoadingSpinner />}
                {error && <ErrorMessage message={error} />}
                {prediction && !isLoading && <PredictionResult prediction={prediction} />}
                {!prediction && !isLoading && !error && (
                    <div className="text-center text-gray-500 dark:text-gray-400 p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                        <ImageIcon className="mx-auto w-12 h-12 text-gray-400" />
                        <p className="mt-2">Your prediction will appear here.</p>
                    </div>
                )}
              </div>
              
              <div className="flex items-center justify-end space-x-4 mt-6">
                <button
                  onClick={handleClear}
                  className="px-6 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                >
                  Clear
                </button>
                <button
                  onClick={handlePredict}
                  disabled={!selectedFile || isLoading}
                  className="px-8 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
                >
                  {isLoading ? 'Analyzing...' : 'Predict'}
                </button>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}

// --- Child Components ---

const Header = () => (
  <header className="text-center pt-8">
    <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-gray-100">Traffic Sign Recognition</h1>
    <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">Upload an image to classify a traffic sign.</p>
  </header>
);

const ImageUploader = ({ onButtonClick }) => (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl border-gray-300 dark:border-gray-600 h-full">
        <UploadCloud className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-center mb-4">Click the button to select an image.</p>
        <button 
            onClick={onButtonClick}
            className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
            Choose File
        </button>
    </div>
);

const ImagePreview = ({ preview, onClear }) => (
  <div className="relative mt-4 p-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-lg shadow-sm overflow-hidden">
    <img src={preview} alt="Selected traffic sign" className="w-full h-auto object-contain rounded-md max-h-64" />
     <button onClick={onClear} className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors">
        <XCircle className="w-6 h-6" />
    </button>
  </div>
);

const PredictionResult = ({ prediction }) => (
  <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 text-green-800 dark:text-green-200 p-4 rounded-lg shadow-md animate-fade-in">
    <p className="text-lg font-semibold">Predicted Sign:</p>
    <p className="text-3xl font-bold my-2">{prediction.signName}</p>
    <p className="text-md">
      Confidence: <span className="font-semibold">{ (prediction.confidence * 100).toFixed(2) }%</span>
    </p>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8 text-blue-600 dark:text-blue-400">
    <Loader className="w-10 h-10 animate-spin" />
    <span className="ml-4 text-lg">Predicting...</span>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-800 dark:text-red-200 p-4 rounded-lg shadow-md flex items-center">
    <AlertCircle className="w-6 h-6 mr-3" />
    <p>{message}</p>
  </div>
);

const Footer = () => (
    <footer className="text-center mt-8">
        <p className="text-sm text-gray-400 dark:text-gray-500">Created By Rishwanth Vangala</p>
    </footer>
);

// Add CSS for fade-in animation
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);
