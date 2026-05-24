import "@testing-library/jest-dom";
import "@/lib/i18n";

// jsdom doesn't implement matchMedia by default; provide a noop.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// SpeechSynthesis stub for VoiceAssistant tests.
Object.defineProperty(window, "speechSynthesis", {
  writable: true,
  value: {
    cancel: () => {},
    speak: () => {},
    getVoices: () => [],
  },
});

// IntersectionObserver stub used by framer-motion viewport triggers.
class MockIO {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: MockIO,
});

if (typeof (globalThis as { ResizeObserver?: unknown }).ResizeObserver === "undefined") {
  class MockRO {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver = MockRO;
}
