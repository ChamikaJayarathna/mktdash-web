import { describe, expect, it } from "vitest";
import {
  countImages,
  countLinks,
  htmlToPlainText,
  isEmptyEditorHtml,
} from "./htmlToPlainText";

describe("htmlToPlainText", () => {
  it("turns block elements into line breaks", () => {
    expect(htmlToPlainText("<p>Hi Marcus,</p><p>Worth a look?</p>")).toBe(
      "Hi Marcus,\nWorth a look?",
    );
  });

  it("keeps link targets so the text part is still actionable", () => {
    expect(
      htmlToPlainText('<p>See the <a href="https://x.com/deck">deck</a>.</p>'),
    ).toBe("See the deck (https://x.com/deck).");
  });

  it("falls back to the href alone when the anchor has no text", () => {
    expect(htmlToPlainText('<a href="https://x.com"></a>')).toBe(
      "https://x.com",
    );
  });

  it("represents images by their alt text", () => {
    expect(htmlToPlainText('<p><img src="a.png" alt="Q3 chart"></p>')).toBe(
      "[Q3 chart]",
    );
  });

  it("marks list items", () => {
    expect(htmlToPlainText("<ul><li>First</li><li>Second</li></ul>")).toBe(
      "- First\n- Second",
    );
  });

  it("decodes entities and collapses runs of blank lines", () => {
    expect(
      htmlToPlainText("<p>Ben &amp; Co</p><p></p><p></p><p>Ends</p>"),
    ).toBe("Ben & Co\n\nEnds");
  });

  it("drops script and style content entirely", () => {
    expect(htmlToPlainText("<p>Safe</p><script>alert(1)</script>")).toBe(
      "Safe",
    );
  });
});

describe("countLinks and countImages", () => {
  it("counts anchors with an href", () => {
    expect(countLinks('<a href="a">a</a><a href="b">b</a><a>c</a>')).toBe(2);
  });

  it("counts images", () => {
    expect(countImages('<img src="a"><img src="b">')).toBe(2);
  });
});

describe("isEmptyEditorHtml", () => {
  it("treats an empty paragraph as empty", () => {
    expect(isEmptyEditorHtml("<p></p>")).toBe(true);
  });

  it("does not treat an image-only body as empty", () => {
    expect(isEmptyEditorHtml('<p><img src="a.png"></p>')).toBe(false);
  });
});
