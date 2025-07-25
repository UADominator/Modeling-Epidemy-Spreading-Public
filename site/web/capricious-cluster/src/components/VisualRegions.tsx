import React, { useEffect, useState } from 'react';
import { GeoJSON } from 'ol/format';
import { Geometry, Polygon } from 'ol/geom';
import ColoredNoiseMask from './ColoredNoiseMask';

type Props = {
    infection: any;
    geojsonUrl: string;
    style?: React.CSSProperties;
};

const VisulRegions: React.FC<Props> = ({ infection, geojsonUrl, style }) => {
  const [pathData, setPathData] = useState<string | null>(null);
  const [timeFlex, setFlexTime] = useState(0);
  const [time, setTime] = useState<number[]>([]);
  const [susceptible, setSusceptible] = useState<number[]>([]);
  const [infected, setInfected] = useState<number[]>([]);
  const [resistant, setResistant] = useState<number[]>([]);

  useEffect(() => {
    fetch(geojsonUrl)
      .then((res) => res.json())
      .then((data) => {
        const geojsonFormat = new GeoJSON();
        const features = geojsonFormat.readFeatures(data, {
          featureProjection: 'EPSG:4326',
        });
        const polygon = features[0].getGeometry() as Polygon;
        const coordinates = polygon.getCoordinates()[0];
        const xs = coordinates.map(([x]) => x);
        const ys = coordinates.map(([, y]) => y);

        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        const width = maxX - minX;
        const height = maxY - minY;
        const scale = 500 / Math.max(width, height);

        const offsetX = (500 - width * scale) / 2;
        const offsetY = (500 - height * scale) / 2;

        const scaled = coordinates.map(([x, y]) => [
          (x - minX) * scale + offsetX,
          500 - ((y - minY) * scale + offsetY),
        ]);

        const d =
          scaled.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ') + ' Z';

        setPathData(d);
      });
  }, [geojsonUrl]);

  useEffect(() => {
    const fetchData = async () => {
      var st, it, rt;
      if (!infection) {
        st = await (await fetch('http://domi.pp.ua:65000/api/default/epidemic/st')).json();
        it = await (await fetch('http://domi.pp.ua:65000/api/default/epidemic/it')).json();
        rt = await (await fetch('http://domi.pp.ua:65000/api/default/epidemic/rt')).json();
      } else {
        st = await (await fetch('http://domi.pp.ua:65000/api/epidemic/st', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(infection)
        })).json();
        it = await (await fetch('http://domi.pp.ua:65000/api/epidemic/it', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(infection)
        })).json();
        rt = await (await fetch('http://domi.pp.ua:65000/api/epidemic/rt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(infection)
        })).json();
      }

      setTime(st.map((point: { first: number, second: number }) => point.first));

      setSusceptible(st.map((point: { first: number, second: number }) => point.second));
      setInfected(it.map((point: { first: number, second: number }) => point.second));
      setResistant(rt.map((point: { first: number, second: number }) => point.second));
    };

    fetchData();
  }, [infection]);

  const [coefs, setCoefs] = useState<[number, number, number]>([0.3, 0.6, 0.1]); ;
   useEffect(() => {
    const max = susceptible[timeFlex] + resistant[timeFlex] +  infected[timeFlex];
    setCoefs([susceptible[timeFlex] / max, infected[timeFlex] / max, resistant[timeFlex] / max]);
  }, [timeFlex])

  return (
    <div>
      {pathData ? (
        <>
            <ColoredNoiseMask pathData={pathData} proportions={coefs} />

            {/* Повзунок часу */}
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <input
                type="range"
                min={time[0]}
                max={time[time.length - 1]}
                value={timeFlex}
                onChange={(e) => setFlexTime(Number(e.target.value))}
                style={{ width: '60%', maxWidth: 500}}
                />
                <div style={{ textAlign: 'center' }}>Час: {timeFlex}</div>
            </div>
        </>
      ) : (
        <p>Завантаження…</p>
      )}
    </div>
  );
};

export default VisulRegions;

