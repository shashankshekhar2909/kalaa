// Generates packages/react/components.json and packages/react/llms.txt (plus dist/ copies when dist exists)
// directly from component TypeScript source, JSDoc and Storybook stories so the AI manifest never drifts.
//   node packages/react/scripts/ai-manifest.mjs           generate files
//   node packages/react/scripts/ai-manifest.mjs --check   fail if on-disk files are stale
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createScanner, LanguageVariant, SyntaxKind } from "typescript/unstable/ast";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(scriptDir, "..");
const srcRoot = join(pkgRoot, "src");

function cleanJsDoc(raw) {
  if (!raw) return "";
  return raw
    .replace(/^\/\*\*?/, "")
    .replace(/\*\/$/, "")
    .split("\n")
    .map((line) => line.replace(/^\s*\*\s?/, "").trim())
    .filter((line) => line && !line.startsWith("@"))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeTypeScript(source) {
  const scanner = createScanner(/*skipTrivia*/ false, LanguageVariant.Standard, source);
  const tokens = [];
  const templateBraceDepth = [];

  while (true) {
    let kind = scanner.scan();
    if (kind === SyntaxKind.EndOfFile) break;

    if (kind === SyntaxKind.TemplateHead) {
      templateBraceDepth.push(0);
    } else if (kind === SyntaxKind.OpenBraceToken && templateBraceDepth.length > 0) {
      templateBraceDepth[templateBraceDepth.length - 1]++;
    } else if (kind === SyntaxKind.CloseBraceToken && templateBraceDepth.length > 0) {
      if (templateBraceDepth[templateBraceDepth.length - 1] === 0) {
        kind = scanner.reScanTemplateToken(false);
        if (kind === SyntaxKind.TemplateTail) {
          templateBraceDepth.pop();
        }
      } else {
        templateBraceDepth[templateBraceDepth.length - 1]--;
      }
    }

    if (kind === SyntaxKind.WhitespaceTrivia) continue;

    tokens.push({
      kind,
      start: scanner.getTokenStart(),
      end: scanner.getTokenEnd(),
      text: scanner.getTokenText(),
      value: scanner.getTokenValue(),
    });
  }
  return tokens;
}

function isCommentToken(tok) {
  return tok.kind === SyntaxKind.SingleLineCommentTrivia || tok.kind === SyntaxKind.MultiLineCommentTrivia;
}

function isJsDocToken(tok) {
  return tok.kind === SyntaxKind.MultiLineCommentTrivia && tok.text.startsWith("/**");
}

function isTriviaToken(tok) {
  return tok.kind === SyntaxKind.NewLineTrivia || isCommentToken(tok);
}

function isIdentifierOrKeywordToken(tok) {
  return tok.kind === SyntaxKind.Identifier || tok.kind >= SyntaxKind.FirstKeyword;
}

function findMatchingToken(tokens, openIdx, openKind, closeKind) {
  let depth = 0;
  for (let i = openIdx; i < tokens.length; i++) {
    const k = tokens[i].kind;
    if (k === openKind) depth++;
    else if (k === closeKind) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function formatTypeTokens(tokens, startIdx, endIdx, source) {
  const codeTokens = [];
  for (let i = startIdx; i < endIdx; i++) {
    if (!isTriviaToken(tokens[i])) {
      codeTokens.push(tokens[i]);
    }
  }
  if (codeTokens.length === 0) return "";
  let out = "";
  for (let i = 0; i < codeTokens.length; i++) {
    const curr = codeTokens[i];
    const prev = i > 0 ? codeTokens[i - 1] : null;
    if (prev) {
      const rawBetween = source.slice(prev.end, curr.start);
      const hadSpace = /\s/.test(rawBetween) || rawBetween.includes("/*") || rawBetween.includes("//");
      if (hadSpace) {
        out += " ";
      }
    }
    out += curr.text;
  }
  return out.replace(/\s+/g, " ").trim();
}

function parsePropertiesFromTokens(tokens, startIdx, endIdx, source) {
  const props = [];
  let i = startIdx;
  let lastDoc = "";

  while (i < endIdx) {
    const tok = tokens[i];
    if (
      tok.kind === SyntaxKind.NewLineTrivia ||
      tok.kind === SyntaxKind.SemicolonToken ||
      tok.kind === SyntaxKind.CommaToken
    ) {
      i++;
      continue;
    }
    if (isCommentToken(tok)) {
      if (isJsDocToken(tok)) {
        lastDoc = cleanJsDoc(tok.text);
      }
      i++;
      continue;
    }

    if (tok.kind === SyntaxKind.ReadonlyKeyword) {
      i++;
      while (i < endIdx && isTriviaToken(tokens[i])) i++;
      if (i >= endIdx) break;
    }

    const nameTok = tokens[i];
    if (!isIdentifierOrKeywordToken(nameTok) && nameTok.kind !== SyntaxKind.StringLiteral) {
      i++;
      lastDoc = "";
      continue;
    }
    const propName =
      nameTok.kind === SyntaxKind.StringLiteral ? (nameTok.value ?? nameTok.text.slice(1, -1)) : nameTok.text;
    i++;

    while (i < endIdx && isTriviaToken(tokens[i])) i++;
    let optional = false;
    if (i < endIdx && tokens[i].kind === SyntaxKind.QuestionToken) {
      optional = true;
      i++;
      while (i < endIdx && isTriviaToken(tokens[i])) i++;
    }

    if (i >= endIdx || tokens[i].kind !== SyntaxKind.ColonToken) {
      lastDoc = "";
      continue;
    }
    i++; // consume ':'

    while (i < endIdx && isTriviaToken(tokens[i])) i++;
    const typeStart = i;
    let brace = 0;
    let bracket = 0;
    let paren = 0;
    let angle = 0;

    while (i < endIdx) {
      const t = tokens[i];
      const k = t.kind;
      if (k === SyntaxKind.OpenBraceToken) brace++;
      else if (k === SyntaxKind.CloseBraceToken) brace = Math.max(0, brace - 1);
      else if (k === SyntaxKind.OpenBracketToken) bracket++;
      else if (k === SyntaxKind.CloseBracketToken) bracket = Math.max(0, bracket - 1);
      else if (k === SyntaxKind.OpenParenToken) paren++;
      else if (k === SyntaxKind.CloseParenToken) paren = Math.max(0, paren - 1);
      else if (k === SyntaxKind.LessThanToken) angle++;
      else if (k === SyntaxKind.GreaterThanToken) angle = Math.max(0, angle - 1);
      else if (brace === 0 && bracket === 0 && paren === 0 && angle === 0) {
        if (k === SyntaxKind.SemicolonToken || k === SyntaxKind.CommaToken) {
          break;
        }
        if (k === SyntaxKind.NewLineTrivia) {
          // Check if next non-trivia token starts a new property or closes block
          let look = i + 1;
          let sawJsDoc = false;
          while (look < endIdx && isTriviaToken(tokens[look])) {
            if (isJsDocToken(tokens[look])) sawJsDoc = true;
            look++;
          }
          if (look >= endIdx || sawJsDoc) {
            break;
          }
          const nextTok = tokens[look];
          if (
            nextTok.kind !== SyntaxKind.BarToken &&
            nextTok.kind !== SyntaxKind.AmpersandToken &&
            nextTok.kind !== SyntaxKind.QuestionToken &&
            nextTok.kind !== SyntaxKind.ColonToken
          ) {
            // Check if nextTok is followed by `?:` or `:`
            let afterName = look + (nextTok.kind === SyntaxKind.ReadonlyKeyword ? 1 : 0);
            while (afterName < endIdx && isTriviaToken(tokens[afterName])) afterName++;
            if (
              afterName < endIdx &&
              (isIdentifierOrKeywordToken(tokens[afterName]) ||
                tokens[afterName].kind === SyntaxKind.StringLiteral)
            ) {
              afterName++;
              while (afterName < endIdx && isTriviaToken(tokens[afterName])) afterName++;
              if (afterName < endIdx && tokens[afterName].kind === SyntaxKind.QuestionToken) {
                afterName++;
                while (afterName < endIdx && isTriviaToken(tokens[afterName])) afterName++;
              }
              if (afterName < endIdx && tokens[afterName].kind === SyntaxKind.ColonToken) {
                break;
              }
            }
          }
        }
      }
      i++;
    }

    const typeStr = formatTypeTokens(tokens, typeStart, i, source);
    if (
      i < endIdx &&
      (tokens[i].kind === SyntaxKind.SemicolonToken || tokens[i].kind === SyntaxKind.CommaToken)
    ) {
      i++;
    }

    if (propName && typeStr) {
      props.push({
        name: propName,
        type: typeStr,
        required: !optional,
        default: null,
        description: lastDoc,
      });
    }
    lastDoc = "";
  }

  return props;
}

export function parsePropertiesBlock(blockText) {
  const tokens = tokenizeTypeScript(blockText);
  return parsePropertiesFromTokens(tokens, 0, tokens.length, blockText);
}

const IGNORED_TYPE_WRAPPERS = new Set([
  "Omit",
  "Pick",
  "Partial",
  "Required",
  "Readonly",
  "ComponentPropsWithRef",
  "ComponentProps",
  "ComponentPropsWithoutRef",
]);

export function extractTypeDefinitions(source, registry = new Map()) {
  const tokens = tokenizeTypeScript(source);
  const len = tokens.length;
  let i = 0;

  while (i < len) {
    const tok = tokens[i];
    if (tok.kind !== SyntaxKind.InterfaceKeyword && tok.kind !== SyntaxKind.TypeKeyword) {
      i++;
      continue;
    }

    const declKind = tok.kind;
    i++;
    while (i < len && isTriviaToken(tokens[i])) i++;
    if (i >= len || tokens[i].kind !== SyntaxKind.Identifier) continue;
    const typeName = tokens[i].text;
    i++;

    while (i < len && isTriviaToken(tokens[i])) i++;
    // Skip optional type parameters `<...>`
    if (i < len && tokens[i].kind === SyntaxKind.LessThanToken) {
      const closeAngle = findMatchingToken(tokens, i, SyntaxKind.LessThanToken, SyntaxKind.GreaterThanToken);
      if (closeAngle !== -1) {
        i = closeAngle + 1;
      }
    }

    const refs = [];
    const props = [];

    if (declKind === SyntaxKind.InterfaceKeyword) {
      while (i < len && tokens[i].kind !== SyntaxKind.OpenBraceToken) {
        if (!isTriviaToken(tokens[i])) {
          if (tokens[i].kind === SyntaxKind.LessThanToken) {
            const closeAngle = findMatchingToken(
              tokens,
              i,
              SyntaxKind.LessThanToken,
              SyntaxKind.GreaterThanToken,
            );
            if (closeAngle !== -1) {
              i = closeAngle + 1;
              continue;
            }
          }
          if (
            tokens[i].kind === SyntaxKind.Identifier &&
            /^[A-Z]/.test(tokens[i].text) &&
            tokens[i].text !== typeName &&
            !IGNORED_TYPE_WRAPPERS.has(tokens[i].text)
          ) {
            refs.push(tokens[i].text);
          }
        }
        i++;
      }
      if (i < len && tokens[i].kind === SyntaxKind.OpenBraceToken) {
        const closeBrace = findMatchingToken(
          tokens,
          i,
          SyntaxKind.OpenBraceToken,
          SyntaxKind.CloseBraceToken,
        );
        if (closeBrace !== -1) {
          props.push(...parsePropertiesFromTokens(tokens, i + 1, closeBrace, source));
          i = closeBrace + 1;
        }
      }
    } else {
      // `type Name = ...`
      while (i < len && isTriviaToken(tokens[i])) i++;
      if (i >= len || tokens[i].kind !== SyntaxKind.EqualsToken) continue;
      i++; // consume '='

      let paren = 0;
      let bracket = 0;
      let angle = 0;
      while (i < len) {
        const t = tokens[i];
        if (isTriviaToken(t)) {
          i++;
          continue;
        }
        if (
          paren === 0 &&
          bracket === 0 &&
          angle === 0 &&
          (t.kind === SyntaxKind.SemicolonToken ||
            t.kind === SyntaxKind.ExportKeyword ||
            t.kind === SyntaxKind.InterfaceKeyword ||
            t.kind === SyntaxKind.TypeKeyword ||
            t.kind === SyntaxKind.FunctionKeyword ||
            t.kind === SyntaxKind.ConstKeyword)
        ) {
          if (t.kind === SyntaxKind.SemicolonToken) i++;
          break;
        }
        if (t.kind === SyntaxKind.OpenParenToken) paren++;
        else if (t.kind === SyntaxKind.CloseParenToken) paren = Math.max(0, paren - 1);
        else if (t.kind === SyntaxKind.OpenBracketToken) bracket++;
        else if (t.kind === SyntaxKind.CloseBracketToken) bracket = Math.max(0, bracket - 1);
        else if (t.kind === SyntaxKind.LessThanToken) angle++;
        else if (t.kind === SyntaxKind.GreaterThanToken) angle = Math.max(0, angle - 1);
        else if (paren === 0 && bracket === 0 && angle === 0) {
          if (t.kind === SyntaxKind.OpenBraceToken) {
            const closeBrace = findMatchingToken(
              tokens,
              i,
              SyntaxKind.OpenBraceToken,
              SyntaxKind.CloseBraceToken,
            );
            if (closeBrace !== -1) {
              props.push(...parsePropertiesFromTokens(tokens, i + 1, closeBrace, source));
              i = closeBrace + 1;
              continue;
            }
          } else if (
            t.kind === SyntaxKind.Identifier &&
            /^[A-Z]/.test(t.text) &&
            t.text !== typeName &&
            !IGNORED_TYPE_WRAPPERS.has(t.text)
          ) {
            refs.push(t.text);
          }
        }
        i++;
      }
    }

    if (props.length > 0 || refs.length > 0) {
      registry.set(typeName, { refs, props });
    }
  }
  return registry;
}

function resolvePropsForType(typeName, registry, visited = new Set()) {
  if (visited.has(typeName)) return [];
  visited.add(typeName);
  const entry = registry.get(typeName);
  if (!entry) return [];
  const byName = new Map();
  for (const ref of entry.refs) {
    for (const p of resolvePropsForType(ref, registry, visited)) {
      byName.set(p.name, { ...p });
    }
  }
  for (const p of entry.props) {
    byName.set(p.name, { ...p });
  }
  return Array.from(byName.values());
}

export function extractFunctionDefaults(source, componentName) {
  const defaults = new Map();
  const tokens = tokenizeTypeScript(source);
  const codeTokens = tokens.filter((t) => !isTriviaToken(t));
  const len = codeTokens.length;

  for (let i = 0; i < len - 2; i++) {
    if (
      codeTokens[i].kind === SyntaxKind.ExportKeyword &&
      codeTokens[i + 1].kind === SyntaxKind.FunctionKeyword &&
      codeTokens[i + 2].kind === SyntaxKind.Identifier &&
      codeTokens[i + 2].text === componentName
    ) {
      let idx = i + 3;
      if (idx < len && codeTokens[idx].kind === SyntaxKind.LessThanToken) {
        const closeAngle = findMatchingToken(
          codeTokens,
          idx,
          SyntaxKind.LessThanToken,
          SyntaxKind.GreaterThanToken,
        );
        if (closeAngle !== -1) idx = closeAngle + 1;
      }
      if (idx >= len || codeTokens[idx].kind !== SyntaxKind.OpenParenToken) break;
      idx++; // inside '('
      if (idx >= len || codeTokens[idx].kind !== SyntaxKind.OpenBraceToken) break;
      const closeBrace = findMatchingToken(
        codeTokens,
        idx,
        SyntaxKind.OpenBraceToken,
        SyntaxKind.CloseBraceToken,
      );
      if (closeBrace === -1) break;

      let p = idx + 1;
      while (p < closeBrace) {
        if (codeTokens[p].kind === SyntaxKind.CommaToken) {
          p++;
          continue;
        }
        // Advance to top-level comma or closeBrace
        let elemEnd = p;
        let depth = 0;
        while (elemEnd < closeBrace) {
          const k = codeTokens[elemEnd].kind;
          if (
            k === SyntaxKind.OpenBraceToken ||
            k === SyntaxKind.OpenParenToken ||
            k === SyntaxKind.OpenBracketToken
          ) {
            depth++;
          } else if (
            k === SyntaxKind.CloseBraceToken ||
            k === SyntaxKind.CloseParenToken ||
            k === SyntaxKind.CloseBracketToken
          ) {
            depth = Math.max(0, depth - 1);
          } else if (depth === 0 && k === SyntaxKind.CommaToken) {
            break;
          }
          elemEnd++;
        }

        if (codeTokens[p].kind !== SyntaxKind.DotDotDotToken) {
          const nameTok = codeTokens[p];
          const propName =
            nameTok.kind === SyntaxKind.StringLiteral
              ? (nameTok.value ?? nameTok.text.slice(1, -1))
              : nameTok.text;
          let eqIdx = -1;
          let d = 0;
          for (let k = p + 1; k < elemEnd; k++) {
            const tk = codeTokens[k].kind;
            if (
              tk === SyntaxKind.OpenBraceToken ||
              tk === SyntaxKind.OpenParenToken ||
              tk === SyntaxKind.OpenBracketToken
            ) {
              d++;
            } else if (
              tk === SyntaxKind.CloseBraceToken ||
              tk === SyntaxKind.CloseParenToken ||
              tk === SyntaxKind.CloseBracketToken
            ) {
              d = Math.max(0, d - 1);
            } else if (d === 0 && tk === SyntaxKind.EqualsToken) {
              eqIdx = k;
              break;
            }
          }
          if (eqIdx !== -1 && eqIdx + 1 < elemEnd) {
            const firstValTok = codeTokens[eqIdx + 1];
            const lastValTok = codeTokens[elemEnd - 1];
            const rawDefault = source.slice(firstValTok.start, lastValTok.end).trim();
            defaults.set(propName, rawDefault);
          }
        }
        p = elemEnd + 1;
      }
      break;
    }
  }
  return defaults;
}

function evaluateStringExpression(codeTokens, startIdx, endIdx, bindings = new Map()) {
  let idx = startIdx;

  function parsePrimary() {
    if (idx >= endIdx) return null;
    const tok = codeTokens[idx];

    if (tok.kind === SyntaxKind.StringLiteral || tok.kind === SyntaxKind.NoSubstitutionTemplateLiteral) {
      idx++;
      return tok.value ?? "";
    }

    if (tok.kind === SyntaxKind.NumericLiteral) {
      idx++;
      return tok.value ?? tok.text;
    }

    if (tok.kind === SyntaxKind.TrueKeyword || tok.kind === SyntaxKind.FalseKeyword) {
      idx++;
      return tok.text;
    }

    if (tok.kind === SyntaxKind.TemplateHead) {
      let acc = tok.value ?? "";
      idx++;
      while (idx < endIdx) {
        // Find matching TemplateMiddle or TemplateTail at depth 0
        let exprEnd = idx;
        let braceDepth = 0;
        while (exprEnd < endIdx) {
          const k = codeTokens[exprEnd].kind;
          if (k === SyntaxKind.OpenBraceToken) braceDepth++;
          else if (k === SyntaxKind.CloseBraceToken) braceDepth = Math.max(0, braceDepth - 1);
          else if (braceDepth === 0 && (k === SyntaxKind.TemplateMiddle || k === SyntaxKind.TemplateTail)) {
            break;
          }
          exprEnd++;
        }
        const innerVal = evaluateStringExpression(codeTokens, idx, exprEnd, bindings);
        acc += innerVal ?? "";
        idx = exprEnd;
        if (idx >= endIdx) break;
        const tailOrMid = codeTokens[idx];
        acc += tailOrMid.value ?? "";
        idx++;
        if (tailOrMid.kind === SyntaxKind.TemplateTail) {
          break;
        }
      }
      return acc;
    }

    if (tok.kind === SyntaxKind.OpenParenToken) {
      const closeParen = findMatchingToken(
        codeTokens,
        idx,
        SyntaxKind.OpenParenToken,
        SyntaxKind.CloseParenToken,
      );
      if (closeParen !== -1 && closeParen < endIdx) {
        const val = evaluateStringExpression(codeTokens, idx + 1, closeParen, bindings);
        idx = closeParen + 1;
        return val;
      }
    }

    if (tok.kind === SyntaxKind.OpenBracketToken) {
      // Support `["a", "b"].join("\n")`
      const closeBracket = findMatchingToken(
        codeTokens,
        idx,
        SyntaxKind.OpenBracketToken,
        SyntaxKind.CloseBracketToken,
      );
      if (closeBracket !== -1 && closeBracket < endIdx) {
        const items = [];
        let elemStart = idx + 1;
        let d = 0;
        for (let k = idx + 1; k <= closeBracket; k++) {
          const tk = codeTokens[k].kind;
          if (
            tk === SyntaxKind.OpenBraceToken ||
            tk === SyntaxKind.OpenParenToken ||
            tk === SyntaxKind.OpenBracketToken
          ) {
            d++;
          } else if (
            tk === SyntaxKind.CloseBraceToken ||
            tk === SyntaxKind.CloseParenToken ||
            tk === SyntaxKind.CloseBracketToken
          ) {
            if (k === closeBracket && d === 0) {
              if (k > elemStart) {
                const v = evaluateStringExpression(codeTokens, elemStart, k, bindings);
                if (v !== null) items.push(v);
              }
              break;
            }
            d = Math.max(0, d - 1);
          } else if (d === 0 && tk === SyntaxKind.CommaToken) {
            if (k > elemStart) {
              const v = evaluateStringExpression(codeTokens, elemStart, k, bindings);
              if (v !== null) items.push(v);
            }
            elemStart = k + 1;
          }
        }
        idx = closeBracket + 1;
        let sep = ",";
        if (
          idx + 3 < endIdx &&
          codeTokens[idx].kind === SyntaxKind.DotToken &&
          codeTokens[idx + 1].text === "join" &&
          codeTokens[idx + 2].kind === SyntaxKind.OpenParenToken
        ) {
          const closeJoin = findMatchingToken(
            codeTokens,
            idx + 2,
            SyntaxKind.OpenParenToken,
            SyntaxKind.CloseParenToken,
          );
          if (closeJoin !== -1 && closeJoin <= endIdx) {
            const evaluatedSep = evaluateStringExpression(codeTokens, idx + 3, closeJoin, bindings);
            if (evaluatedSep !== null) sep = evaluatedSep;
            idx = closeJoin + 1;
          }
        }
        return items.join(sep);
      }
    }

    if (tok.kind === SyntaxKind.Identifier && bindings.has(tok.text)) {
      idx++;
      return bindings.get(tok.text);
    }

    return null;
  }

  const first = parsePrimary();
  if (first === null) return null;
  let result = first;

  while (idx < endIdx && codeTokens[idx].kind === SyntaxKind.PlusToken) {
    idx++;
    const rhs = parsePrimary();
    if (rhs === null) break;
    result += rhs;
  }

  return result;
}

function parseObjectAst(codeTokens, openBraceIdx, closeBraceIdx, bindings) {
  const obj = new Map();
  let i = openBraceIdx + 1;

  while (i < closeBraceIdx) {
    if (codeTokens[i].kind === SyntaxKind.CommaToken || codeTokens[i].kind === SyntaxKind.SemicolonToken) {
      i++;
      continue;
    }

    // Advance to next top-level comma in this object literal
    let propEnd = i;
    let depth = 0;
    while (propEnd < closeBraceIdx) {
      const k = codeTokens[propEnd].kind;
      if (
        k === SyntaxKind.OpenBraceToken ||
        k === SyntaxKind.OpenParenToken ||
        k === SyntaxKind.OpenBracketToken
      ) {
        depth++;
      } else if (
        k === SyntaxKind.CloseBraceToken ||
        k === SyntaxKind.CloseParenToken ||
        k === SyntaxKind.CloseBracketToken
      ) {
        depth = Math.max(0, depth - 1);
      } else if (depth === 0 && k === SyntaxKind.CommaToken) {
        break;
      }
      propEnd++;
    }

    const keyTok = codeTokens[i];
    const key =
      keyTok.kind === SyntaxKind.StringLiteral
        ? (keyTok.value ?? keyTok.text.slice(1, -1))
        : isIdentifierOrKeywordToken(keyTok)
          ? keyTok.text
          : null;

    if (key && i + 2 <= propEnd && codeTokens[i + 1].kind === SyntaxKind.ColonToken) {
      const valStart = i + 2;
      if (valStart < propEnd && codeTokens[valStart].kind === SyntaxKind.OpenBraceToken) {
        const nestedClose = findMatchingToken(
          codeTokens,
          valStart,
          SyntaxKind.OpenBraceToken,
          SyntaxKind.CloseBraceToken,
        );
        if (nestedClose !== -1 && nestedClose <= propEnd) {
          obj.set(key, parseObjectAst(codeTokens, valStart, nestedClose, bindings));
        }
      } else {
        const strVal = evaluateStringExpression(codeTokens, valStart, propEnd, bindings);
        if (strVal !== null) {
          obj.set(key, strVal);
        }
      }
    }

    i = propEnd + 1;
  }

  return obj;
}

export function extractStoryDetails(storiesSource, componentName) {
  let category = "Components";
  let purpose = "";
  let example = "";

  if (storiesSource) {
    const tokens = tokenizeTypeScript(storiesSource);
    const codeTokens = tokens.filter((t) => !isTriviaToken(t));
    const len = codeTokens.length;
    const constBindings = new Map();
    const objectBindings = new Map();

    // Collect top-level `const IDENT = ...` string and object bindings
    let depth = 0;
    for (let i = 0; i < len; i++) {
      const k = codeTokens[i].kind;
      if (
        k === SyntaxKind.OpenBraceToken ||
        k === SyntaxKind.OpenParenToken ||
        k === SyntaxKind.OpenBracketToken
      ) {
        depth++;
        continue;
      }
      if (
        k === SyntaxKind.CloseBraceToken ||
        k === SyntaxKind.CloseParenToken ||
        k === SyntaxKind.CloseBracketToken
      ) {
        depth = Math.max(0, depth - 1);
        continue;
      }
      if (
        depth === 0 &&
        (k === SyntaxKind.ConstKeyword || k === SyntaxKind.LetKeyword) &&
        i + 1 < len &&
        codeTokens[i + 1].kind === SyntaxKind.Identifier
      ) {
        const varName = codeTokens[i + 1].text;
        let eqIdx = i + 2;
        while (
          eqIdx < len &&
          codeTokens[eqIdx].kind !== SyntaxKind.EqualsToken &&
          codeTokens[eqIdx].kind !== SyntaxKind.SemicolonToken
        ) {
          eqIdx++;
        }
        if (eqIdx < len && codeTokens[eqIdx].kind === SyntaxKind.EqualsToken && eqIdx + 1 < len) {
          const rhsStart = eqIdx + 1;
          if (codeTokens[rhsStart].kind === SyntaxKind.OpenBraceToken) {
            const closeObj = findMatchingToken(
              codeTokens,
              rhsStart,
              SyntaxKind.OpenBraceToken,
              SyntaxKind.CloseBraceToken,
            );
            if (closeObj !== -1) {
              objectBindings.set(varName, parseObjectAst(codeTokens, rhsStart, closeObj, constBindings));
            }
          } else {
            let stmtEnd = rhsStart;
            let d = 0;
            while (stmtEnd < len) {
              const tk = codeTokens[stmtEnd].kind;
              if (
                tk === SyntaxKind.OpenBraceToken ||
                tk === SyntaxKind.OpenParenToken ||
                tk === SyntaxKind.OpenBracketToken
              ) {
                d++;
              } else if (
                tk === SyntaxKind.CloseBraceToken ||
                tk === SyntaxKind.CloseParenToken ||
                tk === SyntaxKind.CloseBracketToken
              ) {
                d = Math.max(0, d - 1);
              } else if (
                d === 0 &&
                (tk === SyntaxKind.SemicolonToken ||
                  tk === SyntaxKind.ExportKeyword ||
                  tk === SyntaxKind.ConstKeyword)
              ) {
                break;
              }
              stmtEnd++;
            }
            const strVal = evaluateStringExpression(codeTokens, rhsStart, stmtEnd, constBindings);
            if (strVal !== null) {
              constBindings.set(varName, strVal);
            }
          }
        }
      }
    }

    // Locate `export default { ... }` or `export default meta`
    let metaAst = null;
    for (let i = 0; i < len - 2; i++) {
      if (
        codeTokens[i].kind === SyntaxKind.ExportKeyword &&
        codeTokens[i + 1].kind === SyntaxKind.DefaultKeyword
      ) {
        const targetTok = codeTokens[i + 2];
        if (targetTok.kind === SyntaxKind.OpenBraceToken) {
          const closeObj = findMatchingToken(
            codeTokens,
            i + 2,
            SyntaxKind.OpenBraceToken,
            SyntaxKind.CloseBraceToken,
          );
          if (closeObj !== -1) {
            metaAst = parseObjectAst(codeTokens, i + 2, closeObj, constBindings);
          }
        } else if (targetTok.kind === SyntaxKind.Identifier && objectBindings.has(targetTok.text)) {
          metaAst = objectBindings.get(targetTok.text);
        }
        break;
      }
    }

    if (metaAst) {
      const fullTitle = metaAst.get("title");
      if (typeof fullTitle === "string") {
        const lastSlash = fullTitle.lastIndexOf("/");
        if (lastSlash !== -1) {
          category = fullTitle.slice(0, lastSlash);
        }
      }

      const paramsObj = metaAst.get("parameters");
      const docsObj = paramsObj instanceof Map ? paramsObj.get("docs") : null;
      const descObj = docsObj instanceof Map ? docsObj.get("description") : null;
      const rawDesc = descObj instanceof Map ? descObj.get("component") : null;

      if (typeof rawDesc === "string") {
        const paragraphs = rawDesc.split(/\n\s*\n/);
        purpose = (paragraphs[0] ?? "").replace(/\s+/g, " ").trim();
        const usageMatch = rawDesc.match(/```tsx\n([\s\S]*?)```/);
        if (usageMatch) {
          example = usageMatch[1].trim();
        }
      }
    }
  }

  if (!example) {
    example = `import { ${componentName} } from "@kalaa/react";\n\n<${componentName} />`;
  }

  return { category, purpose, example };
}

function extractLeadingComponentJsDoc(tsxSource, componentName) {
  const tokens = tokenizeTypeScript(tsxSource);
  let fallbackPropsDoc = "";
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].kind !== SyntaxKind.ExportKeyword) continue;
    let j = i + 1;
    while (j < tokens.length && isTriviaToken(tokens[j])) j++;
    if (j >= tokens.length) continue;
    const declKind = tokens[j].kind;
    if (
      declKind !== SyntaxKind.FunctionKeyword &&
      declKind !== SyntaxKind.TypeKeyword &&
      declKind !== SyntaxKind.InterfaceKeyword
    ) {
      continue;
    }
    j++;
    while (j < tokens.length && isTriviaToken(tokens[j])) j++;
    if (j >= tokens.length || tokens[j].kind !== SyntaxKind.Identifier) continue;
    const targetName = tokens[j].text;

    let k = i - 1;
    while (k >= 0 && tokens[k].kind === SyntaxKind.NewLineTrivia) k--;
    const doc = k >= 0 && isJsDocToken(tokens[k]) ? cleanJsDoc(tokens[k].text) : "";
    if (!doc) continue;

    if (declKind === SyntaxKind.FunctionKeyword && targetName === componentName) {
      return doc;
    }
    if (targetName === `${componentName}Props`) {
      fallbackPropsDoc = doc;
    }
  }
  return fallbackPropsDoc;
}

