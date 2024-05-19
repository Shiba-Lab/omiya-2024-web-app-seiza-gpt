import dynamic from "next/dynamic";
import p5Types from "p5";
import { useRef } from "react";
import { Duplex } from "stream";

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
    const windowSize = Math.sqrt(
      p5.windowHeight * p5.windowHeight + p5.windowWidth * p5.windowWidth
    );

    p5.createCanvas(windowSize, windowSize).parent(canvasParentRef);
    p5.noStroke();

    p5.rectMode(p5.CENTER);

    if (starsRef.current.length === 0) {
      // starsが空の場合のみ星を生成
      for (let i = 0; i < 150 * 8; i++) {
        const x = p5.random(-windowSize, windowSize);
        const y = p5.random(-windowSize, windowSize);
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

    //回転角度
    let angle = p5.millis() / 50000;
    p5.translate(p5.windowWidth / 2, p5.windowHeight / 2);
    p5.rotate(angle);
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
    const windowSize = Math.sqrt(
      p5.windowHeight * p5.windowHeight + p5.windowWidth * p5.windowWidth
    );
    p5.resizeCanvas(windowSize, windowSize);
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
