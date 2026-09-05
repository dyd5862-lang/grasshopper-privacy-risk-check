// The restricted build-verification workspace omits /proc, causing Node's
// process.memoryUsage() to throw ENOENT before Next.js can compile. Preserve
// normal behavior everywhere else and only return neutral telemetry values for
// that one unavailable system metric.
const originalMemoryUsage = process.memoryUsage.bind(process);
const originalRss = process.memoryUsage.rss.bind(process.memoryUsage);

function isMissingProc(error) {
  return error && typeof error === "object" && error.code === "ENOENT";
}

function safeMemoryUsage() {
  try {
    return originalMemoryUsage();
  } catch (error) {
    if (!isMissingProc(error)) throw error;
    return { rss: 0, heapTotal: 0, heapUsed: 0, external: 0, arrayBuffers: 0 };
  }
}

safeMemoryUsage.rss = function safeRss() {
  try {
    return originalRss();
  } catch (error) {
    if (!isMissingProc(error)) throw error;
    return 0;
  }
};

Object.defineProperty(process, "memoryUsage", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: safeMemoryUsage,
});
