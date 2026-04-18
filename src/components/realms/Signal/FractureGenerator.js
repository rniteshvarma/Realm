import * as THREE from 'three'

/**
 * Procedurally generates irregular triangular shards from a rectangle.
 * Width and Height represent the total size.
 * Returns an array of objects: { centroid: Vector3, geometry: BufferGeometry }
 */
export function generateShards(width, height, columns = 5, rows = 8) {
  const points = []
  
  // Add corners
  points.push(new THREE.Vector2(-width / 2, -height / 2))
  points.push(new THREE.Vector2(width / 2, -height / 2))
  points.push(new THREE.Vector2(-width / 2, height / 2))
  points.push(new THREE.Vector2(width / 2, height / 2))
  
  // Add inner points with noise offset
  for (let y = 1; y < rows; y++) {
    for (let x = 1; x < columns; x++) {
      // Base position in local 2D space
      let bx = -width / 2 + (width / columns) * x
      let by = -height / 2 + (height / rows) * y
      
      // Jitter
      bx += (Math.random() - 0.5) * (width / columns) * 0.8
      by += (Math.random() - 0.5) * (height / rows) * 0.8
      
      points.push(new THREE.Vector2(bx, by))
    }
  }

  // To easily form triangles without a complex Delaunay triangulator, 
  // we will manually build a grid of triangles based on the perturbed points.
  const vertices = []
  const uvs = []
  
  const getPoint = (c, r) => {
      if (c === 0 && r === 0) return points[0]
      if (c === columns && r === 0) return points[1]
      if (c === 0 && r === rows) return points[2]
      if (c === columns && r === rows) return points[3]
      // Inner points exist at index 4 + (r-1)*(columns-1) + (c-1)
      if (c > 0 && c < columns && r > 0 && r < rows) {
          return points[4 + (r - 1) * (columns - 1) + (c - 1)]
      }
      // Edges without points (just interpolate between corners for simplicity, 
      // or we can add edge points. Let's interpolate if it's an edge to seal it).
      let px = -width / 2 + (width / columns) * c
      let py = -height / 2 + (height / rows) * r
      return new THREE.Vector2(px, py)
  }

  const shards = []

  // Traverse grid and output 2 triangles per cell
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const pTL = getPoint(c, r + 1)
      const pTR = getPoint(c + 1, r + 1)
      const pBL = getPoint(c, r)
      const pBR = getPoint(c + 1, r)

      // Helper to compute UV
      const calcUV = (p) => new THREE.Vector2(
        (p.x + width / 2) / width,
        (p.y + height / 2) / height
      )

      // Triangle 1 (TL, BL, BR)
      const t1 = createShardFromTriangle(pTL, pBL, pBR, calcUV)
      // Triangle 2 (TL, BR, TR)
      const t2 = createShardFromTriangle(pTL, pBR, pTR, calcUV)
      
      shards.push(t1, t2)
    }
  }

  return shards
}

function createShardFromTriangle(p1, p2, p3, calcUV) {
  // Compute centroid
  const centroid = new THREE.Vector2(
    (p1.x + p2.x + p3.x) / 3,
    (p1.y + p2.y + p3.y) / 3
  )
  
  // Offset points so the geometry is locally centered around 0,0,0
  const lp1 = new THREE.Vector3(p1.x - centroid.x, p1.y - centroid.y, 0)
  const lp2 = new THREE.Vector3(p2.x - centroid.x, p2.y - centroid.y, 0)
  const lp3 = new THREE.Vector3(p3.x - centroid.x, p3.y - centroid.y, 0)
  
  const geo = new THREE.BufferGeometry()
  const posArray = new Float32Array([
    lp1.x, lp1.y, lp1.z,
    lp2.x, lp2.y, lp2.z,
    lp3.x, lp3.y, lp3.z
  ])
  geo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
  
  // Setup UVs based on original absolute positions
  const uv1 = calcUV(p1)
  const uv2 = calcUV(p2)
  const uv3 = calcUV(p3)
  const uvArray = new Float32Array([
    uv1.x, uv1.y,
    uv2.x, uv2.y,
    uv3.x, uv3.y
  ])
  geo.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2))
  
  // Basic normal facing Z
  const normalArray = new Float32Array([
    0, 0, 1,
    0, 0, 1,
    0, 0, 1
  ])
  geo.setAttribute('normal', new THREE.BufferAttribute(normalArray, 3))
  
  return {
    centroid: new THREE.Vector3(centroid.x, centroid.y, 0),
    geometry: geo
  }
}
