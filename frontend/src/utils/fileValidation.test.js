import { describe, it, expect } from "vitest";
import { isPDF, filterPDFs, validatePDF } from "./fileValidation";

describe("fileValidation", () => {
  describe("isPDF", () => {
    it("returns true for PDF file with correct MIME type", () => {
      const file = new File([], "test.pdf", { type: "application/pdf" });
      expect(isPDF(file)).toBe(true);
    });

    it("returns true for PDF file with .pdf extension", () => {
      const file = new File([], "test.pdf", { type: "" });
      expect(isPDF(file)).toBe(true);
    });

    it("returns false for non-PDF file", () => {
      const file = new File([], "test.doc", { type: "application/msword" });
      expect(isPDF(file)).toBe(false);
    });
  });

  describe("filterPDFs", () => {
    it("filters out non-PDF files", () => {
      const files = [
        new File([], "test1.pdf", { type: "application/pdf" }),
        new File([], "test2.doc", { type: "application/msword" }),
        new File([], "test3.pdf", { type: "application/pdf" }),
      ];
      const result = filterPDFs(files);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("test1.pdf");
      expect(result[1].name).toBe("test3.pdf");
    });
  });

  describe("validatePDF", () => {
    it("returns null for valid PDF", () => {
      const file = new File([], "test.pdf", { type: "application/pdf" });
      expect(validatePDF(file)).toBeNull();
    });

    it("returns error message for invalid PDF", () => {
      const file = new File([], "test.doc", { type: "application/msword" });
      const result = validatePDF(file);
      expect(result).toContain("is not a PDF file");
    });
  });
});

