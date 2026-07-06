import { definePreset } from "@primeng/themes";
import Aura from '@primeng/themes/aura';
export const GryffindorPreset = definePreset(Aura, {
  semantic: {
    primary: {
      300: '#3d0000',  // main primary
	  500: '#3d0000', 
      400: '#cc0001',  // lighter
      600: '#8a0001',  // darker
    },
    colorScheme: {
      light: {
        primary: {
          color: '#3d0000',
          contrastColor: '#d3a625'  // secondary
        }
      },
      dark: {
        primary: {
          color: '#510101',
          contrastColor: '#d3a625'
        }
      }
    }
  }
});

export const SlytherinPreset = definePreset(Aura, {
  semantic: {
    primary: {
	  300: '#1a472a',
      500: '#1a472a',
      400: '#2a6a3e',
      600: '#0d2b1a',
    },
    colorScheme: {
      light: { primary: { color: '#1a472a', contrastColor: '#aaaaaa' } },
      dark:  { primary: { color: '#1a472a', contrastColor: '#aaaaaa' } }
    }
  }
});

export const RavenclawPreset = definePreset(Aura, {
  semantic: {
    primary: {
	  300: '#0e1a40',
      500: '#0e1a40',
      400: '#1a2a60',
      600: '#060c1f',
    },
    colorScheme: {
      light: { primary: { color: '#0e1a40', contrastColor: '#946b2d' } },
      dark:  { primary: { color: '#0e1a40', contrastColor: '#946b2d' } }
    }
  }
});

export const HufflepuffPreset = definePreset(Aura, {
  semantic: {
    primary: {
	  300: '#ecb939',
      500: '#ecb939',
      400: '#f0c84a',
      600: '#c99a20',
    },
    colorScheme: {
      light: { primary: { color: '#ecb939', contrastColor: '#372e29' } },
      dark:  { primary: { color: '#ecb939', contrastColor: '#372e29' } }
    }
  }
});