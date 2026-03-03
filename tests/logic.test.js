import { describe, it, expect } from "vitest";
import { safeCalculate, calculateTotal } from "../index.js";

describe("Calculation Logic", () => {
    describe("safeCalculate", () => {
        it("should parse simple numbers", () => {
            expect(safeCalculate("100")).toBe(100);
            expect(safeCalculate("50.5")).toBe(50.5);
        });

        it("should parse basic arithmetic", () => {
            expect(safeCalculate("100+200")).toBe(300);
            expect(safeCalculate("10*5")).toBe(50);
            expect(safeCalculate("10-5")).toBe(5);
            expect(safeCalculate("100/4")).toBe(25);
        });

        it("should handle mixed expressions with parentheses", () => {
            expect(safeCalculate("(10+20)*2")).toBe(60);
        });

        it("should sanitize non-numeric input", () => {
            expect(safeCalculate("Coffee 50")).toBe(50);
            expect(safeCalculate("Snack 20 + 30")).toBe(50);
        });

        it("should return NaN for invalid expressions", () => {
            expect(safeCalculate("")).toBe(NaN);
            expect(safeCalculate("abc")).toBe(NaN);
            expect(safeCalculate("1/0")).toBe(NaN);
        });

        it("should handle floating point precision adequately", () => {
            expect(safeCalculate("0.1+0.2")).toBeCloseTo(0.3);
        });
    });

    describe("calculateTotal", () => {
        it("should sum multiple valid lines", () => {
            const input = "100\n200+50\nSnack 30";
            expect(calculateTotal(input)).toBe(380);
        });

        it("should ignore empty or invalid lines", () => {
            const input = "100\n\nInvalid\n50";
            expect(calculateTotal(input)).toBe(150);
        });

        it("should return NaN if no lines are valid", () => {
            const input = "Hello\nWorld";
            expect(calculateTotal(input)).toBe(NaN);
        });

        it("should handle CRLF line endings", () => {
            const input = "10\r\n20";
            expect(calculateTotal(input)).toBe(30);
        });
    });

    describe("Precision Handling (Cents)", () => {
        it("should correctly round floating point issues when converting to cents", () => {
            // This replicates the logic inside processAndSendMessage
            const amount = 0.1 + 0.2; // 0.30000000000000004
            const deltaInCents = Math.round(amount * 100);
            expect(deltaInCents).toBe(30);
        });
    });
});
