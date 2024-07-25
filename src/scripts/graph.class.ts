import { gsap } from "gsap";


let run = true;
export class LuckyJet {
  public canvas: HTMLDivElement | undefined;
  public pilot: Element | undefined;
  public svgStroke: Element | undefined;
  public svgGrad: Element | undefined;
  public options: { [key: string]: number };

  public animating: boolean | undefined;

  public curve: number = 1;
  public pilotSize: number = 1;
  public canvasWidth: number = 1;
  public canvasHeight: number = 1;
  public glideOffsetX: number = 1;
  public glideOffsetY: number = 1;
  public canvasDiagonal: number = 1;

  public glideCoords: {
    pilotX: number;
    pilotY: number;
    svgX: number;
    svgY: number;
  } = {
      pilotX: 1,
      pilotY: 1,
      svgX: 1,
      svgY: 1
    };

  private timeline: gsap.core.Timeline | undefined;
  private flyOutTween: gsap.core.Tween | undefined;

  private static _instance: LuckyJet;
  private constructor() {
    this.options = {
      glidePointX: 80,
      glidePointY: 30,
      svgOffsetX: 30,
      svgOffsetY: 60,
      glideOffsetX: 7,
      glideOffsetY: 5,
      svgCurve: 66,
      stage1Duration: 2,
      stage2Duration: 1,
      stage3Duration: .4
    };
    // addEventListener("resize", this._onResize.bind(this));
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public loaded(canvas: HTMLDivElement) {
    // .querySelector('.lucky-jet');
    this.canvas = canvas!;
    this.pilot = this.canvas.querySelector('.lucky-jet__pilot')!;
    this.svgStroke = this.canvas.querySelector('.lucky-jet__svg-stroke')!;
    this.svgGrad = this.canvas.querySelector('.lucky-jet__svg-grad')!;

    this._updateSizes();
    this._createAnimation();

    return this;
  }

  public setOptions(options: { [key: string]: number } = {}) {
    this.options = { ...this.options, ...options };

    return this;
  }

  start() {
    if (!this.canvas || !this.timeline) return;
    this.canvas.classList.add('_animating');
    this.flyOutTween && this.flyOutTween.kill();
    this.timeline.invalidate().restart();
    this.animating = true;
  }

  end() {
    if (!this.timeline) return;
    this.timeline.pause();
    this._flyOut();
    this.animating = false;
  }

  _createAnimation() {
    if (!this.pilot) return;
    if (!this.svgGrad) return;
    if (!this.svgStroke) return;
    try {
      this.timeline = gsap.timeline({ paused: true });
      // stage 1
      this.timeline.fromTo(this.pilot, {
        x: -this._getPercentRatio(this.options.svgOffsetX, this.pilotSize),
        y: this.canvasHeight - this._getPercentRatio(this.options.svgOffsetY, this.pilotSize),
      }, {
        duration: this.options.stage1Duration,
        x: this.glideCoords.pilotX,
        y: this.glideCoords.pilotY
      });

      // @ts-ignore
      this.timeline.fromTo(this.svgGrad, {
        attr: {
          d: this._animateSvg('gradient', 1, 1, this.canvasHeight),
        }
      }, {
        duration: this.options.stage1Duration,
        attr: {
          d: this._animateSvg('gradient', this.curve, this.glideCoords.svgX, this.glideCoords.svgY)
        }
      }, '<');
      
      // @ts-ignore
      this.timeline.fromTo(this.svgStroke, {
        attr: {
          d: this._animateSvg('stroke', 1, 1, this.canvasHeight)
        }
      }, {
        duration: this.options.stage1Duration,
        attr: {
          d: this._animateSvg('stroke', this.curve, this.glideCoords.svgX, this.glideCoords.svgY)
        }
      }, '<');

      // stage 2
      let randomCoords = this._getRandomCoords()

      this.timeline.to(this.pilot, {
        repeat: -1,
        duration: this.options.stage2Duration,
        ease: 'none',
        x: () => randomCoords.x,
        y: () => randomCoords.y,
        repeatRefresh: true
      });
      this.timeline.to(this.svgGrad, {
        repeat: -1,
        duration: this.options.stage2Duration,
        ease: 'none',
        repeatRefresh: true,
        attr: {
          d: () => String(this._animateSvg('gradient', this.curve, randomCoords.svgX, randomCoords.svgY))
        }
      }, '<');
      this.timeline.to(this.svgStroke, {
        repeat: -1,
        duration: this.options.stage2Duration,
        ease: 'none',
        repeatRefresh: true,
        attr: {
          d: () => String(this._animateSvg('stroke', this.curve, randomCoords.svgX, randomCoords.svgY))
        },
        onStart: () => {
          randomCoords = this._getRandomCoords()
        },
        onRepeat: () => {
          randomCoords = this._getRandomCoords()
        }
      }, '<');
    } catch (error) {
      console.log(error);
    }
  }


  _flyOut() {
    if (!this.canvas || !this.pilot) return;
    this.flyOutTween && this.flyOutTween.kill();

    const x = gsap.getProperty(this.pilot, "x");
    const y = gsap.getProperty(this.pilot, "y");
    const distanceLeftX = this.canvasWidth - Number(x);
    const distanceLeftY = y;
    const distanceLeft = Math.sqrt(Math.pow(distanceLeftX, 2) + Math.pow(Number(distanceLeftY), 2));
    const distanceLeftPercent = distanceLeft * 100 / this.canvasDiagonal;
    const duration = this._getPercentRatio(distanceLeftPercent, this.options.stage3Duration);

    this.flyOutTween = gsap.to(this.pilot, {
      duration: duration,
      ease: 'none',
      x: this.canvasWidth,
      y: 0,
      repeatRefresh: true,
      onComplete: () => {
        if (this.canvas) this.canvas.classList.remove('_animating');
      }
    })
  }

  _getRandomCoords() {
    const pilotGlideX = this.glideCoords.pilotX + this._rand(this.glideOffsetX)
    const pilotGlideY = this.glideCoords.pilotY + this._rand(this.glideOffsetY)

    return {
      x: pilotGlideX,
      y: pilotGlideY,
      svgX: pilotGlideX + this._getPercentRatio(this.options.svgOffsetX, this.pilotSize),
      svgY: pilotGlideY + this._getPercentRatio(this.options.svgOffsetY, this.pilotSize)
    }
  }

  _animateSvg(type: string, curve: number, x: number, y: number) {

    switch (type) {
      case 'stroke':
        return `M 0 ${this.canvasHeight} Q ${curve} ${this.canvasHeight} ${x} ${y}`;

      case 'gradient':
        return `M 0 ${this.canvasHeight} Q ${curve} ${this.canvasHeight} ${x} ${y} L ${x} ${this.canvasHeight} Z`
    }
  }

  _updateSizes() {
    if (!this.canvas || !this.pilot) return;
    this.canvasWidth = this.canvas.clientWidth;
    this.canvasHeight = this.canvas.clientHeight;
    this.canvasDiagonal = Math.sqrt(Math.pow(this.canvasWidth, 2) + Math.pow(this.canvasHeight, 2));
    this.pilotSize = this.pilot.clientWidth;
    this.glideOffsetX = this._getPercentRatio(this.options.glideOffsetX, this.canvasWidth);
    this.glideOffsetY = this._getPercentRatio(this.options.glideOffsetY, this.canvasHeight);

    const pilotGlidePointX = this._getPercentRatio(this.options.glidePointX, this.canvasWidth) - (this.pilotSize / 2);
    const pilotGlidePointY = this._getPercentRatio(this.options.glidePointY, this.canvasHeight) - (this.pilotSize / 2);

    const svgGlidePointX = pilotGlidePointX + this._getPercentRatio(this.options.svgOffsetX, this.pilotSize);
    const svgGlidePointY = pilotGlidePointY + this._getPercentRatio(this.options.svgOffsetY, this.pilotSize);

    this.curve = this._getPercentRatio(this.options.svgCurve, svgGlidePointX);

    this.glideCoords = {
      pilotX: pilotGlidePointX,
      pilotY: pilotGlidePointY,
      svgX: svgGlidePointX,
      svgY: svgGlidePointY
    }
  }

  _onResize() {
    if (!this.timeline) return;
    const progress = this.timeline.progress()

    this.timeline.kill();
    this._updateSizes();
    this._createAnimation();
    this.timeline.progress(progress);

    if (this.animating) this.timeline.play();
  }

  _rand(num: number) {
    return Math.random() * (num + num) - num;
  }

  _getPercentRatio(percent: number, base: number) {
    return percent * base / 100
  }
}