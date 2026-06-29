#!/usr/bin/env python3
"""Heuristic audit for complex datav-kit border element implementations."""

from __future__ import annotations

import argparse
import re
import sys
from difflib import SequenceMatcher
from pathlib import Path


Check = tuple[str, bool, str]


def count(pattern: str, text: str) -> int:
    return len(re.findall(pattern, text, flags=re.MULTILINE))


def extract_object_keys(name: str, text: str) -> tuple[str, ...]:
    match = re.search(rf"const\s+{re.escape(name)}\s*=\s*\{{(?P<body>.*?)\}}\s*satisfies", text, flags=re.DOTALL)
    if not match:
        return ()

    return tuple(re.findall(r"^\s*([a-zA-Z_$][\w$-]*)\s*:", match.group("body"), flags=re.MULTILINE))


def extract_canvas_signature(text: str) -> tuple[str, str] | None:
    match = re.search(
        r"const\s+contentViewBox[^=]*=\s*\{(?P<body>.*?)\}",
        text,
        flags=re.DOTALL,
    )
    if not match:
        return None

    body = match.group("body")
    width = re.search(r"\bwidth\s*:\s*([0-9.]+)", body)
    height = re.search(r"\bheight\s*:\s*([0-9.]+)", body)
    if not width or not height:
        return None

    return (width.group(1), height.group(1))


def extract_path_blocks(text: str) -> list[str]:
    path_blocks = re.findall(r"const\s+\w*Path\s*=\s*\[(.*?)\]\.join", text, flags=re.DOTALL)
    if not path_blocks:
        path_blocks = re.findall(r"<path[^>]+\bd=(?:\$\{)?([a-zA-Z_$][\w$]*)", text)

    return path_blocks


def extract_path_command_signature(text: str) -> str:
    signature_parts: list[str] = []
    for block in extract_path_blocks(text):
        signature_parts.append("".join(re.findall(r"[MmLlHhVvCcSsQqTtAaZz]", block)))

    return "|".join(signature_parts)


def extract_path_signature(text: str) -> str:
    signature_parts: list[str] = []
    for block in extract_path_blocks(text):
        commands = re.findall(r"[MmLlHhVvCcSsQqTtAaZz]", block)
        number_buckets = []
        for raw in re.findall(r"-?\d+(?:\.\d+)?", block):
            value = float(raw)
            number_buckets.append(str(int(value // 25)))
        signature_parts.append("".join(commands))
        signature_parts.append(",".join(number_buckets))

    return "|".join(signature_parts)


def jaccard(left: tuple[str, ...], right: tuple[str, ...]) -> float:
    left_set = set(left)
    right_set = set(right)
    if not left_set and not right_set:
        return 0.0

    return len(left_set & right_set) / len(left_set | right_set)


def similarity_warnings(path: Path, text: str, compare_paths: list[Path]) -> list[str]:
    target_fixed = extract_object_keys("fixedSlices", text)
    target_extensions = extract_object_keys("extensionSlices", text)
    target_canvas = extract_canvas_signature(text)
    target_command_signature = extract_path_command_signature(text)
    target_path_signature = extract_path_signature(text)

    warnings: list[str] = []
    seen: set[Path] = set()
    for compare_path in compare_paths:
        resolved = compare_path.resolve()
        if resolved in seen or resolved == path.resolve() or not compare_path.is_file():
            continue
        seen.add(resolved)

        other_text = compare_path.read_text(encoding="utf-8")
        other_fixed = extract_object_keys("fixedSlices", other_text)
        other_extensions = extract_object_keys("extensionSlices", other_text)
        other_canvas = extract_canvas_signature(other_text)
        other_command_signature = extract_path_command_signature(other_text)
        other_path_signature = extract_path_signature(other_text)

        fixed_overlap = jaccard(target_fixed, other_fixed)
        extension_overlap = jaccard(target_extensions, other_extensions)
        command_ratio = SequenceMatcher(None, target_command_signature, other_command_signature).ratio() if target_command_signature and other_command_signature else 0.0
        path_ratio = SequenceMatcher(None, target_path_signature, other_path_signature).ratio() if target_path_signature and other_path_signature else 0.0
        same_canvas = target_canvas is not None and target_canvas == other_canvas
        same_slice_counts = (
            bool(target_fixed)
            and bool(target_extensions)
            and len(target_fixed) == len(other_fixed)
            and len(target_extensions) == len(other_extensions)
        )

        if (
            path_ratio >= 0.88
            or command_ratio >= 0.94
            or (same_canvas and same_slice_counts and extension_overlap >= 0.8 and command_ratio >= 0.86)
        ):
            warnings.append(
                "High geometry similarity to "
                f"{compare_path}: path={path_ratio:.2f}, path-commands={command_ratio:.2f}, fixed-slices={fixed_overlap:.2f}, "
                f"extension-slices={extension_overlap:.2f}, same-canvas={same_canvas}. "
                "Review silhouette, module placement, and slice topology before accepting this as a new design."
            )

    return warnings


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
    parser.add_argument(
        "--compare",
        type=Path,
        nargs="*",
        default=[],
        help="Existing border element.ts files to compare for path and slice-topology similarity.",
    )
    args = parser.parse_args()

    checks, warnings = audit(args.element)
    if args.compare:
        text = args.element.read_text(encoding="utf-8")
        warnings.extend(similarity_warnings(args.element, text, args.compare))
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
