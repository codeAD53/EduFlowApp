import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  onBack: () => void;
}

const PageHeader = ({
  title,
  onBack,
}: PageHeaderProps) => {
  return (
    <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white transition"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-xl font-bold text-white">
          {title}
        </h1>
      </div>
    </nav>
  );
};

export default PageHeader;