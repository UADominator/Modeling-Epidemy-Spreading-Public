import React, { useEffect, useRef, useState } from 'react';
import { createNoise2D } from 'simplex-noise';


type Props = {
  pathData: string;
  proportions: [number, number, number];
  width?: number;
  height?: number;
};

const ColoredNoiseMask: React.FC<Props> = ({ pathData, proportions, width = 500, height = 500 }) => {
  const [noiseDataUrl, setNoiseDataUrl] = useState<string | null>(null);
  

  useEffect(() => {
    const noise2D = createNoise2D();
    const [blue, red, green] = proportions;
    
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = width;
    noiseCanvas.height = height;
    const noiseCtx = noiseCanvas.getContext('2d')!;
    const imageData = noiseCtx.createImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const scale = 10;

        var n = 4 * (noise2D(0.25 * x / scale, 0.25 * y / scale) + 1) / 2;
        n += (noise2D(2 * x / scale, 2 * y / scale) + 1) / 2;
        n += 0.5 * (noise2D(2 * x / scale, 2 * y / scale) + 1) / 2;
        n += 0.25 * (noise2D(4 * x / scale, 4 * y / scale) + 1) / 2;
        n /= 5.75;
        let color: [number, number, number] = [0, 0, 0];


        if (n < blue) color = [0, 0, 255];
        else if (n < blue + green) color = [0, 255, 0];
        else if (n < blue + green + red) color = [255, 0, 0];
        else  color = [128, 128, 128];

        data[i] = color[0];     // R
        data[i + 1] = color[1]; // G
        data[i + 2] = color[2]; // B
        data[i + 3] = 255;      // A
      }
    }
    noiseCtx.putImageData(imageData, 0, 0);

    const url = noiseCanvas.toDataURL();
    setNoiseDataUrl(url);

  }, [pathData, proportions, width, height]);

  if (!noiseDataUrl) return null;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '500px' }}>
      <defs>
        <mask id="shapeMask">
          <path d={pathData} fill="white" />
        </mask>
      </defs>

      {/* Шумова картинка з маскою */}
      <image href={noiseDataUrl} width={width} height={height} mask="url(#shapeMask)" />

      {/* Контур форми */}
      <path d={pathData} stroke="black" fill="none" />
    </svg>
  );
};

export default ColoredNoiseMask;
