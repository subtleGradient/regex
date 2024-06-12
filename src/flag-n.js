import {RegexContext, contextToken, getEndContextForIncompletePattern} from './utils.js';

// Applied to the outer regex and interpolated partials, but not interpolated regexes or strings
export function flagNPreprocessor(value, runningContext) {
  value = String(value);
  let pattern = '';
  let transformed = '';
  for (const [m] of value.matchAll(contextToken)) {
    pattern += m;
    runningContext = getEndContextForIncompletePattern(pattern, runningContext);
    const {regexContext} = runningContext;
    if (regexContext === RegexContext.DEFAULT) {
      if (m === '(') {
        transformed += '(?:';
      } else if (/^\\[1-9]/.test(m)) {
        throw new Error(`Invalid decimal escape "${m}" with implicit flag n; replace with named backreference`);
      } else {
        transformed += m;
      }
    } else {
      transformed += m;
    }
  }
  return {
    transformed,
    runningContext,
  };
}
