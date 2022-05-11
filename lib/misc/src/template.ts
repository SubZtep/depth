/**
 * CSS variable setter.
 * @param selector - The HTML Element that matches selectors holds the property.
 * @returns Currying the property name then the value.
 */
export function cssProperty(selector: string) {
  const el = document.querySelector<HTMLElement>(selector)
  if (!el) throw new Error(`Unknown element for ${selector}`)
  return (property: string) =>
    (value: string, important = false) => {
      const priority = important ? "important" : undefined
      el.style.setProperty(property, value, priority)
    }
}

/**
 * Activate template.
 * @param templateSelector - The origin HTML template element.
 * @param containerSelector - Query for template placement.
 */
export function setMarkup(templateSelector: string, containerSelector: string) {
  const template = document.querySelector<HTMLTemplateElement>(templateSelector)
  const container = document.querySelector<HTMLElement>(containerSelector)
  if (!template || !container) throw new Error(`Unkown ${templateSelector} + ${containerSelector} selectors.`)
  container.replaceWith(template.content.cloneNode(true))
}
