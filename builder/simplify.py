#!/bin/python3

import sys
import re
from pathlib import Path

from eprint import eprint

edges = {}
fo = Path('obj/Federation.obj')
with fo.open('r') as f:
    eprint(f"Working on {fo.name}")

    eprint(f"Building list of edges")
    for line in f:
        match = re.match(r'f (\d+)/\d+/\d+ (\d+)/\d+/\d+ (\d+)/\d+/\d+', line)
        if not match:
            continue
        indices = [int(v) for v in match.groups()]
        indices.sort()  # ensure a consistent order
        for edge in [(indices[0], indices[1]), (indices[1], indices[2]), (indices[0], indices[2])]:
            edges[edge] = edges.get(edge, 0) + 1
    eprint(f"Found {len(edges)} edges")

    eprint(f"Eliminating common edges")
    edges = [edge for edge, count in edges.items() if count == 1]
    eprint(f"Found {len(edges)} lone edges")
    eprint(edges)

    eprint(f"Constructing polygons")
    polys = []
    while len(edges) > 0:
        actions = 0
        poly = [edges.pop(0)]
        found = True
        while found:
            found = False
            eprint(f"Polygon is {poly}")
            eprint(f"Working on edge {poly[len(poly) - 1]}, so looking for partner ({poly[len(poly) - 1][1]}, ?)")
            for i in range(0, len(edges)):
                if edges[i][0] == poly[len(poly) - 1][1]:
                    poly.append(edges[i])
                    del(edges[i])
                    found = True
                    actions += 1
                    break
        eprint(f"Adding polygon to features")
        polys.append(poly)
        if actions == 0:
            break
    eprint(f"Finished, remaining edges are {edges}")
