interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  inline?: boolean;
}

const sizeClasses = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

export default function Loader({
  size = "md",
  text,
  inline = false,
}: LoaderProps) {
  return (
    <div  className={
    inline
      ? "flex items-center gap-2"
      : "flex flex-col items-center justify-center gap-3"
  }>
      <div
        className={`animate-spin rounded-full border-2 border-indigo-500/20 border-t-indigo-500 ${sizeClasses[size]}`}
      />
      {text && (
        <p className="text-sm text-gray-400">
          {text}
        </p>
      )}
    </div>
  );
}