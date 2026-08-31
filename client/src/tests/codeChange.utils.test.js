import { describe, expect, it } from "vitest";
import { isValidCodeChange } from "../utils/codeChange.utils.js";

describe("codeChange.utils.js", () => {

    it("accepts a real code change", () => {
        expect(
            isValidCodeChange({
                originalCode: "const name = 'Dhiraj';",
                proposedCode: "const name = 'Developer';",
            })
        ).toBe(true);
    });

    it("rejects an empty proposed change", () => {
        expect(
            isValidCodeChange({
                originalCode: "const name = 'Dhiraj';",
                proposedCode: "",
            })
        ).toBe(false);
    });

    it("rejects an empty original file", () => {
        expect(
            isValidCodeChange({
                originalCode: "",
                proposedCode: "const name = 'Developer';",
            })
        ).toBe(false);
    });

    it("rejects unchanged code", () => {
        expect(
            isValidCodeChange({
                originalCode: "const name = 'Dhiraj';",
                proposedCode: "const name = 'Dhiraj';",
            })
        ).toBe(false);
    });
});