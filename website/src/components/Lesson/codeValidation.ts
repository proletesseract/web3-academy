export const validateCode = (code: string, solution: string, stepId: string): boolean => {
  if (!solution) return false;
  
  // Different validation strategies based on the step
  switch (stepId) {
    case '02':
      // For step 2, check for required configuration properties
      const requiredProperties = [
        'environment',
        'clientId',
        'redirectUri',
        'audience',
        'scope'
      ];
      return requiredProperties.every(prop => code.includes(prop));
      
    case '03':
      // For step 3, check for Passport initialization
      return code.includes('passport.Passport') && code.includes('imtblConfig');
      
    case '04':
      // For step 4, check for NFT transfer functionality
      return code.includes('connectEvm') && 
             code.includes('BrowserProvider') && 
             code.includes('Contract') && 
             code.includes('safeTransferFrom');
      
    default:
      // Default validation - normalize whitespace and compare
      const normalizedCode = code.trim().replace(/\s+/g, ' ');
      const normalizedSolution = solution.trim().replace(/\s+/g, ' ');
      return normalizedCode === normalizedSolution;
  }
}; 