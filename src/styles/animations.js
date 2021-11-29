import { keyframes } from '@emotion/css';

export const show = keyframes`
  0% {
    opacity: 0;
    transform: scale3d(0.8, 0.8, 0.8);
  }

  50% {
    transform: scale3d(1.05, 1.05, 1.05);
  }

  100% {
    transform: scale3d(1, 1, 1);
  }
`;

export const hide = keyframes`
  0% {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }

  100% {
    opacity: 0;
    transform: scale3d(0.8, 0.8, 0.8);
  }
`;

export const grow = keyframes`
  0% {
    opacity: 0;
    transform: scale3d(0.8, 0.8, 0.8); 
  }

  100% { 
    opacity: 1;
    transform: scale3d(1, 1, 1); 
  }
`;

export const shrink = keyframes`
  0% { 
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }

  100% { 
    opacity: 0;
    transform: scale3d(0.8, 0.8, 0.8); 
  }
`;

export const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

export const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;
