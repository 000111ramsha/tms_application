import React, { createContext, useContext, useState } from 'react';

/**
 * Context for managing bottom navigation height across the app
 */
const BottomNavContext = createContext({
  bottomNavHeight: 70, // Default fallback
  setBottomNavHeight: () => {},
});

/**
 * Provider component for bottom navigation context
 */
export const BottomNavProvider = ({ children }) => {
  const [bottomNavHeight, setBottomNavHeight] = useState(70);

  return (
    <BottomNavContext.Provider value={{ bottomNavHeight, setBottomNavHeight }}>
      {children}
    </BottomNavContext.Provider>
  );
};

/**
 * Hook to access bottom navigation height
 */
export const useBottomNavContext = () => {
  const context = useContext(BottomNavContext);
  if (!context) {
    throw new Error('useBottomNavContext must be used within a BottomNavProvider');
  }
  return context;
};

/**
 * Hook to get the safe padding bottom for ScrollView content
 * This ensures content doesn't get hidden behind the bottom navigation
 */
export const useScrollViewPadding = () => {
  const { bottomNavHeight } = useBottomNavContext();

  // Reduce padding to half to minimize empty space at bottom
  const paddingBottom = Math.max((bottomNavHeight - 10, 5)); // Half the previous padding, minimum 10px

  return { paddingBottom };
};
