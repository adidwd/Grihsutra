import React from 'react';
import { motion } from 'framer-motion';

interface BuddyAvatarProps {
  mood?: 'happy' | 'excited' | 'sleepy' | 'thinking' | 'winking';
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export const BuddyAvatar: React.FC<BuddyAvatarProps> = ({ 
  mood = 'happy', 
  size = 'md',
  animate = true 
}) => {
  const sizes = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 }
  };

  const currentSize = sizes[size];

  // SVG mascot with different expressions
  const getMascotSVG = () => {
    const expressions = {
      happy: {
        eyes: "M12 8c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2zm8 0c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z",
        mouth: "M8 16s2 3 4 3 4-3 4-3"
      },
      excited: {
        eyes: "M12 8c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2zm8 0c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z",
        mouth: "M6 14s3 4 6 4 6-4 6-4"
      },
      sleepy: {
        eyes: "M8 8h4m4 0h4",
        mouth: "M10 16h4"
      },
      thinking: {
        eyes: "M12 8c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2zm6 0c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z",
        mouth: "M10 16c1-1 2-1 4 0"
      },
      winking: {
        eyes: "M12 8c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2zm6 8h4",
        mouth: "M8 16s2 2 4 2 4-2 4-2"
      }
    };

    const expression = expressions[mood];

    return (
      <svg
        width={currentSize.width}
        height={currentSize.height}
        viewBox="0 0 24 24"
        className="drop-shadow-sm"
      >
        {/* Head */}
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="url(#buddyGradient)"
          stroke="#4F46E5"
          strokeWidth="1"
        />
        
        {/* Eyes */}
        <path
          d={expression.eyes}
          stroke="#1F2937"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Mouth */}
        <path
          d={expression.mouth}
          stroke="#1F2937"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Cheeks (for happy/excited) */}
        {(mood === 'happy' || mood === 'excited') && (
          <>
            <circle cx="7" cy="13" r="1.5" fill="#F472B6" opacity="0.6" />
            <circle cx="17" cy="13" r="1.5" fill="#F472B6" opacity="0.6" />
          </>
        )}
        
        {/* Sleep z's for sleepy */}
        {mood === 'sleepy' && (
          <g opacity="0.7">
            <text x="20" y="6" fontSize="8" fill="#6B7280">z</text>
            <text x="22" y="4" fontSize="6" fill="#6B7280">z</text>
            <text x="24" y="2" fontSize="4" fill="#6B7280">z</text>
          </g>
        )}
        
        {/* Thought bubble for thinking */}
        {mood === 'thinking' && (
          <g opacity="0.7">
            <circle cx="20" cy="6" r="2" fill="#E5E7EB" />
            <circle cx="22" cy="4" r="1" fill="#E5E7EB" />
            <circle cx="23" cy="2" r="0.5" fill="#E5E7EB" />
          </g>
        )}
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="buddyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  if (!animate) {
    return <div className="flex items-center justify-center">{getMascotSVG()}</div>;
  }

  return (
    <motion.div
      className="flex items-center justify-center"
      animate={{
        scale: [1, 1.05, 1],
        rotate: [0, 2, -2, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    >
      {getMascotSVG()}
    </motion.div>
  );
};

// Floating animation for messages
export const FloatingMessage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {children}
      
      {/* Message tail */}
      <div className="absolute -bottom-2 right-8 w-4 h-4 bg-gradient-to-br from-blue-50 to-purple-50 rotate-45 border-r border-b border-blue-200"></div>
    </motion.div>
  );
};

// Sparkle animation for special moments
export const SparkleEffect: React.FC<{ trigger?: boolean }> = ({ trigger = false }) => {
  if (!trigger) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 1,
            delay: i * 0.1,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />
      ))}
    </div>
  );
};

// Typing indicator for when buddy is "thinking"
export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-1 p-2">
      <div className="text-xs text-gray-500">Bedtime Buddy is thinking</div>
      <div className="flex space-x-1">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 h-1 bg-gray-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.6,
              delay: i * 0.2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BuddyAvatar;