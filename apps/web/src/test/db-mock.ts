// Drizzle query builders are thenable objects where every chained method
// (.where(), .set(), .returning(), .limit(), ...) returns another thenable.
// This builds a minimal stand-in: any method call returns the same chain,
// and awaiting the chain at any point resolves to `result`.
export function dbChain<T>(result: T) {
  const target = {
    then: (resolve: (value: T) => unknown, reject?: (reason: unknown) => unknown) =>
      Promise.resolve(result).then(resolve, reject),
    catch: (fn: (reason: unknown) => unknown) => Promise.resolve(result).catch(fn),
    finally: (fn: () => void) => Promise.resolve(result).finally(fn),
  }
  const proxy: unknown = new Proxy(target, {
    get(obj, prop, receiver) {
      if (Reflect.has(obj, prop)) return Reflect.get(obj, prop, receiver)
      return () => proxy
    },
  })
  return proxy as Promise<T> & Record<string, (...args: unknown[]) => unknown>
}
