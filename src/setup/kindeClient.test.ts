import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getApplicationExpressVersionESM } from "./kindeClient.js";

describe("getApplicationExpressVersionESM", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset console.warn mock
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns Express version from package.json when found", () => {
    // This test verifies the method successfully finds and returns the Express version
    const result = getApplicationExpressVersionESM();

    expect(result).toBe("4.21.2");
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("returns a string value", () => {
    // Test that the method always returns a string
    const result = getApplicationExpressVersionESM();
    
    expect(typeof result).toBe("string");
    expect(result).toBeDefined();
  });

  it("handles errors gracefully", () => {
    // Test that the method doesn't throw errors and handles them gracefully
    expect(() => getApplicationExpressVersionESM()).not.toThrow();
  });
});
