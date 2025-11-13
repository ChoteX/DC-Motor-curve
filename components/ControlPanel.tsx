import React from 'react';
import { MAX_VOLTAGE } from '../constants';

interface ControlPanelProps {
  voltage: number;
  onVoltageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  targetRpm: string;
  setTargetRpm: (value: string) => void;
  targetTorque: string;
  setTargetTorque: (value: string) => void;
  onCalculate: () => void;
  calculationResult: string | number | null;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  voltage,
  onVoltageChange,
  targetRpm,
  setTargetRpm,
  targetTorque,
  setTargetTorque,
  onCalculate,
  calculationResult,
}) => {
  return (
    <div className="space-y-8 h-full flex flex-col justify-around">
      {/* Voltage Slider Section */}
      <div className="space-y-4">
        <label htmlFor="voltage-slider" className="block text-xl font-semibold text-cyan-400">
          Set Voltage
        </label>
        <div className="flex items-center space-x-4">
          <input
            id="voltage-slider"
            type="range"
            min="0"
            max={MAX_VOLTAGE}
            step="0.1"
            value={voltage}
            onChange={onVoltageChange}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-cyan-500"
          />
          <span className="text-lg font-mono bg-gray-700 px-3 py-1 rounded-md w-24 text-center">
            {voltage.toFixed(1)} V
          </span>
        </div>
      </div>

      <div className="border-t border-gray-600"></div>

      {/* Calculator Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-cyan-400">Voltage Calculator</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="rpm-input" className="block text-sm font-medium text-gray-400 mb-1">Target RPM</label>
            <input
              id="rpm-input"
              type="number"
              value={targetRpm}
              onChange={(e) => setTargetRpm(e.target.value)}
              placeholder="e.g., 5500"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div>
            <label htmlFor="torque-input" className="block text-sm font-medium text-gray-400 mb-1">Applied Torque (Nm)</label>
            <input
              id="torque-input"
              type="number"
              value={targetTorque}
              onChange={(e) => setTargetTorque(e.target.value)}
              placeholder="e.g., 0.5"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <button
            onClick={onCalculate}
            className="w-full py-3 text-lg font-bold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-colors duration-200"
          >
            Calculate Voltage
          </button>
        </div>
        
        <div className="mt-4 p-3 rounded-md bg-gray-900 border border-gray-700">
            <h4 className="font-semibold text-gray-400 mb-2 text-md">Calculation Formula</h4>
            <p className="font-mono text-cyan-300 text-center text-2xl">
                V = (I &times; R) + V<sub>emf</sub>
            </p>
            <div className="text-gray-400 mt-2 space-y-1 text-base">
                <p><strong>V</strong>: Required Voltage</p>
                <p><strong>I</strong>: Current = (Torque / K<sub>t</sub>) + I<sub>nl</sub></p>
                <p><strong>R</strong>: Motor Resistance (Constant)</p>
                <p><strong>V<sub>emf</sub></strong>: Back-EMF = K<sub>e</sub> &times; &omega;</p>
                <p><strong>&omega;</strong>: Speed (rad/s) = RPM &times; 2&pi; / 60</p>
            </div>
        </div>

        {calculationResult !== null && (
          <div className="mt-4 p-4 rounded-md bg-gray-700">
            <h4 className="font-semibold text-gray-300">Result:</h4>
            {typeof calculationResult === 'number' ? (
              <p className="text-2xl font-bold text-green-400 mt-1">{calculationResult.toFixed(2)} V required</p>
            ) : (
              <p className="text-md text-yellow-400 mt-1">{calculationResult}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;