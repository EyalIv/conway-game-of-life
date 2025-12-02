import { useState } from 'react';
import { getNextGeneration, createEmptyGrid } from '../utils/gameOfLife';

export function GameOfLifeTest() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const runTests = () => {
    const results: string[] = [];
    
    // Test 1: Horizontal line (blinker)
    const blinker1 = createEmptyGrid(5);
    blinker1[2][1] = true; // ●○○
    blinker1[2][2] = true; // ●●●
    blinker1[2][3] = true; // ○○○
    
    const blinker2 = getNextGeneration(blinker1);
    const expectedBlinker2 = createEmptyGrid(5);
    expectedBlinker2[1][2] = true; // ○●○
    expectedBlinker2[2][2] = true; // ○●○
    expectedBlinker2[3][2] = true; // ○●○
    
    const blinkerWorks = JSON.stringify(blinker2) === JSON.stringify(expectedBlinker2);
    results.push(`Blinker test: ${blinkerWorks ? 'PASS' : 'FAIL'}`);
    
    if (!blinkerWorks) {
      results.push(`Expected: ${expectedBlinker2[1].map(c => c ? '●' : '○').join('')}`);
      results.push(`Got: ${blinker2[1].map(c => c ? '●' : '○').join('')}`);
      results.push(`Expected: ${expectedBlinker2[2].map(c => c ? '●' : '○').join('')}`);
      results.push(`Got: ${blinker2[2].map(c => c ? '●' : '○').join('')}`);
    }
    
    // Test 2: Block (still life)
    const block1 = createEmptyGrid(4);
    block1[1][1] = true; // ●●
    block1[1][2] = true; // ●●
    block1[2][1] = true;
    block1[2][2] = true;
    
    const block2 = getNextGeneration(block1);
    const blockStatic = JSON.stringify(block1) === JSON.stringify(block2);
    results.push(`Block (still life) test: ${blockStatic ? 'PASS' : 'FAIL'}`);
    
    // Test 3: Empty grid stays empty
    const empty1 = createEmptyGrid(3);
    const empty2 = getNextGeneration(empty1);
    const emptyStaysEmpty = JSON.stringify(empty1) === JSON.stringify(empty2);
    results.push(`Empty grid test: ${emptyStaysEmpty ? 'PASS' : 'FAIL'}`);
    
    // Test 4: Single cell dies (underpopulation)
    const single1 = createEmptyGrid(3);
    single1[1][1] = true;
    
    const single2 = getNextGeneration(single1);
    const singleDies = single2.every(row => row.every(cell => !cell));
    results.push(`Single cell dies test: ${singleDies ? 'PASS' : 'FAIL'}`);
    
    // Test 5: Birth from three neighbors
    const birth1 = createEmptyGrid(3);
    birth1[0][1] = true; // ●
    birth1[1][0] = true; // ●○
    birth1[1][2] = true; // ●
    
    const birth2 = getNextGeneration(birth1);
    const birthHappens = birth2[1][1]; // Center should be born
    results.push(`Birth test: ${birthHappens ? 'PASS' : 'FAIL'}`);
    
    setTestResults(results);
  };

  return (
    <div className="fixed top-4 left-4 z-50 bg-yellow-100 border-2 border-yellow-500 p-4 rounded-lg shadow-lg max-w-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold">Game of Life Tests</h3>
      </div>
      
      <button
        onClick={runTests}
        className="bg-green-500 text-white px-3 py-2 rounded mb-3 w-full"
      >
        Run Tests
      </button>
      
      <div className="space-y-1 text-xs">
        {testResults.map((result, i) => (
          <div 
            key={i}
            className={`p-1 rounded ${
              result.includes('PASS') ? 'bg-green-100' : 
              result.includes('FAIL') ? 'bg-red-100' : ''
            }`}
          >
            {result}
          </div>
        ))}
      </div>
    </div>
  );
}