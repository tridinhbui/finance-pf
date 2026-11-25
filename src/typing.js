// Small typing-effect helpers shared across the page
export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Type plain text into an element, char by char. Returns a cancel function. */
export function typeText(el, text, { speed = 18, caret = true, onDone } = {}) {
  if (el._cancelType) el._cancelType();
  if (reduceMotion) {
    el.textContent = text;
    onDone?.();
    return () => {};
  }
  let i = 0;
  el.textContent = '';
  if (caret) el.classList.add('is-typing');
  const id = setInterval(() => {
    i += text.length > 120 ? 2 : 1;
    el.textContent = text.slice(0, i);
    if (i >= text.length) {
      clearInterval(id);
      el.classList.remove('is-typing');
      el._cancelType = null;
      onDone?.();
    }
  }, speed);
  el._cancelType = () => {
    clearInterval(id);
    el.classList.remove('is-typing');
    el.textContent = text;
  };
  return el._cancelType;
}

/**
 * Stream HTML word by word (like a chat model response). Tags are inserted whole,
 * so links stay intact while the text around them streams in.
 */
export function streamHTML(el, html, { speed = 28, onTick, onDone } = {}) {
  if (reduceMotion) {
    el.innerHTML = html;
    onTick?.();
    onDone?.();
    return;
  }
  const tokens = html.match(/<[^>]+>|[^<\s]+\s*|\s+/g) || [];
  let i = 0;
  let out = '';
  el.classList.add('streaming');
  const step = () => {
    // reveal 1–3 tokens per tick for a natural cadence
    const n = 1 + Math.floor(Math.random() * 3);
    for (let k = 0; k < n && i < tokens.length; k++) out += tokens[i++];
    el.innerHTML = out;
    onTick?.();
    if (i < tokens.length) setTimeout(step, speed + Math.random() * speed);
    else {
      el.classList.remove('streaming');
      onDone?.();
    }
  };
  step();
}

/** Type, pause, delete, next — loops through phrases forever. */
export function rotate(el, phrases, { typeSpeed = 55, deleteSpeed = 28, hold = 1700 } = {}) {
  if (reduceMotion) {
    el.textContent = phrases[0];
    return;
  }
  let p = 0;
  let i = 0;
  let deleting = false;
  const tick = () => {
    const word = phrases[p];
    i += deleting ? -1 : 1;
    el.textContent = word.slice(0, i);
    let delay = deleting ? deleteSpeed : typeSpeed + Math.random() * 40;
    if (!deleting && i === word.length) {
      deleting = true;
      delay = hold;
    } else if (deleting && i === 0) {
      deleting = false;
      p = (p + 1) % phrases.length;
      delay = 300;
    }
    setTimeout(tick, delay);
  };
  tick();
}
