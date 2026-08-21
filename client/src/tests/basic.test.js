import { describe, it, expect } from "vitest";

import { add } from "../utils/math.js";


describe("add()", () => {

    it("should add two positive numbers", () => {
        expect(add(2, 3)).toBe(5);
    });

    it("should add negative numbers", () => {
        expect(add(-2, -3)).toBe(-5);
    });

    it("should add zero", () => {
        expect(add(5, 0)).toBe(5);
    });

});