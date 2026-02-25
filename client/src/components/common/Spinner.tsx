const Spinner = () => {
  return (
  
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        {/* Cái vòng xoay */}
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-black" />
        
  
        <p className="text-sm font-medium text-gray-600 animate-pulse">
          Đang tải...
        </p>
      </div>
    </div>
  );
};

export default Spinner;