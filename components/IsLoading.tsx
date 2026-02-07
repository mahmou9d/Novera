import { RefreshCw } from 'lucide-react';

const IsLoading = () => {
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="animate-spin text-[#fca481]" size={40} />
      </div>
  );
}

export default IsLoading