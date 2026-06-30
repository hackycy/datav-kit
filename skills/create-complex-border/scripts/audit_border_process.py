#!/usr/bin/env python3
"""Audit required process artifacts for Datav-kit border design work."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


REQUIRED_SECTIONS = (
    "User Constraints",
    "Task Type",
    "Design Goal",
    "Dashboard Story",
    "First-Read Promise",
    "Rejected Patterns",
    "Existing Border Inventory",
    "Candidate Concepts",
    "Selected Concept",
    "Geometry Difference Score",
    "Content Safe Area",
    "Responsive Model",
    "Visual Language",
    "Motion Budget",
    "Public API Contract",
    "Implementation Contract",
    "Aesthetic Gate",
    "Validation Evidence",
)

REPAIR_SECTIONS = (
    "Failure Diagnosis",
    "Compatibility Contract",
)

FORBIDDEN_MOTIFS = (
    "crown",
    "shield",
    "badge",
    "crest",
    "portal",
    "reactor",
    "cockpit",
    "gate",
    "scanner",
    "aperture",
    "armor",
)

VALIDATION_TERMS = (
    "source-ratio",
    "wide",
    "tall",
    "small",
    "dashboard content",
    "safe-area",
    "cross-slice",
)


def section_exists(text: str, section: str) -> bool:
    return re.search(rf"^##\s+{re.escape(section)}\s*$", text, flags=re.MULTILINE) is not None


def section_body(text: str, section: str) -> str:
    match = re.search(
        rf"^##\s+{re.escape(section)}\s*$(?P<body>.*?)(?=^##\s+|\Z)",
        text,
        flags=re.MULTILINE | re.DOTALL,
    )
    return match.group("body") if match else ""


def task_type(text: str) -> str:
    body = section_body(text, "Task Type").lower()
    match = re.search(r"type\s*:\s*([a-z/-]+)", body)
    return match.group(1) if match else ""


def candidate_count(text: str) -> int:
    body = section_body(text, "Candidate Concepts")
    return len(re.findall(r"^###\s+Candidate\s+[A-Z]", body, flags=re.MULTILINE))


def expected_candidate_count(text: str) -> int:
    kind = task_type(text)
    constraints = section_body(text, "User Constraints").lower()
    explicit_direction = "explicit direction:" in constraints and not re.search(
        r"explicit direction:\s*(?:none|n/a|no|)$",
        constraints,
        flags=re.MULTILINE,
    )
    if explicit_direction:
        return 1
    if kind == "variant":
        return 2
    if kind in {"original", "repair/redesign", "repair"}:
        return 3
    return 0


def has_allowed_risky_motifs(text: str) -> bool:
    constraints = section_body(text, "User Constraints")
    match = re.search(r"explicitly allowed risky motifs\s*:\s*(.+)", constraints, flags=re.IGNORECASE)
    if not match:
        return False
    value = match.group(1).strip().lower()
    return bool(value) and value not in {"none", "n/a", "no"}


def has_live_size_geometry(element_text: str) -> bool:
    if not element_text:
        return False
    live_viewbox = "viewBox=${`0 0 ${width} ${height}`}" in element_text
    host_products = len(re.findall(r"\b(?:width|height)\s*\*\s*0\.\d+", element_text)) >= 3
    geometry_factory = "createGeometry" in element_text and "ResizeController" in element_text
    return live_viewbox or (geometry_factory and host_products)


def referenced_images(text: str) -> list[str]:
    return re.findall(r"\S+\.(?:png|jpg|jpeg|webp|gif)", text, flags=re.IGNORECASE)


def inventory_has_entry(inventory_path: Path, tag_name: str) -> bool:
    if not inventory_path.is_file():
        return False
    return tag_name in inventory_path.read_text(encoding="utf-8")


def check_process(component_dir: Path, inventory_path: Path) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []

    brief_path = component_dir / "design-brief.md"
    element_path = component_dir / "element.ts"

    if not brief_path.is_file():
        return [f"Missing required design brief: {brief_path}"], warnings

    text = brief_path.read_text(encoding="utf-8")
    lower = text.lower()

    for section in REQUIRED_SECTIONS:
        if not section_exists(text, section):
            errors.append(f"Missing required section: {section}")

    kind = task_type(text)
    if kind in {"repair/redesign", "repair"}:
        for section in REPAIR_SECTIONS:
            if not section_exists(text, section):
                errors.append(f"Missing repair/redesign section: {section}")

    expected = expected_candidate_count(text)
    actual = candidate_count(text)
    if expected and actual < expected:
        errors.append(f"Expected at least {expected} candidate concept(s), found {actual}")

    found_motifs = sorted({word for word in FORBIDDEN_MOTIFS if re.search(rf"\b{word}\b", lower)})
    if found_motifs and not has_allowed_risky_motifs(text):
        warnings.append(f"Forbidden/risky motif words found without explicit user allowance: {', '.join(found_motifs)}")

    image_refs = referenced_images(text)
    if image_refs:
        errors.append("Design brief must not reference committed image evidence: " + ", ".join(sorted(set(image_refs))))

    for image_dir_name in ("visual-review", "screenshots"):
        if (component_dir / image_dir_name).exists():
            errors.append(f"Do not commit visual evidence directory: {component_dir / image_dir_name}")

    validation_body = section_body(text, "Validation Evidence").lower()
    for term in VALIDATION_TERMS:
        if term not in validation_body:
            errors.append(f"Validation Evidence must mention manual {term} check")
    if re.search(r"\b(?:pending|tbd|todo|not checked|not yet)\b", validation_body):
        errors.append("Validation Evidence contains pending/TBD language; complete manual validation before accepting the border")

    if "revise" in section_body(text, "Aesthetic Gate").lower():
        errors.append("Aesthetic Gate contains `revise`; rework before accepting the border")

    if element_path.is_file() and has_live_size_geometry(element_path.read_text(encoding="utf-8")):
        if not section_exists(text, "Live-Size Exception"):
            errors.append("Live-size geometry detected in element.ts but `Live-Size Exception` section is missing")

    match = re.search(r"border-box-(\d+)", str(component_dir))
    if match:
        tag_name = f"dvk-border-box-{match.group(1)}"
        if inventory_path and not inventory_has_entry(inventory_path, tag_name):
            errors.append(f"Family inventory missing entry for {tag_name}: {inventory_path}")

    return errors, warnings


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("component_dir", type=Path, help="Path to packages/elements/src/border-box-N")
    parser.add_argument(
        "--inventory",
        type=Path,
        default=Path("skills/create-complex-border/references/border-family-inventory.md"),
        help="Path to border-family-inventory.md",
    )
    args = parser.parse_args()

    errors, warnings = check_process(args.component_dir, args.inventory)

    for warning in warnings:
        print(f"WARN {warning}")
    for error in errors:
        print(f"FAIL {error}")

    if errors:
        print(f"\n{len(errors)} process check(s) failed.", file=sys.stderr)
        return 1

    print("PASS border process artifacts")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
