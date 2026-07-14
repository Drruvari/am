/// <reference types="vite/client" />

declare module '*.html?raw' {
  const content: string
  export default content
}

declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.webp' {
  const content: string
  export default content
}

declare module 'split-type' {
  export default class SplitType {
    constructor(
      target: Element | Element[],
      options?: { types?: string; tagName?: string },
    )
    chars: Element[] | null
    words: Element[] | null
    lines: Element[] | null
    revert(): void
  }
}
