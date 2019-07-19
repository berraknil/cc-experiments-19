const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [256, 256],
  animate: true,
  duration: 10
};

const sketch = () => {
  const colorCount = random.rangeFloor(1, 6);
  const palette = random.shuffle(random.pick(palettes).slice(0, colorCount));

  const createGrid = () => {
    const points = [];
    const count = 50;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const radius = Math.abs(random.noise2D(u, v)) * 0.08;
        points.push({
          radius,
          rotation: random.noise2D(u, v),
          position: [u, v],
          color: random.pick(palette)
        });
      }
    }
    return points;
  };

  // random.setSeed(512);
  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 20;
  return ({ context, width, height, playhead }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    // Get a seamless 0..1 value for our loop
    const t = Math.sin(playhead * Math.PI);

    points.forEach(data => {
      const { position, radius, color, rotation } = data;
      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, width - margin, v);

      // context.beginPath();
      // context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      // context.fillStyle = color;
      // context.fill();

      context.save();
      context.fillStyle = color;
      context.font = `${radius * width}px "Helvetica"`;
      context.translate(x, y);
      context.rotate(rotation * t * 10);
      context.fillText('-', 0, 0);

      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
