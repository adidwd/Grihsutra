import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Sparkles, Moon, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BuddyAvatar, FloatingMessage, SparkleEffect, TypingIndicator } from '@/components/buddy-animations';

interface BedtimeBuddyProps {
  currentPage?: string;
  selectedCategory?: string;
  cartItemCount?: number;
  onProductRecommendation?: (category: string) => void;
}

interface BuddyMessage {
  id: string;
  text: string;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  }>;
  delay?: number;
}

const BedtimeBuddy: React.FC<BedtimeBuddyProps> = ({
  currentPage = 'home',
  selectedCategory,
  cartItemCount = 0,
  onProductRecommendation
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<BuddyMessage | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [buddyMood, setBuddyMood] = useState<'happy' | 'excited' | 'sleepy' | 'thinking' | 'winking'>('happy');
  const [showSparkles, setShowSparkles] = useState(false);

  // Mascot messages based on context
  const getContextualMessage = (): BuddyMessage => {
    const messages: Record<string, BuddyMessage[]> = {
      home: [
        {
          id: 'welcome',
          text: "Hi there! I'm your Bedtime Buddy! 🌙 Ready to create the perfect sleep sanctuary?",
          actions: [
            {
              label: "Show me bedsheets",
              action: () => onProductRecommendation?.('bedsheets'),
              variant: 'default'
            },
            {
              label: "I'm just browsing",
              action: () => setIsExpanded(false),
              variant: 'outline'
            }
          ]
        },
        {
          id: 'comfort-guide',
          text: "Sweet dreams start with the right bedding! Let me help you find something cozy.",
          actions: [
            {
              label: "Find my perfect match",
              action: () => showQuizMessage(),
              variant: 'default'
            }
          ]
        }
      ],
      bedsheets: [
        {
          id: 'bedsheet-expert',
          text: "Great choice! Cotton sheets are breathable and perfect for year-round comfort. Need help choosing?",
          actions: [
            {
              label: "What's the difference?",
              action: () => showBedsheetGuide(),
              variant: 'default'
            },
            {
              label: "Show pillow covers too",
              action: () => onProductRecommendation?.('pillow-covers'),
              variant: 'outline'
            }
          ]
        }
      ],
      'pillow-covers': [
        {
          id: 'pillow-expert',
          text: "Pillow covers that match your sheets create a harmonious bedroom! Want to complete the set?",
          actions: [
            {
              label: "Yes, show table covers",
              action: () => onProductRecommendation?.('table-covers'),
              variant: 'default'
            },
            {
              label: "Just pillows for now",
              action: () => setIsExpanded(false),
              variant: 'outline'
            }
          ]
        }
      ],
      'table-covers': [
        {
          id: 'table-expert',
          text: "Table covers protect your furniture and add style to your bedroom. Perfect for a complete look!",
          actions: [
            {
              label: "Show me complete sets",
              action: () => showCompleteSetMessage(),
              variant: 'default'
            }
          ]
        }
      ],
      product: [
        {
          id: 'product-help',
          text: "This looks lovely! Want to know why this would be perfect for your bedroom?",
          actions: [
            {
              label: "Tell me more",
              action: () => showProductTips(),
              variant: 'default'
            },
            {
              label: "Add to cart",
              action: () => showAddToCartMessage(),
              variant: 'outline'
            }
          ]
        }
      ]
    };

    if (cartItemCount > 0) {
      return {
        id: 'cart-celebration',
        text: `Wonderful! You have ${cartItemCount} item${cartItemCount > 1 ? 's' : ''} in your cart. Ready for sweet dreams? 😴`,
        actions: [
          {
            label: "Add more items",
            action: () => onProductRecommendation?.('bedsheets'),
            variant: 'outline'
          },
          {
            label: "Perfect as is!",
            action: () => setIsExpanded(false),
            variant: 'default'
          }
        ]
      };
    }

    const pageMessages = messages[currentPage] || messages.home;
    return pageMessages[Math.floor(Math.random() * pageMessages.length)];
  };

  const showQuizMessage = () => {
    showMessageWithAnimation({
      id: 'quiz',
      text: "What's your sleep style? Hot sleeper? Cool sleeper? Or somewhere in between?",
      actions: [
        {
          label: "I sleep hot",
          action: () => showRecommendation('hot'),
          variant: 'default'
        },
        {
          label: "I sleep cool",
          action: () => showRecommendation('cool'),
          variant: 'default'
        },
        {
          label: "Just right",
          action: () => showRecommendation('balanced'),
          variant: 'default'
        }
      ]
    }, 'thinking');
  };

  const showRecommendation = (sleepType: string) => {
    const recommendations = {
      hot: "Perfect! Our breathable cotton sheets will keep you cool all night. Let me show you!",
      cool: "Great! Our cozy flannel-feel sheets will keep you warm and comfortable.",
      balanced: "Excellent! Our premium cotton blend is perfect for year-round comfort."
    };

    showMessageWithAnimation({
      id: 'recommendation',
      text: recommendations[sleepType as keyof typeof recommendations],
      actions: [
        {
          label: "Show me these sheets",
          action: () => onProductRecommendation?.('bedsheets'),
          variant: 'default'
        }
      ]
    }, 'excited');
  };

  const showBedsheetGuide = () => {
    setCurrentMessage({
      id: 'bedsheet-guide',
      text: "Cotton is breathable and gets softer with each wash. Thread count matters, but quality cotton at 200-400 TC is perfect for comfort!",
      actions: [
        {
          label: "Thanks! Show me options",
          action: () => setIsExpanded(false),
          variant: 'default'
        }
      ]
    });
  };

  const showCompleteSetMessage = () => {
    setCurrentMessage({
      id: 'complete-set',
      text: "A complete bedroom set creates the perfect sleep environment! Mix and match or go for a coordinated look.",
      actions: [
        {
          label: "I love coordinated sets",
          action: () => onProductRecommendation?.('bedsheets'),
          variant: 'default'
        },
        {
          label: "I prefer to mix & match",
          action: () => setIsExpanded(false),
          variant: 'outline'
        }
      ]
    });
  };

  const showProductTips = () => {
    setCurrentMessage({
      id: 'product-tips',
      text: "This premium cotton feels amazing and gets softer with every wash. The color will stay vibrant too!",
      actions: [
        {
          label: "Sounds perfect!",
          action: () => setIsExpanded(false),
          variant: 'default'
        }
      ]
    });
  };

  const showAddToCartMessage = () => {
    setCurrentMessage({
      id: 'add-to-cart',
      text: "Great choice! Don't forget to check out our matching pillow covers for the complete look!",
      actions: [
        {
          label: "Show pillow covers",
          action: () => onProductRecommendation?.('pillow-covers'),
          variant: 'default'
        }
      ]
    });
  };

  // Helper function to show message with typing animation and mood
  const showMessageWithAnimation = (message: BuddyMessage, mood: typeof buddyMood = 'happy') => {
    setIsTyping(true);
    setBuddyMood('thinking');
    
    setTimeout(() => {
      setIsTyping(false);
      setBuddyMood(mood);
      setCurrentMessage(message);
      
      // Trigger sparkles for exciting moments
      if (mood === 'excited') {
        setShowSparkles(true);
        setTimeout(() => setShowSparkles(false), 2000);
      }
    }, 1000);
  };

  // Show buddy on first visit or after some interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        setIsVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasInteracted]);

  // Update message when context changes
  useEffect(() => {
    if (isExpanded && !currentMessage) {
      setCurrentMessage(getContextualMessage());
    }
  }, [currentPage, selectedCategory, cartItemCount, isExpanded]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    setHasInteracted(true);
    if (!isExpanded) {
      const message = getContextualMessage();
      showMessageWithAnimation(message, cartItemCount > 0 ? 'excited' : 'happy');
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setIsExpanded(false);
    setHasInteracted(true);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isExpanded && (
          <FloatingMessage>
            <Card className="max-w-sm shadow-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
              <SparkleEffect trigger={showSparkles} />
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <BuddyAvatar mood={buddyMood} size="sm" animate={true} />
                  </div>
                  <div className="flex-1">
                    {isTyping ? (
                      <TypingIndicator />
                    ) : currentMessage ? (
                      <>
                        <p className="text-sm text-gray-700 mb-3">{currentMessage.text}</p>
                        {currentMessage.actions && (
                          <div className="flex flex-wrap gap-2">
                            {currentMessage.actions.map((action, index) => (
                              <Button
                                key={index}
                                size="sm"
                                variant={action.variant || 'default'}
                                onClick={action.action}
                                className="text-xs"
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-gray-700">Hi! I'm your Bedtime Buddy! 😊</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsExpanded(false)}
                    className="flex-shrink-0 h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FloatingMessage>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="relative"
      >
        <Button
          onClick={handleToggle}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
        >
          {/* Pulsing animation for attention */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 animate-ping opacity-20"></div>
          
          {/* Sparkles effect */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse">
            <Sparkles className="w-2 h-2 text-yellow-600 absolute top-0.5 left-0.5" />
          </div>
          
          {/* Main buddy avatar */}
          <div className="relative z-10 flex items-center justify-center w-full h-full">
            <BuddyAvatar 
              mood={isExpanded ? 'excited' : cartItemCount > 0 ? 'winking' : 'happy'} 
              size="sm" 
              animate={true} 
            />
          </div>
          
          {/* Notification badge for cart items */}
          {cartItemCount > 0 && (
            <div className="absolute -top-2 -left-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <Heart className="w-2 h-2 text-white" />
            </div>
          )}
        </Button>

        {/* Close button when expanded */}
        {isExpanded && (
          <Button
            onClick={handleClose}
            size="sm"
            variant="ghost"
            className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default BedtimeBuddy;