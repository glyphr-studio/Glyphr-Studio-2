
  // --------------------------------------------------------------
  // REFACTOR - from PathPoint
  // --------------------------------------------------------------

  /**
   * Draws this point on the edit canvas
   * @param {object} ctx - canvas context
   * @param {boolean} isSelected - draw this as selected
   * @param {string} accent - accent color
   * @param {number} pointSize - how big to draw the point
   */
  drawPoint(ctx, isSelected, accent = '#000', pointSize = 7) {
    // log('PathPoint.drawPoint', 'start');
    // log('sel = ' + isSelected);

    const halfPointSize = pointSize / 2;
    // ctx.fillStyle = sel? 'white' : accent;
    ctx.fillStyle = isSelected ? 'white' : accent;
    ctx.strokeStyle = accent;
    ctx.font = '10px Consolas';

    ctx.fillRect(
      sXcX(this.p.x) - halfPointSize,
      sYcY(this.p.y) - halfPointSize,
      pointSize,
      pointSize
    );
    ctx.strokeRect(
      sXcX(this.p.x) - halfPointSize,
      sYcY(this.p.y) - halfPointSize,
      pointSize,
      pointSize
    );

    ctx.fillStyle = accent;
    ctx.fillText(this.pointNumber, sXcX(this.p.x + 12), sYcY(this.p.y));
    // log('PathPoint.drawPoint', 'end');
  }

  /**
   * Draws a point with an arrow to show path winding
   * @param {object} ctx - canvas context
   * @param {boolean} isSelected - draw this as selected
   * @param {string} accent - accent color
   * @param {Point} next - next Point in the path sequence
   * @param {number} pointSize - how big to draw the point
   */
  drawDirectionalityPoint(
    ctx,
    isSelected,
    accent = '#000',
    next,
    pointSize = 7
  ) {
    // ctx.fillStyle = sel? 'white' : accent;
    ctx.fillStyle = isSelected ? 'white' : accent;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1;
    const begin = { x: this.p.x, y: this.p.y };
    let end = { x: this.h2.x, y: this.h2.y };

    if (!this.h2.use) {
      end = { x: next.p.x, y: next.p.y };
    }

    const halfPointSize = pointSize / 2;
    const arrow = [
      [halfPointSize * 3, 0],
      [halfPointSize, halfPointSize],
      [-halfPointSize, halfPointSize],
      [-halfPointSize, -halfPointSize],
      [halfPointSize, -halfPointSize],
    ];
    const rotatedArrow = [];
    let ang = Math.atan2(end.y - begin.y, end.x - begin.x) * -1;

    // FAILURE CASE FALLBACK
    if (!ang && ang !== 0) {
      ang = this.p.x > this.h2.x ? Math.PI : 0;
    }

    for (const a of Object.keys(arrow)) {
      rotatedArrow.push([
        arrow[a][0] * Math.cos(ang) - arrow[a][1] * Math.sin(ang),
        arrow[a][0] * Math.sin(ang) + arrow[a][1] * Math.cos(ang),
      ]);
    }

    // log('PathPoint.drawPoint arrow = ' + JSON.stringify(arrow) + '  - rotatedArrow = ' + JSON.stringify(rotatedArrow));

    ctx.beginPath();
    ctx.moveTo(
      rotatedArrow[0][0] + sXcX(this.p.x),
      rotatedArrow[0][1] + sYcY(this.p.y)
    );

    for (const p of Object.keys(rotatedArrow)) {
      if (p > 0) {
        ctx.lineTo(
          rotatedArrow[p][0] + sXcX(this.p.x),
          rotatedArrow[p][1] + sYcY(this.p.y)
        );
      }
    }

    ctx.lineTo(
      rotatedArrow[0][0] + sXcX(this.p.x),
      rotatedArrow[0][1] + sYcY(this.p.y)
    );
    ctx.fill();
    ctx.stroke();

    // Exact Middle Point
    ctx.fillStyle = accent;
    ctx.fillRect(makeCrisp(sXcX(this.p.x)), makeCrisp(sYcY(this.p.y)), 1, 1);
  }

  /**
   * Draws the handles on the edit canvas
   * @param {object} ctx - canvas context
   * @param {boolean} drawH1 - draw the first handle
   * @param {boolean} drawH2 - draw the second handle
   * @param {string} accent - accent color
   * @param {number} pointSize - how big to draw the point
   */
  drawHandles(ctx, drawH1, drawH2, accent = '#000', pointSize = 7) {
    ctx.fillStyle = accent;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1;
    ctx.font = '10px Consolas';

    const halfPointSize = pointSize / 2;

    if (drawH1 && this.h1.use) {
      ctx.beginPath();
      ctx.arc(
        sXcX(this.h1.x),
        sYcY(this.h1.y),
        halfPointSize,
        0,
        Math.PI * 2,
        true
      );
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(sXcX(this.p.x), sYcY(this.p.y));
      ctx.lineTo(sXcX(this.h1.x), sYcY(this.h1.y));
      ctx.closePath();
      ctx.stroke();
      ctx.fillText('1', sXcX(this.h1.x + 12), sYcY(this.h1.y));
    }

    if (drawH2 && this.h2.use) {
      ctx.beginPath();
      ctx.arc(
        sXcX(this.h2.x),
        sYcY(this.h2.y),
        halfPointSize,
        0,
        Math.PI * 2,
        true
      );
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(sXcX(this.p.x), sYcY(this.p.y));
      ctx.lineTo(sXcX(this.h2.x), sYcY(this.h2.y));
      ctx.closePath();
      ctx.stroke();
      ctx.fillText('2', sXcX(this.h2.x + 12), sYcY(this.h2.y));
    }
  }

  /**
   * Draws a Quadratic point to the edit canvas
   * @param {object} ctx - canvas context
   * @param {string} accent - accent color
   * @param {Point} prevP - Previous point in the path sequence
   * @param {number} pointSize - how big to draw the point
   */
  drawQuadraticHandle(ctx, accent = '#000', prevP, pointSize = 7) {
    // Draw Quadratic handle point from imported SVG
    ctx.fillStyle = accent;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1;
    const halfPointSize = pointSize / 2;

    if (this.q) {
      ctx.beginPath();
      ctx.arc(
        sXcX(this.q.x),
        sYcY(this.q.y),
        halfPointSize,
        0,
        Math.PI * 2,
        true
      );
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(sXcX(this.p.x), sYcY(this.p.y));
      ctx.lineTo(sXcX(this.q.x), sYcY(this.q.y));
      ctx.closePath();
      ctx.stroke();

      if (prevP) {
        ctx.beginPath();
        ctx.moveTo(sXcX(prevP.x), sYcY(prevP.y));
        ctx.lineTo(sXcX(this.q.x), sYcY(this.q.y));
        ctx.closePath();
        ctx.stroke();
      }
    }
  }