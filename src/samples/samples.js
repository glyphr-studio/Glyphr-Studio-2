import { modegg } from './modegg.js';
import { californiaGothic } from './california_gothic.js';
import { merriweatherSans } from './merriweather_sans.js';

export default {};

export const projects = {
  modegg: modegg,
  californiaGothic: californiaGothic,
  merriweatherSans: merriweatherSans,
};

export const samples = {
  glyph: {
    shapes: [
      {
        path: {
          pathPoints: [
            { p: { coord: { x: 100, y: 200 } } },
            { p: { coord: { x: 300, y: 600 } } },
            { p: { coord: { x: 400, y: 500 } } },
          ],
        },
      },
      {
        path: {
          pathPoints: [
            { p: { coord: { x: 500, y: 600 } } },
            { p: { coord: { x: 700, y: 950 } } },
            { p: { coord: { x: 800, y: 900 } } },
          ],
        },
      },
      {
        path: {
          pathPoints: [
            { p: { coord: { x: 10, y: 20 } } },
            { p: { coord: { x: 30, y: 60 } } },
            { p: { coord: { x: 40, y: 50 } } },
          ],
        },
      },
    ],
  },
  glyphBox: {
    shapes: [
      {
        path: {
          pathPoints: [
            { p: { coord: { x: 0, y: 0 } } },
            { p: { coord: { x: 100, y: 0 } } },
            { p: { coord: { x: 0, y: 100 } } },
          ],
        },
      },
      {
        path: {
          pathPoints: [
            { p: { coord: { x: 300, y: 0 } } },
            { p: { coord: { x: 400, y: 0 } } },
            { p: { coord: { x: 400, y: 100 } } },
          ],
        },
      },
      {
        path: {
          pathPoints: [
            { p: { coord: { x: 300, y: 700 } } },
            { p: { coord: { x: 400, y: 700 } } },
            { p: { coord: { x: 400, y: 600 } } },
          ],
        },
      },
      {
        path: {
          pathPoints: [
            { p: { coord: { x: 0, y: 700 } } },
            { p: { coord: { x: 100, y: 700 } } },
            { p: { coord: { x: 0, y: 600 } } },
          ],
        },
      },
    ],
  },
  pathPoints: [
    {
      p: { coord: { x: 326.65249430318556, y: 499.9999934240834 } },
      h1: { coord: { x: 239.84504649235828, y: 499.9999934240834 } },
      h2: { coord: { x: 413.45994211401285, y: 499.9999934240834 } },
      type: 'symmetric',
    },
    {
      p: { coord: { x: 483.99995919594085, y: 343.4570087834163 } },
      h1: { coord: { x: 483.99995919594085, y: 428.9899571029709 } },
      h2: { coord: { x: 483.99995919594085, y: 257.92406046386174 } },
      type: 'symmetric',
    },
    {
      p: { coord: { x: 326.65249430318556, y: 185.99997172355825 } },
      h1: { coord: { x: 414.1548862447006, y: 185.99997172355825 } },
      h2: { coord: { x: 239.15010236167052, y: 185.99997172355825 } },
      type: 'symmetric',
    },
    {
      p: { coord: { x: 169.99997354111795, y: 343.4570087834163 } },
      h1: { coord: { x: 169.99997354111795, y: 257.0100080446707 } },
      h2: { coord: { x: 169.99997354111795, y: 429.9040095221619 } },
      type: 'symmetric',
    },
  ],
};
