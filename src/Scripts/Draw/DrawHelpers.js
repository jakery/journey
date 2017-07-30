define('DrawHelpers', [], () => function DrawHelpers(ctx) {
  this.ctx = ctx;
  this.drawCenterText = function centerText(text, minX, maxX, y) {
    const width = maxX - minX;
    const middle = minX + Math.floor(width / 2);
    const metrics = this.ctx.measureText(text);
    const textWidth = metrics.width;
    const centeredX = middle - Math.floor(textWidth / 2);
    this.ctx.fillText(text, centeredX, y);
  };

  this.drawWrappedText = function drawWrappedText(text, x, y, maxWidth, lineHeight) {
    let yAdjusted = y;
    let lines = text.split('\\n');
    if (lines.length === 1) {
      lines = text.split('\n');
    }

    for (let i = 0; i < lines.length; i += 1) {
      const words = lines[i].split(' ');
      let line = '';

      for (let n = 0; n < words.length; n += 1) {
        const testLine = `${line + words[n]} `;
        const metrics = this.ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          this.ctx.fillText(line, x, yAdjusted);
          line = `${words[n]} `;
          yAdjusted += lineHeight;
        } else {
          line = testLine;
        }
      }
      this.ctx.fillText(line, x, yAdjusted);
      yAdjusted += lineHeight;
    }
  };

  this.generateGridLines = function generateGridLines(stage) {
    const gridLines = [];
    const halfPixel = 0.5;
    for (let x = 0; x <= stage.width; x += stage.baseUnit) {
      const coord = [x + halfPixel, halfPixel, x + halfPixel, stage.height + halfPixel];
      if (x === stage.width) {
        coord[0] -= 1;
        coord[2] -= 1;
      }
      gridLines.push(coord);
    }
    for (let y = 0; y <= stage.height; y += stage.baseUnit) {
      const coord = [halfPixel, y + halfPixel, stage.width + halfPixel, y + halfPixel];
      if (y === stage.height) coord[3] -= 1;
      gridLines.push(coord);
    }
    return gridLines;
  };
});
