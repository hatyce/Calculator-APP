"use client";
import React, { useState } from "react";
const tokenize = (expression: string): string[] => {
  const regex = /(\d+\.?\d*|[+\-*/^()!%]|√|log|ln)/g;
  return expression.match(regex) || [];
};
const presedence = (op: string) => {
  switch (op) {
    case "+":
    case "-":
      return 1;
    case "*":
    case "/":
      return 2;
    case "^":
      return 3;
    case "√":
    case "sqrt":
    case "log":
    case "ln":
    case "!":
    case "%":
      return 4;
    default:
      return 0;
  }
};
const toPostfix = (tokens: string[]): string[] => {
  const output: string[] = [];
  const operators: string[] = [];
  for (const token of tokens) {
    if (!isNaN(Number(token))) {
      output.push(token);
    } else if (token === "(") {
      operators.push(token);
    } else if (token === ")") {
      while (operators.length && operators[operators.length - 1] !== "(") {
        output.push(operators.pop()!);
      }
      operators.pop();
      if (
        operators.length &&
        ["√", "log", "ln"].includes(operators[operators.length - 1])
      ) {
        output.push(operators.pop()!);
      }
    } else {
      while (operators.length) {
        const top = operators[operators.length - 1];
        if (["√", "log", "ln"].includes(token)) break;
        const precTop = presedence(top);
        const precToken = presedence(token);
        if (precTop > precToken || (precTop === precToken && token !== "^")) {
          output.push(operators.pop()!);
          continue;
        }
        break;
      }
      operators.push(token);
    }
  }
  while (operators.length) {
    output.push(operators.pop()!);
  }
  return output;
};
const insertImplicitMultiplication = (tokens: string[]): string[] => {
  const out: string[] = [];
  const funcs = new Set(["√", "sqrt", "log", "ln"]);
  for (let i = 0; i < tokens.length; i++) {
    const cur = tokens[i];
    const next = tokens[i + 1];
    out.push(cur);
    if (next === undefined) continue;
    const curIsNumber = !isNaN(Number(cur));
    const nextIsNumber = !isNaN(Number(next));
    const curIsRightParen = cur === ")";
    const nextIsLeftParen = next === "(";
    const curIsPostfix = cur === "!" || cur === "%";
    const nextIsFunction = funcs.has(next);
    if (
      (curIsNumber || curIsRightParen || curIsPostfix) &&
      (nextIsNumber || nextIsLeftParen || nextIsFunction)
    ) {
      out.push("*");
    }
  }
  return out;
};
const evaluatePostfix = (tokens: string[]): number => {
  const stack: number[] = [];
  for (const token of tokens) {
    if (!isNaN(Number(token))) {
      stack.push(Number(token));
    } else {
      if (token === "√" || token === "sqrt") {
        const a = stack.pop()!;
        stack.push(Math.sqrt(a));
      } else if (token === "log") {
        const a = stack.pop()!;
        stack.push(Math.log10(a));
      } else if (token === "ln") {
        const a = stack.pop()!;
        stack.push(Math.log(a));
      } else if (token === "!") {
        const a = stack.pop()!;
        stack.push(factorial(a));
      } else if (token === "%") {
        const a = stack.pop()!;
        stack.push(a / 100);
      } else {
        const b = stack.pop()!;
        const a = stack.pop()!;
        switch (token) {
          case "+":
            stack.push(a + b);
            break;
          case "-":
            stack.push(a - b);
            break;
          case "*":
            stack.push(a * b);
            break;
          case "/":
            stack.push(a / b);
            break;
          case "^":
            stack.push(a ** b);
            break;
        }
      }
    }
  }
    return stack.pop()!;
};
const factorial = (n: number): number => {
  if (n < 0) throw new Error("Negative number not allowed for factorial");
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
};

export default function Calculator() {
  const [expression, setExpression] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const formatForDisplay = (expr: string) => {
    if (!expr) return <span>0</span>;
    const nodes: React.ReactNode[] = [];
    let i = 0;
    let key = 0;
    while (i < expr.length) {
      const ch = expr[i];
      if (ch === "^") {
        i++;
        if (i >= expr.length) {
          nodes.push(<sup key={key++}>^</sup>);
          break;
        }
        if (expr[i] === "(") {
          let start = i;
          let depth = 0;
          let j = i;
          for (; j < expr.length; j++) {
            if (expr[j] === "(") depth++;
            else if (expr[j] === ")") {
              depth--;
              if (depth === 0) {
                j++;
                break;
              }
            }
          }
          const part = expr.slice(start, j);
          nodes.push(<sup key={key++}>{part}</sup>);
          i = j;
        } else {
          let j = i;
          while (j < expr.length && /[0-9.]/.test(expr[j])) j++;
          const part = expr.slice(i, j) || "^";
          nodes.push(<sup key={key++}>{part}</sup>);
          i = j;
        }
      } else {
        nodes.push(<span key={key++}>{ch}</span>);
        i++;
      }
    }
    return <>{nodes}</>;
  };
  const handleClick = (value: string) => {
    setExpression((prev) => prev + value);
  };
  const handleClear = () => {
    setExpression("");
    setResult("");
  };
  const handleBackspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };
  const handleEvaluate = () => {
    try {
      const tokens = insertImplicitMultiplication(tokenize(expression));
      const postfix = toPostfix(tokens);
      const res = evaluatePostfix(postfix);
      setResult(res.toString());
    } catch (err) {
      setResult("Error");
    }
  };
  const buttons = [
    "7",
    "8",
    "9",
    "/",
    "√",
    "4",
    "5",
    "6",
    "*",
    "^",
    "1",
    "2",
    "3",
    "-",
    "log",
    "0",
    ".",
    "%",
    "+",
    "ln",
    "(",
    ")",
    "!",
    "C",
    "AC",
    "=",
  ];
  return (
    <div
      className="rounded-xl shadow-lg p-4 w-[420px]"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <div
        className="rounded-md p-3 mb-4 text-right font-mono"
        style={{
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-secondary)",
        }}
      >
        {formatForDisplay(expression)}
      </div>
      <div
        className="rounded-md p-3 mb-4 text-right font-mono min-h-[40px] text-lg font-bold"
        style={{
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-secondary)",
        }}
      >
        {result}
      </div>
      <div className="grid grid-cols-5 gap-3">
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => {
              if (btn === "AC") handleClear();
              else if (btn === "C") handleBackspace();
              else if (btn === "=") handleEvaluate();
              else handleClick(btn);
            }}
            style={{
              backgroundColor: ["+", "-", "*", "/", "^"].includes(btn)
                ? "var(--btn-operator)"
                : ["√", "log", "ln", "!", "%"].includes(btn)
                  ? "var(--btn-function)"
                  : "var(--btn-number)",
              color: "var(--text-primary)",
            }}
            className="p-3 rounded-lg shadow-md hover:brightness-110 transition-all"
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}
