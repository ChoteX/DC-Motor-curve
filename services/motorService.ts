
import {
  MAX_VOLTAGE,
  MOTOR_RESISTANCE,
  TORQUE_CONSTANT,
  SPEED_CONSTANT_KE,
  RPM_DATA_POINTS,
  PI,
  NO_LOAD_CURRENT
} from '../constants';
import type { MotorDataPoint } from '../types';

const rpmToRadPerSec = (rpm: number): number => {
  return rpm * (2 * PI) / 60;
};

export const generateMotorData = (voltage: number): MotorDataPoint[] => {
  if (voltage <= 0) {
    const zeroPoint: MotorDataPoint = { rpm: 0, torque: 0, current: 0, power: 0, efficiency: 0 };
    return Array(RPM_DATA_POINTS + 1).fill(zeroPoint);
  }

  const data: MotorDataPoint[] = [];

  // Theoretical max speed (no load) for the given voltage
  // V = I_nl*R + Ke*w -> w = (V - I_nl*R)/Ke
  // No load current scales with voltage too, but we can approximate for simplicity
  const noLoadCurrentAtVoltage = (voltage / MAX_VOLTAGE) * NO_LOAD_CURRENT;
  const maxOmega = (voltage - noLoadCurrentAtVoltage * MOTOR_RESISTANCE) / SPEED_CONSTANT_KE;
  const maxRpm = Math.max(0, maxOmega * 60 / (2 * PI));
  
  const rpmStep = maxRpm / RPM_DATA_POINTS;

  for (let i = 0; i <= RPM_DATA_POINTS; i++) {
    const rpm = i * rpmStep;
    const omega = rpmToRadPerSec(rpm);

    const backEmf = SPEED_CONSTANT_KE * omega;
    const current = Math.max(0, (voltage - backEmf) / MOTOR_RESISTANCE);
    const torque = Math.max(0, TORQUE_CONSTANT * (current - noLoadCurrentAtVoltage));

    const powerOut = torque * omega;
    const powerIn = voltage * current;

    let efficiency = 0;
    if (powerIn > 0) {
      efficiency = (powerOut / powerIn);
    }
    
    // Clamp efficiency between 0 and 1
    efficiency = Math.max(0, Math.min(efficiency, 1));

    data.push({
      rpm: parseFloat(rpm.toFixed(2)),
      torque: parseFloat(torque.toFixed(3)),
      current: parseFloat(current.toFixed(2)),
      power: parseFloat(powerOut.toFixed(2)),
      efficiency: parseFloat(efficiency.toFixed(3)),
    });
  }

  return data;
};

export const calculateRequiredVoltage = ({ rpm, torque }: { rpm: number; torque: number }): number => {
  const omega = rpmToRadPerSec(rpm);
  // Estimate no-load current for this operating point. This is a simplification.
  // We'll calculate required voltage assuming some load, then find what I_nl would be.
  // For a simpler model, we can use the base no-load current.
  const requiredCurrent = torque / TORQUE_CONSTANT + NO_LOAD_CURRENT;
  const backEmf = SPEED_CONSTANT_KE * omega;
  
  const requiredVoltage = requiredCurrent * MOTOR_RESISTANCE + backEmf;
  return requiredVoltage;
};