export function parseComponentSource({
  componentName,
  tsxSource,
  storiesSource = "",
  sharedRegistry = new Map(),
}) {
  const localRegistry = new Map(sharedRegistry);
  extractTypeDefinitions(tsxSource, localRegistry);

  const propsTypeName = `${componentName}Props`;
  const props = resolvePropsForType(propsTypeName, localRegistry);
  const defaults = extractFunctionDefaults(tsxSource, componentName);

  for (const prop of props) {
    if (defaults.has(prop.name)) {
      prop.default = defaults.get(prop.name);
    }
  }

  const storyInfo = extractStoryDetails(storiesSource, componentName);
  const jsDocPurpose = extractLeadingComponentJsDoc(tsxSource, componentName);
  const purpose = storyInfo.purpose || jsDocPurpose || `${componentName} component in @kalaa/react.`;

  return {
    name: componentName,
    category: storyInfo.category,
    purpose,
    props,
    example: storyInfo.example,
  };
}

// Canonical component list for the manifest: all Blocks, Templates, and core Kalaa components.
const CANONICAL_COMPONENT_TARGETS = [
  // Templates
  { name: "ResumePage", dir: "ResumePage" },
  { name: "PortfolioPage", dir: "PortfolioPage" },
  { name: "LandingPage", dir: "LandingPage" },
  // Blocks/Resume
  { name: "ResumeHeader", dir: "ResumeHeader" },
  { name: "Summary", dir: "Summary" },
  { name: "ExperienceList", dir: "ExperienceList" },
  { name: "ExperienceItem", dir: "ExperienceList", categoryOverride: "Blocks/Resume" },
  { name: "EducationList", dir: "EducationList" },
  { name: "SkillGroups", dir: "SkillGroups" },
  { name: "ProjectList", dir: "ProjectList" },
  { name: "ProjectCard", dir: "ProjectList", categoryOverride: "Blocks/Resume" },
  { name: "Certifications", dir: "Certifications" },
  { name: "Languages", dir: "Languages" },
  { name: "Awards", dir: "Awards" },
  { name: "Publications", dir: "Awards", categoryOverride: "Blocks/Resume" },
  // Blocks/Profile & portfolio
  { name: "ProfileCard", dir: "ProfileCard" },
  { name: "CaseStudyCard", dir: "CaseStudyCard" },
  { name: "Timeline", dir: "Timeline" },
  { name: "TestimonialCard", dir: "TestimonialCard" },
  { name: "ContactCard", dir: "ContactCard" },
  { name: "LinkList", dir: "LinkList" },
  // Blocks/Marketing
  { name: "Hero", dir: "Hero" },
  { name: "FeatureGrid", dir: "FeatureGrid" },
  { name: "StatsBand", dir: "StatsBand" },
  { name: "CTA", dir: "CTA" },
  { name: "FAQ", dir: "FAQ" },
  { name: "PageFooter", dir: "PageFooter" },
  { name: "SectionHeader", dir: "SectionHeader" },
  // Core Components
  { name: "AppShell", dir: "AppShell" },
  { name: "PageHeader", dir: "PageHeader" },
  { name: "Card", dir: "Card" },
  { name: "KeyValue", dir: "KeyValue" },
  { name: "ValueComparison", dir: "ValueComparison" },
  { name: "EmptyState", dir: "EmptyState" },
  { name: "Button", dir: "Button" },
  { name: "ButtonLink", dir: "Button", storyDir: "ButtonLink" },
  { name: "Field", dir: "Field" },
  { name: "Input", dir: "Input" },
  { name: "Textarea", dir: "Textarea" },
  { name: "Select", dir: "Select" },
  { name: "Checkbox", dir: "Checkbox" },
  { name: "Switch", dir: "Switch" },
  { name: "Tabs", dir: "Tabs" },
  { name: "Banner", dir: "Banner" },
  { name: "Badge", dir: "Badge" },
  { name: "StatusBadge", dir: "Badge", storyDir: "StatusBadge" },
  { name: "ProgressBar", dir: "ProgressBar" },
  { name: "Dialog", dir: "Dialog" },
  { name: "Table", dir: "Table" },
  { name: "DataTable", dir: "DataTable" },
  { name: "Pagination", dir: "Pagination" },
  { name: "Toolbar", dir: "Toolbar" },
  { name: "Meter", dir: "Meter" },
  { name: "SuggestionReview", dir: "SuggestionReview" },
  { name: "Logo", dir: "Logo" },
  { name: "CodeBlock", dir: "CodeBlock" },
  { name: "Avatar", dir: "Avatar" },
  { name: "Breadcrumbs", dir: "Breadcrumbs" },
  { name: "Combobox", dir: "Combobox" },
  { name: "Divider", dir: "Divider" },
  { name: "DropZone", dir: "DropZone" },
  { name: "Icon", dir: "Icon" },
  { name: "Link", dir: "Link" },
  { name: "Menu", dir: "Menu" },
  { name: "MultiSelect", dir: "MultiSelect" },
  { name: "Popover", dir: "Popover" },
  { name: "AppearanceMenu", dir: "AppearanceMenu" },
  { name: "RadioGroup", dir: "RadioGroup" },
  { name: "Skeleton", dir: "Skeleton" },
  { name: "Slider", dir: "Slider" },
  { name: "Spinner", dir: "Spinner" },
  { name: "Stat", dir: "Stat" },
  { name: "Toast", dir: "Toast" },
  { name: "Tooltip", dir: "Tooltip" },
];

