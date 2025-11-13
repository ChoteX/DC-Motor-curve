
import React, { useState, useMemo } from 'react';
import MotorPerformanceChart from './components/MotorPerformanceChart';
import ControlPanel from './components/ControlPanel';
import { generateMotorData, calculateRequiredVoltage } from './services/motorService';
import { MAX_VOLTAGE } from './constants';
import type { MotorDataPoint } from './types';

const App: React.FC = () => {
  const [voltage, setVoltage] = useState<number>(MAX_VOLTAGE);
  const [targetRpm, setTargetRpm] = useState<string>('');
  const [targetTorque, setTargetTorque] = useState<string>('');
  const [calculationResult, setCalculationResult] = useState<string | number | null>(null);

  const chartData: MotorDataPoint[] = useMemo(() => generateMotorData(voltage), [voltage]);

  const handleVoltageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoltage(parseFloat(e.target.value));
  };

  const handleCalculate = () => {
    const rpm = parseFloat(targetRpm);
    const torque = parseFloat(targetTorque);

    if (isNaN(rpm) || isNaN(torque) || rpm < 0 || torque < 0) {
      setCalculationResult('Please enter valid, positive numbers for RPM and Torque.');
      return;
    }

    const requiredVoltage = calculateRequiredVoltage({ rpm, torque });

    if (requiredVoltage > MAX_VOLTAGE) {
      setCalculationResult(`Exceeds limitations. Required voltage is ${requiredVoltage.toFixed(2)}V, which is over the ${MAX_VOLTAGE}V maximum.`);
    } else {
      setCalculationResult(requiredVoltage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400 tracking-tight">
            DC Motor Performance Visualizer
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Interactive R550-type Motor Simulation
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-2xl shadow-2xl h-[60vh] min-h-[500px]">
            <MotorPerformanceChart data={chartData} />
          </div>

          <div className="lg:col-span-1 bg-gray-800 p-6 rounded-2xl shadow-2xl flex flex-col justify-center">
            <ControlPanel
              voltage={voltage}
              onVoltageChange={handleVoltageChange}
              targetRpm={targetRpm}
              setTargetRpm={setTargetRpm}
              targetTorque={targetTorque}
              setTargetTorque={setTargetTorque}
              onCalculate={handleCalculate}
              calculationResult={calculationResult}
            />
          </div>
        </main>
        
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Motor parameters are based on a generic R550 motor. For educational and simulation purposes only.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
