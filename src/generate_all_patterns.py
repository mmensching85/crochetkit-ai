#!/usr/bin/env python3
"""
Generate ALL missing patterns by cross-referencing image files with existing data.
Appends new patterns to generate_patterns_json.py's patterns_data list.
"""
import json, os, re

def load_existing_ids():
    """Extract all pattern IDs from the existing generator."""
    with open('src/generate_patterns_json.py', 'r') as f:
        content = f.read()
    return set(re.findall(r'"id":\s*"([^"]+)"', content))

def load_image_ids():
    """Extract all pattern IDs from image filenames."""
    ids = set()
    pattern_dir = 'public/assets/patterns'
    if not os.path.isdir(pattern_dir):
        return ids
    for fname in os.listdir(pattern_dir):
        if fname.endswith('.webp'):
            pid = fname.replace('.webp', '')
            ids.add(pid)
    return ids

def categorize_patterns():
    existing = load_existing_ids()
    images = load_image_ids()
    # New = in images but not in existing patterns
    new_ids = images - existing
    # Also check that existing patterns actually cover these
    # Some images match partial IDs (pattern-scarf-bulky-001 vs pattern-bulky-scarf-002)
    new = sorted(new_ids)
    print(f"Existing pattern IDs: {len(existing)}")
    print(f"Image pattern IDs: {len(images)}")
    print(f"New pattern IDs to add: {len(new)}")
    
    # Group by category prefix
    groups = {}
    for pid in new:
        parts = pid.split('-')
        if len(parts) >= 3:
            cat = parts[1]  # e.g. 'accessories', 'baby', 'bulky'
            if len(parts) >= 4:
                sub = parts[2]
                key = f"{cat}-{sub}" if sub else cat
            else:
                key = cat
        else:
            key = 'other'
        groups.setdefault(key, []).append(pid)
    
    print("\nBy category:")
    for k, v in sorted(groups.items()):
        print(f"  {k}: {len(v)} patterns ({', '.join(v[:5])}{'...' if len(v)>5 else ''})")
    
    return new

if __name__ == '__main__':
    categorize_patterns()
