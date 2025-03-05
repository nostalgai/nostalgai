function LoadingSpinner() {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Enhancing photo...</p>
      </div>
    );
  }
  
  export default LoadingSpinner;