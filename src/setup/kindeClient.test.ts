import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getApplicationExpressVersionESM } from "./kindeClient.js";

// Mock the fs module
vi.mock("fs", () => ({
  readFileSync: vi.fn(),
}));

describe("getApplicationExpressVersionESM", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset console.warn mock
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns Express version from package.json when found", async () => {
    // Import the mocked fs module
    const { readFileSync } = await import("fs");

    // Mock readFileSync to return valid package.json
    const mockPackageJson = {
      name: "express",
      version: "4.21.2",
    };
    (readFileSync as any).mockReturnValue(JSON.stringify(mockPackageJson));

    // This test verifies the method successfully finds and returns the Express version
    const result = getApplicationExpressVersionESM();

    // Validate semantic version format (e.g., 4.21.2, 5.0.0-beta.1, etc.)
    expect(result).toMatch(/^\d+\.\d+\.\d+(-.+)?$/);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("returns a string value", () => {
    // Test that the method always returns a string
    const result = getApplicationExpressVersionESM();

    expect(typeof result).toBe("string");
    expect(result).toBeDefined();
  });

  it("handles errors gracefully", async () => {
    // Import the mocked fs module
    const { readFileSync } = await import("fs");

    // Mock readFileSync to throw an error
    (readFileSync as any).mockImplementation(() => {
      throw new Error("Test error");
    });

    // Spy on console.warn
    const consoleWarnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => {});

    // Call the function and verify it doesn't throw
    expect(() => getApplicationExpressVersionESM()).not.toThrow();

    // Verify fallback behavior
    const result = getApplicationExpressVersionESM();
    expect(result).toBe("Unknown");
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "[SDK] Could not determine application's Express.js version: Test error",
      ),
    );

    // Restore mocks
    consoleWarnSpy.mockRestore();
  });
});
