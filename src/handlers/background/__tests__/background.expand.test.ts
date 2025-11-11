// b_path:: src/handlers/background/__tests__/background.expand.test.ts
import { describe, expect, it } from "vitest";
import { backgroundHandler } from "../expand";

describe("background expand", () => {
  it("url(/testSite/wp-content/themes/BareBones/images/bg3.png) no-repeat center center fixed", () => {
    const result = backgroundHandler.expand(
      "url(/testSite/wp-content/themes/BareBones/images/bg3.png) no-repeat center center fixed"
    );
    expect(result).toEqual({
      "background-image": "url(/testSite/wp-content/themes/BareBones/images/bg3.png)",
      "background-position": "center center",
      "background-size": "auto auto",
      "background-repeat": "no-repeat",
      "background-attachment": "fixed",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    });
  });

  it("scroll", () => {
    const result = backgroundHandler.expand("scroll");
    expect(result).toEqual({
      "background-image": "none",
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    });
  });

  it("content-box", () => {
    const result = backgroundHandler.expand("content-box");
    expect(result).toEqual({
      "background-image": "none",
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "content-box",
      "background-clip": "content-box",
      "background-color": "transparent",
    });
  });

  it("url( image.png )", () => {
    const result = backgroundHandler.expand("url( image.png )");
    expect(result).toEqual({
      "background-image": "url(image.png)",
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    });
  });

  it("no-repeat repeat", () => {
    const result = backgroundHandler.expand("no-repeat repeat");
    expect(result).toEqual({
      "background-image": "none",
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-repeat": "no-repeat repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    });
  });

  it("rgba(128, 64, 128, 1)", () => {
    const result = backgroundHandler.expand("rgba(128, 64, 128, 1)");
    expect(result).toEqual({
      "background-image": "none",
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "rgba(128,64,128,1)",
    });
  });

  it("left 10px", () => {
    const result = backgroundHandler.expand("left 10px");
    expect(result).toEqual({
      "background-image": "none",
      "background-position": "left 10px",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    });
  });

  it("10% / auto 10px", () => {
    const result = backgroundHandler.expand("10% / auto 10px");
    expect(result).toEqual({
      "background-image": "none",
      "background-position": "10%",
      "background-size": "auto 10px",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    });
  });

  it("fixed padding-box url(image.png) rgb(255, 255, 0) 10px top / cover repeat-x", () => {
    const result = backgroundHandler.expand(
      "fixed padding-box url(image.png) rgb(255, 255, 0) 10px top / cover repeat-x"
    );
    expect(result).toEqual({
      "background-image": "url(image.png)",
      "background-position": "10px top",
      "background-size": "cover",
      "background-repeat": "repeat-x",
      "background-attachment": "fixed",
      "background-origin": "padding-box",
      "background-clip": "padding-box",
      "background-color": "rgb(255,255,0)",
    });
  });

  it("url(image.png) no-repeat center/cover #f0f8ff content-box", () => {
    const result = backgroundHandler.expand(
      "url(image.png) no-repeat center/cover #f0f8ff content-box"
    );
    expect(result).toEqual({
      "background-image": "url(image.png)",
      "background-position": "center",
      "background-size": "cover",
      "background-repeat": "no-repeat",
      "background-attachment": "scroll",
      "background-origin": "content-box",
      "background-clip": "content-box",
      "background-color": "#f0f8ff",
    });
  });

  it("inherit", () => {
    const result = backgroundHandler.expand("inherit");
    expect(result).toEqual({
      "background-image": "none",
      "background-position": "0% 0%",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    });
  });

  it("conic-gradient(at 83.333333% 33.333333%, #999999 0 120deg, #0000 0), conic-gradient(from -120deg at 16.666667% 33.333333%, #cdcbcc 0 120deg, #0000 0), conic-gradient(from 120deg at 33.333333% 83.333333%, #f2f2f2 0 120deg, #0000 0), conic-gradient(from 120deg at 66.666667% 83.333333%, #f2f2f2 0 120deg, #0000 0), conic-gradient(from -180deg at 33.333333% 50%, #cdcbcc 60deg, #f2f2f2 0 120deg, #0000 0), conic-gradient(from 60deg at 66.666667% 50%, #f2f2f2 60deg, #999999 0 120deg, #0000 0), conic-gradient(from -60deg at 50% 33.333333%, #f2f2f2 120deg, #cdcbcc 0 240deg, #999999 0)", () => {
    const result = backgroundHandler.expand(
      "conic-gradient(at 83.333333% 33.333333%, #999999 0 120deg, #0000 0), conic-gradient(from -120deg at 16.666667% 33.333333%, #cdcbcc 0 120deg, #0000 0), conic-gradient(from 120deg at 33.333333% 83.333333%, #f2f2f2 0 120deg, #0000 0), conic-gradient(from 120deg at 66.666667% 83.333333%, #f2f2f2 0 120deg, #0000 0), conic-gradient(from -180deg at 33.333333% 50%, #cdcbcc 60deg, #f2f2f2 0 120deg, #0000 0), conic-gradient(from 60deg at 66.666667% 50%, #f2f2f2 60deg, #999999 0 120deg, #0000 0), conic-gradient(from -60deg at 50% 33.333333%, #f2f2f2 120deg, #cdcbcc 0 240deg, #999999 0)"
    );
    expect(result).toEqual({
      "background-image":
        "conic-gradient(at 83.333333% 33.333333%,#999999 0 120deg,#0000 0), conic-gradient(from -120deg at 16.666667% 33.333333%,#cdcbcc 0 120deg,#0000 0), conic-gradient(from 120deg at 33.333333% 83.333333%,#f2f2f2 0 120deg,#0000 0), conic-gradient(from 120deg at 66.666667% 83.333333%,#f2f2f2 0 120deg,#0000 0), conic-gradient(from -180deg at 33.333333% 50%,#cdcbcc 60deg,#f2f2f2 0 120deg,#0000 0), conic-gradient(from 60deg at 66.666667% 50%,#f2f2f2 60deg,#999999 0 120deg,#0000 0), conic-gradient(from -60deg at 50% 33.333333%,#f2f2f2 120deg,#cdcbcc 0 240deg,#999999 0)",
      "background-position": "0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%",
      "background-size":
        "auto auto, auto auto, auto auto, auto auto, auto auto, auto auto, auto auto",
      "background-repeat": "repeat, repeat, repeat, repeat, repeat, repeat, repeat",
      "background-attachment": "scroll, scroll, scroll, scroll, scroll, scroll, scroll",
      "background-origin":
        "padding-box, padding-box, padding-box, padding-box, padding-box, padding-box, padding-box",
      "background-clip":
        "border-box, border-box, border-box, border-box, border-box, border-box, border-box",
      "background-color": "transparent",
    });
  });

  it("url('https://example.com/image1.png') top left / 50% auto no-repeat fixed content-box padding-box", () => {
    const result = backgroundHandler.expand(
      "url('https://example.com/image1.png') top left / 50% auto no-repeat fixed content-box padding-box"
    );
    expect(result).toEqual({
      "background-image": "url(https://example.com/image1.png)",
      "background-position": "top left",
      "background-size": "50% auto",
      "background-repeat": "no-repeat",
      "background-attachment": "fixed",
      "background-origin": "content-box",
      "background-clip": "padding-box",
      "background-color": "transparent",
    });
  });

  // CSS Functions support
  it("url(img.png) calc(100% - 20px) center", () => {
    const result = backgroundHandler.expand("url(img.png) calc(100% - 20px) center");
    expect(result).toEqual({
      "background-image": "url(img.png)",
      "background-position": "calc(100% - 20px) center",
      "background-size": "auto auto",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    });
  });

  it("url(a.png) center, url(b.png) var(--pos)", () => {
    const result = backgroundHandler.expand("url(a.png) center, url(b.png) var(--pos)");
    expect(result).toEqual({
      "background-image": "url(a.png), url(b.png)",
      "background-position": "center, var(--pos)",
      "background-size": "auto auto, auto auto",
      "background-repeat": "repeat, repeat",
      "background-attachment": "scroll, scroll",
      "background-origin": "padding-box, padding-box",
      "background-clip": "border-box, border-box",
      "background-color": "transparent",
    });
  });

  it("calc(100% - 10px) / min(50%, 200px)", () => {
    const result = backgroundHandler.expand("calc(100% - 10px) / min(50%, 200px)");
    expect(result).toEqual({
      "background-image": "none",
      "background-position": "calc(100% - 10px)",
      "background-size": "min(50%,200px)",
      "background-repeat": "repeat",
      "background-attachment": "scroll",
      "background-origin": "padding-box",
      "background-clip": "border-box",
      "background-color": "transparent",
    });
  });
});
