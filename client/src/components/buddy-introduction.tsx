import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BuddyAvatar } from '@/components/buddy-animations';

interface BuddyIntroductionProps {
  onComplete?: () => void;
  onDismiss?: () => void;
}

const BuddyIntroduction: React.FC<BuddyIntroductionProps> = ({ onComplete, onDismiss }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Meet Your Bedtime Buddy! 🌙",
      content: "Hi! I'm your personal sleep companion. I'll help you find the perfect bedding for amazing sleep!",
      mood: 'happy' as const,
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      title: "How I Help You",
      content: "I'll recommend products based on your sleep style, guide you through our collection, and help you create the perfect bedroom setup.",
      mood: 'excited' as const,
      icon: <ArrowRight className="w-5 h-5" />
    },
    {
      title: "Just Click to Chat!",
      content: "Look for my friendly face in the bottom right corner. I'll be there whenever you need guidance or have questions!",
      mood: 'winking' as const,
      icon: <ArrowRight className="w-5 h-5" />
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.();
    }
  };

  const handleSkip = () => {
    onDismiss?.();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="max-w-md w-full shadow-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader className="text-center relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="absolute top-2 right-2 w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="flex justify-center mb-4">
              <BuddyAvatar mood={steps[currentStep].mood} size="lg" animate={true} />
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">
              {steps[currentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-600 text-base leading-relaxed">
              {steps[currentStep].content}
            </p>
            
            {/* Step indicator */}
            <div className="flex justify-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={handleSkip}
                className="text-gray-500"
              >
                Skip Tutorial
              </Button>
              
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
              >
                {currentStep === steps.length - 1 ? "Let's Get Started!" : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BuddyIntroduction;