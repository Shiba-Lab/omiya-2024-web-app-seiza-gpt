import dynamic from "next/dynamic";
import p5Types from "p5";
import { useRef } from "react";

type Star = {
  x: number;
  y: number;
  size: number;
  brightness: number;
  color: {
    r: number;
    g: number;
    b: number;
  };
  twinkState: number; // 0だったら通常、1以上だったら明るくてdecrementする
};

const Sketch = dynamic(import("react-p5"), {
  loading: () => <></>,
  ssr: false,
});

export const P5Canvas = () => {
  const starsRef = useRef<Star[]>([]);

  const preload = (p5: p5Types) => {};

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    p5.noStroke();
    if (starsRef.current.length === 0) {
      // starsが空の場合のみ星を生成
      for (let i = 0; i < 150; i++) {
        const x = p5.random(p5.width);
        const y = p5.random(p5.height);
        const size = p5.random(1, 4);
        const brightness = p5.random(100, 255);

        const color = {
          r: 255,
          g: 255,
          b: 255,
        };

        if (p5.random(0, 1) > 0.8) {
          color.r = p5.random(128, 255);
          color.g = p5.random(128, 255);
          color.b = 255;
        }

        starsRef.current.push({ x, y, size, brightness, color, twinkState: 0 });
      }
    }
  };

  const draw = (p5: p5Types) => {
    p5.background(10, 10, 30); // 暗い青色の背景

    // 星を描画
    for (const star of starsRef.current) {
      if (p5.random(0, 1) > 0.999) {
        star.twinkState = 4;
      }
      if (star.twinkState > 0) {
        star.twinkState--;
      }
      p5.fill(
        star.color.r,
        star.color.g,
        star.color.b,
        star.twinkState > 0
          ? Math.max(star.brightness * 1.5, 255)
          : star.brightness
      );
      p5.ellipse(star.x, star.y, star.size, star.size);
    }
  };

  const windowResized = (p5: p5Types) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  return (
    <Sketch
      preload={preload as any}
      setup={setup as any}
      draw={draw as any}
      windowResized={windowResized as any}
    />
  );
};
