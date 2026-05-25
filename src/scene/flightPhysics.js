import { MathUtils } from "three";
import { degToRad } from "three/src/math/MathUtils.js";

export const FLIGHT_CONFIG = {
  maxSpeed: 17,
  minSpeed: -4,
  acceleration: 9,
  brakeForce: 11,
  drag: 0.28,
  maxRoll: degToRad(32),
  rollResponse: 0.11,
  rollReturn: 0.07,
  /** Yaw rate scales with bank angle and forward speed */
  turnRate: degToRad(44),
  minTurnSpeed: 0.35,
  maxPitch: degToRad(22),
  pitchResponse: 0.1,
  pitchReturn: 0.08,
  climbRate: 9,
  descendRate: 9,
  velocitySmoothing: 0.14,
  headingSmoothing: 0.1,
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const createFlightState = (heading = 0) => ({
  heading,
  speed: 0,
  roll: 0,
  pitch: 0,
  targetRoll: 0,
  targetPitch: 0,
});

/**
 * Arcade-realistic flight: velocity follows the nose, turns come from banking.
 * No tank strafe — A/D banks and coordinates yaw; S/W change throttle only.
 */
export const stepFlightPhysics = (state, input, delta) => {
  const cfg = FLIGHT_CONFIG;
  const dt = Math.min(delta, 0.05);

  let throttle = 0;
  if (input.forward) throttle += 1;
  if (input.backward) throttle -= 1;

  if (throttle > 0) {
    state.speed += throttle * cfg.acceleration * dt;
  } else if (throttle < 0) {
    const brake = state.speed > 0 ? cfg.brakeForce : cfg.acceleration;
    state.speed += throttle * brake * dt;
  }

  state.speed *= 1 - cfg.drag * dt;
  if (Math.abs(state.speed) < 0.05 && throttle === 0) {
    state.speed = 0;
  }
  state.speed = clamp(state.speed, cfg.minSpeed, cfg.maxSpeed);

  if (input.leftward) state.targetRoll = cfg.maxRoll;
  else if (input.rightward) state.targetRoll = -cfg.maxRoll;
  else state.targetRoll = 0;

  const isReversing = input.backward || state.speed < 0;
  if (isReversing && state.targetRoll !== 0) {
    state.targetRoll *= -1;
  }

  const rollSmooth = state.targetRoll === 0 ? cfg.rollReturn : cfg.rollResponse;
  state.roll = MathUtils.lerp(state.roll, state.targetRoll, rollSmooth);

  const speedRatio = clamp(Math.abs(state.speed) / cfg.maxSpeed, 0, 1);
  if (Math.abs(state.speed) > cfg.minTurnSpeed && Math.abs(state.roll) > 0.01) {
    const turnDirection = Math.sign(state.speed);
    state.heading += state.roll * cfg.turnRate * speedRatio * turnDirection * dt;
  }

  if (input.up) state.targetPitch = -cfg.maxPitch;
  else if (input.down) state.targetPitch = cfg.maxPitch;
  else state.targetPitch = 0;

  const pitchSmooth = state.targetPitch === 0 ? cfg.pitchReturn : cfg.pitchResponse;
  state.pitch = MathUtils.lerp(state.pitch, state.targetPitch, pitchSmooth);

  const forwardX = Math.sin(state.heading);
  const forwardZ = Math.cos(state.heading);
  const horizontalSpeed = state.speed * Math.cos(state.pitch);

  const velocity = {
    x: forwardX * horizontalSpeed,
    y:
      state.speed * Math.sin(-state.pitch) +
      (input.up ? cfg.climbRate : 0) +
      (input.down ? -cfg.descendRate : 0),
    z: forwardZ * horizontalSpeed,
  };

  const attitude = {
    yaw: state.heading,
    pitch: state.pitch,
    roll: state.roll,
  };

  const isMoving =
    Math.abs(state.speed) > 0.1 ||
    input.forward ||
    input.backward ||
    input.leftward ||
    input.rightward ||
    input.up ||
    input.down;

  return { velocity, attitude, speed: Math.abs(state.speed), isMoving };
};
