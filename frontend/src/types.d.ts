// Global type declarations for the project
import 'react';

// Fix for JSX element has type 'any' errors
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
