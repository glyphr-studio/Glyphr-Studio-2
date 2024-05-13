# Bezier Data Format

### Point

simple x/y object

`{x: Number, y: Number}`

### Bezier curve (Collection of 2 or 4 points)

'Regular' Bezier curve notation

`[point0, point1, point2, point3]`

or straight lines have no point1 or point2

`[point0, false, false, point3]`

### Path (collection of Bezier curves)

where point3 of bezier(n) should equal point0 of bezier(n+1)

`[bezier1, bezier2, ...]`

### Bezier Paths (collection of Paths)

`[path1, path2, ...]`

## Sample

Here is a sample `bezierPaths` array in Bezier Data Format. It is a collection
of three circles:

```
[
	[
		[{"x":100,"y":200},{"x":155.2,"y":200},{"x":200,"y":155.2},{"x":200,"y":100}],
		[{"x":200,"y":100},{"x":200,"y":44.8},{"x":155.2,"y":0},{"x":100,"y":0}],
		[{"x":100,"y":0},{"x":44.8,"y":0},{"x":0,"y":44.8},{"x":0,"y":100}],
		[{"x":0,"y":100},{"x":0,"y":155.2},{"x":44.8,"y":200},{"x":100,"y":200}]
	],
	[
		[{"x":200,"y":280},{"x":244.16,"y":280},{"x":280,"y":244.16},{"x":280,"y":200}],
		[{"x":280,"y":200},{"x":280,"y":155.84},{"x":244.16,"y":120},{"x":200,"y":120}],
		[{"x":200,"y":120},{"x":155.84,"y":120},{"x":120,"y":155.84},{"x":120,"y":200}],
		[{"x":120,"y":200},{"x":120,"y":244.16},{"x":155.84,"y":280},{"x":200,"y":280}]
	],
	[
		[{"x":300,"y":350},{"x":327.6,"y":350},{"x":350,"y":327.6},{"x":350,"y":300}],
		[{"x":350,"y":300},{"x":350,"y":272.4},{"x":327.6,"y":250},{"x":300,"y":250}],
		[{"x":300,"y":250},{"x":272.4,"y":250},{"x":250,"y":272.4},{"x":250,"y":300}],
		[{"x":250,"y":300},{"x":250,"y":327.6},{"x":272.4,"y":350},{"x":300,"y":350}]
	]
]
```
