type Cleanup = () => void

const cleanups: Cleanup[] = []

export function addCleanup(cleanup: Cleanup) {
  cleanups.push(cleanup)
}

export function runCleanups() {
  while (cleanups.length) {
    cleanups.pop()?.()
  }
}
