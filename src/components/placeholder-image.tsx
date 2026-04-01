type PlaceholderImageProps = {
  name: string;
  className?: string;
};

export function PlaceholderImage({
  name,
  className = "",
}: PlaceholderImageProps) {
  // Genere des initiales a partir du nom
  const initials = name
    .split(/[\s&-]+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${className}`}
    >
      <span className="font-serif text-4xl font-bold text-gray-300">
        {initials}
      </span>
    </div>
  );
}
