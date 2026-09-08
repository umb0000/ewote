export type LetterMotion = {
  delay: number;
  spawnX: number;
  startRotate: number;
  restRotate: number;
};

export const letterMotion: LetterMotion[];
export const physicsOptions: {
  restitution: number;
  friction: number;
  frictionStatic: number;
  frictionAir: number;
  density: number;
  pileWidthRatio: number;
  glyphBaselineTrim: number;
};
