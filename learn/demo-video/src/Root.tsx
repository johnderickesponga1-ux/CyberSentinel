import {Composition} from 'remotion';
import {Demo, TOTAL} from './Video';

// 55 s at 30 fps = 1650 frames (under the 1-minute limit)
export const Root = () => (
  <Composition id="Demo" component={Demo} durationInFrames={TOTAL} fps={30} width={1920} height={1080} />
);
