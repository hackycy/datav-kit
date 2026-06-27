#!/usr/bin/env python3
"""Create an SVG crop by replacing the root dimensions and viewBox."""

from __future__ import annotations

import argparse
import re
from pathlib import Path


def crop_svg(source: Path, output: Path, viewbox: str, width: float, height: float, strip_background: bool) -> None:
    text = source.read_text(encoding="utf-8")
    svg_match = re.search(r"<svg\b([^>]*)>", text)
    if not svg_match:
        raise SystemExit(f"No <svg> root found in {source}")

    attrs = svg_match.group(1)
    attrs = re.sub(r'\swidth="[^"]*"', "", attrs)
    attrs = re.sub(r"\swidth='[^']*'", "", attrs)
    attrs = re.sub(r'\sheight="[^"]*"', "", attrs)
    attrs = re.sub(r"\sheight='[^']*'", "", attrs)
    attrs = re.sub(r'\sviewBox="[^"]*"', "", attrs)
    attrs = re.sub(r"\sviewBox='[^']*'", "", attrs)
    replacement = f'<svg{attrs} width="{format_number(width)}" height="{format_number(height)}" viewBox="{viewbox}">'
    text = f"{text[:svg_match.start()]}{replacement}{text[svg_match.end():]}"

    if strip_background:
        text = re.sub(r"\n?\s*<rect\b[^>]*(?:width=\"100%\"|width=\"[0-9.]+\")[^>]*/>", "", text, count=8)

    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(text, encoding="utf-8")


def format_number(value: float) -> str:
    return str(int(value)) if value.is_integer() else str(value)


def main() -> None:
    parser = argparse.ArgumentParser(description="Crop an SVG by replacing root viewBox and output dimensions.")
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--viewbox", required=True, help='New viewBox, for example "1320 735 304 145".')
    parser.add_argument("--width", type=float, required=True)
    parser.add_argument("--height", type=float, required=True)
    parser.add_argument("--keep-background", action="store_true", help="Keep root background rectangles.")
    args = parser.parse_args()

    crop_svg(
        source=args.source,
        output=args.output,
        viewbox=args.viewbox,
        width=args.width,
        height=args.height,
        strip_background=not args.keep_background,
    )


if __name__ == "__main__":
    main()
