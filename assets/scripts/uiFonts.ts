import { Font, Label, Node, resources } from 'cc';

const PATH_REGULAR = 'fonts/PixelOperator8';
const PATH_BOLD = 'fonts/PixelOperator8-Bold';

/** `fontSize` ≥ 此值时用 Bold（标题、大号按钮） */
export const UI_FONT_BOLD_FROM_SIZE = 27;

let _fontRegular: Font | null = null;
let _fontBold: Font | null = null;

export function preloadUiFonts(done: (err: Error | null) => void): void {
  if (_fontRegular && _fontBold) {
    done(null);
    return;
  }
  let remaining = 2;
  let firstErr: Error | null = null;
  const step = () => {
    remaining -= 1;
    if (remaining <= 0) {
      done(firstErr);
    }
  };
  resources.load(PATH_REGULAR, Font, (err, f) => {
    if (err) {
      console.warn('[uiFonts] load failed', PATH_REGULAR, err);
      firstErr = firstErr ?? err;
    } else if (f) {
      _fontRegular = f;
    }
    step();
  });
  resources.load(PATH_BOLD, Font, (err, f) => {
    if (err) {
      console.warn('[uiFonts] load failed', PATH_BOLD, err);
      firstErr = firstErr ?? err;
    } else if (f) {
      _fontBold = f;
    }
    step();
  });
}

export function applyUiFont(lab: Label, useBold: boolean): void {
  const f = useBold ? _fontBold : _fontRegular;
  if (f) {
    lab.font = f;
  }
}

/** 递归子树：按字号选用 Regular / Bold */
export function applyUiFontsUnder(root: Node): void {
  const lab = root.getComponent(Label);
  if (lab) {
    applyUiFont(lab, lab.fontSize >= UI_FONT_BOLD_FROM_SIZE);
  }
  for (const c of root.children) {
    applyUiFontsUnder(c);
  }
}
