// js/utils/temp.js
export class Template {
  static render(template, data) {
    return template.replace(
      /\{(#if|#each|#\/if|#\/each|[^}]+)\}/g,
      (match, p1) => {
        if (p1.startsWith("if ")) {
          const condition = p1.slice(3).trim();
          return this.evaluateIf(condition, data);
        }

        if (p1.startsWith("each ")) {
          const [arrayExpr, itemName, indexName] = this.parseEachExpression(p1);
          return this.evaluateEach(arrayExpr, itemName, indexName, data);
        }

        if (p1 === "/if" || p1 === "/each") {
          return "";
        }

        return this.interpolateVariable(p1, data);
      },
    );
  }

  static parseEachExpression(expr) {
    const match = expr.match(/each\s+(\w+)\s+as\s+(\w+)(?:\s*,\s*(\w+))?/);
    if (!match) throw new Error(`Invalid each expression: ${expr}`);
    return [match[1], match[2], match[3]];
  }

  static evaluateIf(condition, data) {
    const fn = new Function(...Object.keys(data), `return ${condition}`);
    try {
      return fn(...Object.values(data)) ? "" : "REMOVE";
    } catch {
      return "REMOVE";
    }
  }

  static evaluateEach(arrayExpr, itemName, indexName, data) {
    const array = this.getNestedProperty(data, arrayExpr);
    if (!Array.isArray(array)) return "REMOVE";

    return array
      .map((item, index) => {
        const loopContext = {
          ...data,
          [itemName]: item,
          ...(indexName ? { [indexName]: index } : {}),
        };
        return "START_LOOP" + JSON.stringify(loopContext) + "END_LOOP";
      })
      .join("");
  }

  static interpolateVariable(expr, data) {
    return this.getNestedProperty(data, expr.trim()) ?? "";
  }

  static getNestedProperty(obj, path) {
    return path
      .split(".")
      .reduce(
        (acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined),
        obj,
      );
  }

  static processTemplate(template, data) {
    let processed = this.render(template, data);
    while (processed.includes("START_LOOP") || processed.includes("{#")) {
      processed = this.render(processed, data);
    }
    processed = processed.replace(/REMOVE/g, "");
    processed = processed.replace(
      /START_LOOP(.*?)END_LOOP/g,
      (match, jsonContext) => {
        const loopContext = JSON.parse(jsonContext);
        return this.render(template, loopContext);
      },
    );
    processed = this.render(processed, data);

    return processed;
  }
}

// Separate function for rendering template
export function renderTemplate(templateString, data) {
  const div = document.createElement("div");
  div.innerHTML = Template.processTemplate(templateString, data);
  return div;
}