export function buildManifest() {
  const pkgJson = JSON.parse(readFileSync(join(pkgRoot, "package.json"), "utf8"));
  const sharedRegistry = new Map();
  const typesPath = join(srcRoot, "schemas", "types.ts");
  if (existsSync(typesPath)) {
    extractTypeDefinitions(readFileSync(typesPath, "utf8"), sharedRegistry);
  }

  const components = [];
  for (const target of CANONICAL_COMPONENT_TARGETS) {
    const tsxPath = join(srcRoot, "components", target.dir, `${target.dir}.tsx`);
    if (!existsSync(tsxPath)) continue;
    const tsxSource = readFileSync(tsxPath, "utf8");
    const storyDir = target.storyDir ?? target.dir;
    const storiesPath = join(srcRoot, "components", storyDir, `${storyDir}.stories.tsx`);
    const storiesSource = existsSync(storiesPath) ? readFileSync(storiesPath, "utf8") : "";

    const parsed = parseComponentSource({
      componentName: target.name,
      tsxSource,
      storiesSource,
      sharedRegistry,
    });
    if (target.categoryOverride) {
      parsed.category = target.categoryOverride;
    }
    components.push(parsed);
  }

  return {
    package: pkgJson.name,
    version: pkgJson.version,
    schemas: {
      ResumeData: "@kalaa/react/resume.schema.json",
      PortfolioData: "@kalaa/react/portfolio.schema.json",
    },
    components,
  };
}

