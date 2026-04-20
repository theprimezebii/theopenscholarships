interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Avatar({ name, size = 'md' }: AvatarProps) {
  const firstLetter = name?.charAt(0).toUpperCase() || '?';
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };
  
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-[#0B3B2F] to-[#1A5D4A] flex items-center justify-center text-white font-medium`}>
      {firstLetter}
    </div>
  );
}
