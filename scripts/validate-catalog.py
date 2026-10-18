"""Validate the existing catalog structure without asserting plugin compatibility."""
from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
catalog = json.loads((root / "catalog.json").read_text(encoding="utf-8"))
if not isinstance(catalog, dict) or not isinstance(catalog.get("plugins"), list):
    raise SystemExit("catalog.json must contain a plugins array")
names = set()
for index, plugin in enumerate(catalog["plugins"]):
    if not isinstance(plugin, dict):
        raise SystemExit(f"plugins[{index}] must be an object")
    for field in ("name", "desc", "repo", "tag"):
        if not isinstance(plugin.get(field), str):
            raise SystemExit(f"plugins[{index}].{field} must be a string")
    if not plugin["name"] or plugin["name"] in names:
        raise SystemExit(f"Missing or duplicate plugin name at index {index}")
    names.add(plugin["name"])
print(f"Validated {len(names)} legacy entries; artifact and runtime compatibility are unqualified.")