export function formatLlmsTxt(manifest) {
  const lines = [
    `# Kalaa (${manifest.package} v${manifest.version})`,
    "",
    '> Calm, accessible React components, data-driven blocks and full-page templates styled with Kalaa design tokens (`--kalaa-*`). Square by default (`data-shape="soft"` for rounded corners), three Indian-pigment accents (`neel`, `geru`, `mayur`), light and dark themes (`data-theme="light|dark"`), and A4/Letter black-on-white print stylesheets.',
    "",
    "## Data-first AI workflow",
    "",
    "1. Validate or populate a single JSON object conforming to `ResumeData` (`@kalaa/react/resume.schema.json`) or `PortfolioData` (`@kalaa/react/portfolio.schema.json`).",
    '2. Pass the data object to `<ResumePage data={resumeData} layout="single-column" />`, `<PortfolioPage data={portfolioData} />`, or `<LandingPage data={landingPageData} />`.',
    "3. Compose custom views from individual blocks in `Blocks/Resume`, `Blocks/Profile & portfolio`, `Blocks/Marketing`, and primitives in `Components`.",
    "",
    "## Exported JSON Schemas and helpers",
    "",
    "- `ResumeData`, `resumeDataSchema`, `validateResumeData`, `sampleResumeData` (`@kalaa/react/resume.schema.json`)",
    "- `PortfolioData`, `portfolioDataSchema`, `validatePortfolioData`, `samplePortfolioData` (`@kalaa/react/portfolio.schema.json`)",
    "- `LandingPageData`, `sampleLandingPageData`",
    "",
  ];

  const categories = [
    "Templates",
    "Blocks/Resume",
    "Blocks/Profile & portfolio",
    "Blocks/Marketing",
    "Components",
  ];

  for (const category of categories) {
    const group = manifest.components.filter((c) => c.category === category);
    if (group.length === 0) continue;
    lines.push(`## ${category}`, "");
    for (const comp of group) {
      lines.push(`### ${comp.name}`, "");
      lines.push(comp.purpose, "");
      if (comp.props.length > 0) {
        lines.push("Props:");
        for (const prop of comp.props) {
          const reqLabel = prop.required && prop.default === null ? "required" : "optional";
          const defLabel = prop.default !== null ? `, default: ${prop.default}` : "";
          const descLabel = prop.description ? ` — ${prop.description}` : "";
          lines.push(`- \`${prop.name}\` (\`${prop.type}\`, ${reqLabel}${defLabel})${descLabel}`);
        }
        lines.push("");
      }
      lines.push("Example:");
      lines.push("```tsx", comp.example, "```", "");
    }
  }

  return lines.join("\n");
}

