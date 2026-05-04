export function Sparkline({ data = [], color = 'var(--accent)', width = 80, height = 28, fill = true }) {
  if (!data || data.length < 2) {
    return <svg width={width} height={height} />;
  }

  const values = data.map((d) => (typeof d === 'object' ? d.value : d));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = 2;

  const points = values.map((v, i) => [
    (i / (values.length - 1)) * width,
    height - pad - ((v - min) / range) * (height - pad * 2),
  ]);

  const line = points.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x},${y}`;
    const [px, py] = points[i - 1];
    const cpx = (px + x) / 2;
    return `${acc} C ${cpx},${py} ${cpx},${y} ${x},${y}`;
  }, '');

  const area = `${line} L ${width},${height} L 0,${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {fill && <path d={area} fill={color} fillOpacity="0.12" />}
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
