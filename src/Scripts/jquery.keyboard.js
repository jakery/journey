// TODO: Modularize this.

function keyboard() {
  this.Backspace = 8;
  this.Tab = 9;
  this.Enter = 13;
  this.Shift = 16;
  this.Control = 17;
  this.Alt = 18;
  this.CapsLock = 20;
  this.Esc = 27;
  this.SPACE = 32;
  this.PageUp = 33;
  this.PageDown = 34;
  this.End = 35;
  this.Home = 36;
  this.LEFT = 37;
  this.UP = 38;
  this.RIGHT = 39;
  this.DOWN = 40;
  this.Insert = 45;
  this.Delete = 46;
  this.NumLock = 144;
  this.ScrollLock = 145;
  this.Break = 19;
  this.A = 65;
  this.B = 66;
  this.C = 67;
  this.D = 68;
  this.E = 69;
  this.F = 70;
  this.G = 71;
  this.H = 72;
  this.I = 73;
  this.J = 74;
  this.K = 75;
  this.L = 76;
  this.M = 77;
  this.N = 78;
  this.O = 79;
  this.P = 80;
  this.Q = 81;
  this.R = 82;
  this.S = 83;
  this.T = 84;
  this.U = 85;
  this.V = 86;
  this.W = 87;
  this.X = 88;
  this.Y = 89;
  this.Z = 90;
  this.a = 65;
  this.b = 66;
  this.c = 67;
  this.d = 68;
  this.e = 69;
  this.f = 70;
  this.g = 71;
  this.h = 72;
  this.i = 73;
  this.j = 74;
  this.k = 75;
  this.l = 76;
  this.m = 77;
  this.n = 78;
  this.o = 79;
  this.p = 80;
  this.q = 81;
  this.r = 82;
  this.s = 83;
  this.t = 84;
  this.u = 85;
  this.v = 86;
  this.w = 87;
  this.x = 88;
  this.y = 89;
  this.z = 90;
  this.D0 = 48;
  this.D1 = 49;
  this.D2 = 50;
  this.D3 = 51;
  this.D4 = 52;
  this.D5 = 53;
  this.D6 = 54;
  this.D7 = 55;
  this.D8 = 56;
  this.D9 = 57;
  this.Semicolon = 186;
  this.Equals = 187;
  this.Dash = 189;
  this.Slash = 191;
  this.Tilde = 192;
  this.LeftBracket = 219;
  this.Backslash = 220;
  this.RightBracket = 221;
  this.Quote = 222;
  this.Comma = 188;
  this.Period = 190;
  this.Numpad0 = 96;
  this.Numpad1 = 97;
  this.Numpad2 = 98;
  this.Numpad3 = 99;
  this.Numpad4 = 100;
  this.Numpad5 = 101;
  this.Numpad6 = 102;
  this.Numpad7 = 103;
  this.Numpad8 = 104;
  this.Numpad9 = 105;
  this.NumpadMultiply = 106;
  this.NumpadAdd = 107;
  this.NumpadEnter = 13;
  this.NumpadSubtract = 109;
  this.NumpadDecimal = 110;
  this.NumpadDivide = 111;
  this.F1 = 112;
  this.F2 = 113;
  this.F3 = 114;
  this.F4 = 115;
  this.F5 = 116;
  this.F6 = 117;
  this.F7 = 118;
  this.F8 = 119;
  this.F9 = 120;
  this.F10 = 121;
  this.F11 = 122;
  this.F12 = 123;
  this.F13 = 124;
  this.F14 = 125;
  this.F15 = 126;
}

const keys = new keyboard();
const keyIsDown = new keyboard().foreach((a) => { a = false; });
const keyHeldDuration = new keyboard().foreach((a) => { a = 0; });
const keyIsRegistered = new keyboard().foreach((a) => { a = false; });

const alphanumericTX =
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', 'D1', 'D2', 'D3', 'D4',
    'D5', 'D6', 'D7', 'D8', 'D9', 'D0'];

const alphanumeric =
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', '1', '2', '3', '4',
    '5', '6', '7', '8', '9', '0'];

String.prototype.corrupt = function (offset) {
  offset %= alphanumeric.length;

  if (offset === 0) {
    return this;
  }

  const output = [];

  for (let i = 0; i < this.length; i += 1) {
    const char = this[i];
    const charIndex = alphanumeric.indexOf(char);
    if (charIndex === -1) {
      output.push(this[i]);
    } else {
      const change = (charIndex + offset) % alphanumeric.length;
      output.push(alphanumeric[change]);
    }
  }

  return output.join('');
};

const getKeyByCode = function (keyCode) {
  keys.foreach((a) => {
    if (keyCode === keys[a]) {
      return a;
    }
    return null;
  });
};

const registerKey = function (keyCode) {
  const key = getKeyByCode(keyCode);
  keyIsDown[key] = true;
};


// Adapted from Konami Code plugin by Joel Sutherland. http://www.gethifi.com/blog/konami-code-jquery-plugin-pointlessly-easy
const konami = '38,38,40,40,37,39,37,39,66,65';
const keyLog = [];
function konamiCode() {
  return (keyLog.toString() === konami);
}

(function (jQuery) {
  const $j = jQuery;
  $j.fn.keyboard = function (options) {
    const settings = {
      exclusions: [],
      sticky: true,
    };

    $j.extend(settings, options);

    // Exclude keys from listener events.
    if (settings.exclusions.length > 0) {
      for (let i = 0; i < settings.exclusions.length; i += 1) {
        const name = settings.exclusions[i];
        keys[name] = false;
      }
    }

    const selector = $j(this);

    selector.keydown((event) => {
      const code = event.which || event.keyCode;
      keyLog.push(code);
      while (keyLog.length > 10) {
        keyLog.shift();
      }
      const key = getKeyByCode(code);
      if (key) {
        event.preventDefault();
        keyIsDown[key] = true;
      }
    });

    selector.keyup((event) => {
      const code = event.which || event.keyCode;
      const key = getKeyByCode(code);
      if (key) {
        event.preventDefault();
        keyIsDown[key] = false;
        keyIsRegistered[key] = false;
        keyHeldDuration[key] = 0;
      }
    });
  };
}(jQuery));

