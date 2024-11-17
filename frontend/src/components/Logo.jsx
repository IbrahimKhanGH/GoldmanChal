import { Link } from 'react-router-dom';

function Logo({ size = 'normal' }) {
  const sizes = {
    small: 'text-xl',
    normal: 'text-2xl',
    large: 'text-4xl'
  };

  return (
    <Link to="/" className="flex items-center">
      <span className={`${sizes[size]} font-black font-['Orbitron']`}>
        <span className="text-white">UNI</span>
        <span className="bg-gradient-to-r from-secondary to-indigo-600 text-transparent bg-clip-text">FI</span>
      </span>
    </Link>
  );
}

export default Logo; 