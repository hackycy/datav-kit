#!/usr/bin/env python3
"""Heuristic audit for complex datav-kit border element implementations."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


Check = tuple[str, bool, str]


def count(pattern: str, text: str) -> int:
    return len(re.findall(pattern, text, flags=re.MULTILINE))


def audit(path: Path) -> tuple[list[Check], list[str]]:
    text = path.read_text(encoding="utf-8")
    lower = text.lower()

    visible_primitives = (
        count(r"<\s*(?:path|circle|rect|polygon|polyline|line)\b", text)
        + count(r"\bsvg`\s*<g", text)
        + count(r"\b[a-zA-Z0-9]+Path\b", text)
    )
    defs = count(r"<\s*(?:filter|linearGradient|radialGradient|clipPath|mask|symbol)\b", text)
    blurs = count(r"<\s*feGaussianBlur\b", text)

    has_safe_content = "contentRect" in text and (
        "createBorderBoxContentPadding" in text
        or "createContentPadding" in text
        or re.search(r"contentRect\.(?:x|y|width|height)", text) is not None
    )

    checks: list[Check] = [
        ("datav-element", "extends DatavElement" in text, "class should extend DatavElement"),
        ("resize-controller", "ResizeController" in text, "responsive border should observe host size"),
        ("fixed-slices", "fixedSlices" in text or "renderFixed" in text, "complex modules should be fixed"),
        ("extension-slices", "extensionSlices" in text or "renderExtension" in text, "clean strips should extend"),
        ("safe-content", has_safe_content, "content padding should use a measured safe area"),
        ("unique-svg-ids", "instanceId" in text and re.search(r"`dv-border-box-[^`]*\$\{this\.instanceId\}", text) is not None, "SVG ids should be instance-scoped"),
        ("three-color-roles", all(token in text for token in ("secondaryColor", "accentColor", "colors")), "complex neon borders should expose primary, secondary, accent, and colors"),
        ("glow-control", "glowIntensity" in text and ("resolveNumberValue" in text or "Number" in text), "glow intensity should be configurable"),
        ("svg-defs", defs >= 3, f"expected at least 3 SVG defs, found {defs}"),
        ("blur-glow", blurs >= 1 and ("filter" in lower or "glow" in lower), f"expected blur/filter glow, found {blurs} blur nodes"),
        ("visual-density", visible_primitives >= 25, f"expected at least 25 visible primitives/path references, found {visible_primitives}"),
        ("parts", all(part in text for part in ('part="frame"', 'part="graphic"', 'part="content"')), "frame, graphic, and content parts should be exposed"),
    ]

    warnings: list[str] = []
    if re.search(r"<svg[^>]+preserveAspectRatio=\{?['\"]none['\"]", text, flags=re.DOTALL):
        warnings.append("Found preserveAspectRatio='none' on an SVG; confirm it is only used for clean extension strips.")
    if "prefers-reduced-motion" not in text and ("<animate" in text or "repeatCount=\"indefinite\"" in text):
        warnings.append("Animation found without prefers-reduced-motion handling.")
    if "fixedSlices" not in text and visible_primitives < 45:
        warnings.append("No fixedSlices constant found; ensure fixed modules are still explicit and not just a live-size outline.")

    return checks, warnings


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("element", type=Path, help="Path to a border-box element.ts file")
    args = parser.parse_args()

    checks, warnings = audit(args.element)
    failed = [check for check in checks if not check[1]]

    for name, ok, message in checks:
        status = "PASS" if ok else "FAIL"
        print(f"{status} {name}: {message}")

    for warning in warnings:
        print(f"WARN {warning}")

    if failed:
        print(f"\n{len(failed)} check(s) failed.", file=sys.stderr)
        return 1

    print("\nAll complexity checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