export function readCommittedManifest() {
  const jsonPath = join(pkgRoot, "components.json");
  const llmsPath = join(pkgRoot, "llms.txt");
  return {
    json: JSON.parse(readFileSync(jsonPath, "utf8")),
    llmsTxt: readFileSync(llmsPath, "utf8"),
  };
}

export function readComponentCss(dirName = "", fileName = `${dirName}.css`) {
  return readFileSync(join(srcRoot, "components", dirName, fileName), "utf8");
}

const isCli =
  process.argv[1] &&
  fileURLToPath(import.meta.url).endsWith(process.argv[1].replace(/^.*\/packages\/react\//, ""));

if (isCli || process.argv[1]?.endsWith("ai-manifest.mjs")) {
  const manifest = buildManifest();
  const jsonText = JSON.stringify(manifest, null, 2) + "\n";
  const llmsText = formatLlmsTxt(manifest);

  const jsonPath = join(pkgRoot, "components.json");
  const llmsPath = join(pkgRoot, "llms.txt");

  if (process.argv.includes("--check")) {
    const currentJson = existsSync(jsonPath) ? readFileSync(jsonPath, "utf8") : "";
    const currentLlms = existsSync(llmsPath) ? readFileSync(llmsPath, "utf8") : "";
    if (currentJson !== jsonText || currentLlms !== llmsText) {
      console.error(
        "ai-manifest: components.json or llms.txt is stale. Run `node packages/react/scripts/ai-manifest.mjs`.",
      );
      process.exit(1);
    }
    console.log(`ai-manifest: ${manifest.components.length} components verified up to date`);
  } else {
    writeFileSync(jsonPath, jsonText);
    writeFileSync(llmsPath, llmsText);
    const distDir = join(pkgRoot, "dist");
    if (existsSync(distDir)) {
      mkdirSync(distDir, { recursive: true });
      writeFileSync(join(distDir, "components.json"), jsonText);
      writeFileSync(join(distDir, "llms.txt"), llmsText);
    }
    console.log(
      `ai-manifest: generated components.json and llms.txt for ${manifest.components.length} components`,
    );
  }
}
