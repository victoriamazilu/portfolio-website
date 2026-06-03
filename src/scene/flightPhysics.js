import { MathUtils } from "three";
import { degToRad } from "three/src/math/MathUtils.js";

export const FLIGHT_CONFIG = {
  maxSpeed: 13,
  minSpeed: -6,
  acceleration: 7,
  brakeForce: 14,
  reverseAcceleration: 13,
  drag: 0.28,
  /** Bank starts shallow and deepens the longer you hold A/D */
  baseRoll: degToRad(15),
  maxRoll: degToRad(58),
  rollResponse: 0.13,
  rollReturn: 0.07,
  /** Turn authority charges up while holding, decays when released */
  turnChargeRate: 0.55,
  turnChargeDecay: 2.2,
  /** Yaw rate scales with bank angle and forward speed */
  turnRate: degToRad(58),
  minTurnSpeed: 0.35,
  /** Creep forward when turning from a standstill with A/D */
  taxiSpeed: 5,
  taxiAcceleration: 14,
  /** Pitch starts shallow and deepens the longer you hold W/S — mirrors banking */
  basePitch: degToRad(8),
  maxPitch: degToRad(40),
  pitchResponse: 0.13,
  pitchReturn: 0.07,
  /** Climb authority charges up while holding, decays when released */
  pitchChargeRate: 0.55,
  pitchChargeDecay: 2.2,
  climbRate: 6,
  descendRate: 6,
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
  turnCharge: 0,
  pitchCharge: 0,
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
    const brake = state.speed > 0 ? cfg.brakeForce : cfg.reverseAcceleration;
    state.speed += throttle * brake * dt;
  }

  const isTurning = input.leftward || input.rightward;

  state.speed *= 1 - cfg.drag * dt;
  if (Math.abs(state.speed) < 0.05 && throttle === 0 && !isTurning) {
    state.speed = 0;
  }
  state.speed = clamp(state.speed, cfg.minSpeed, cfg.maxSpeed);

  // Hold A/D to charge the turn — bank deepens over time for tighter circles
  if (isTurning) {
    state.turnCharge = clamp(state.turnCharge + cfg.turnChargeRate * dt, 0, 1);
  } else {
    state.turnCharge = clamp(state.turnCharge - cfg.turnChargeDecay * dt, 0, 1);
  }

  const chargedRoll =
    cfg.baseRoll + (cfg.maxRoll - cfg.baseRoll) * state.turnCharge;

  if (input.leftward) state.targetRoll = chargedRoll;
  else if (input.rightward) state.targetRoll = -chargedRoll;
  else state.targetRoll = 0;

  const rollSmooth = state.targetRoll === 0 ? cfg.rollReturn : cfg.rollResponse;
  state.roll = MathUtils.lerp(state.roll, state.targetRoll, rollSmooth);

  // From standstill, A/D creeps forward while banking (no W needed)
  if (isTurning && !input.backward && throttle >= 0 && state.speed < cfg.taxiSpeed) {
    state.speed = Math.min(
      cfg.taxiSpeed,
      state.speed + cfg.taxiAcceleration * dt
    );
  }

  const speedRatio = clamp(Math.abs(state.speed) / cfg.maxSpeed, 0, 1);
  const turnSpeedRatio = Math.max(speedRatio, isTurning && !input.backward ? 0.25 : 0);

  if (Math.abs(state.roll) > 0.01) {
    const canTurn =
      Math.abs(state.speed) > cfg.minTurnSpeed ||
      (isTurning && !input.backward && state.speed > 0);

    if (canTurn) {
      const turnDirection = state.speed < 0 ? -1 : 1;
      state.heading += state.roll * cfg.turnRate * turnSpeedRatio * turnDirection * dt;
    }
  }

  // Hold W/S to charge the climb — pitch deepens over time, like banking
  const isPitching = input.up || input.down;
  if (isPitching) {
    state.pitchCharge = clamp(state.pitchCharge + cfg.pitchChargeRate * dt, 0, 1);
  } else {
    state.pitchCharge = clamp(state.pitchCharge - cfg.pitchChargeDecay * dt, 0, 1);
  }

  const chargedPitch =
    cfg.basePitch + (cfg.maxPitch - cfg.basePitch) * state.pitchCharge;

  if (input.up) state.targetPitch = -chargedPitch;
  else if (input.down) state.targetPitch = chargedPitch;
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
      (input.up ? cfg.climbRate * state.pitchCharge : 0) +
      (input.down ? -cfg.descendRate * state.pitchCharge : 0),
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
