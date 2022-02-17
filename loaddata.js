
/* 
   original code taken from MDN Web Docs
   https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Lighting_in_WebGL

   -the functions which return the 3D vertices, normals, indices to
   the WebGL program
   -image array structure and variables
*/

// flag indicating that data has been loaded and image can be drawn 
let loaded = false;

// global variables for image data, size, and depth
// these are set in the index.html file
let imageData = [];
let imageHeight = 0;
let imageWidth = 0;
let imageDepth = 0;

// global geometry arrays
// you need set these
let vertices = [];
let indices = [];
let normals = [];
let textureCoords = [];
let vertexCount = 0; 	// number of vertices, not individual values
let numberIndices = 0;

// create geometry which will be drawn by WebGL
// create vertex, normal, index arrays using
// the data from the input file is in the imageData[] array 
// your code goes here
function initGeometry() {
	console.log("imagedata",imageWidth,imageHeight);
	for (let i = 0; i < (imageData.length - (imageWidth + 1)); (((i + 2) % imageWidth) == 0) ? i = i + 2 : i = i + 1) {
		vertices.push(triangularize(i));
	}
	console.log("vertices");
	//console.table(vertices.flat(1));
	vertices = vertices.flat(2); //?
	console.log("vertices",vertices.length);
	console.log(vertices);
	/* if vertices[] contains all of the values generated from the
	      image (including duplicates) then the number of indices is the
	      (height-1) * (width-1) of the image * the number of vertices
	      neede to create two triangles (6)*/
	
	// the indices[] array will contain the values from 0 to the
	//    number of indices - 1
	numberIndices = (imageHeight - 1) * (imageWidth - 1) * 6;
	vertexCount = numberIndices;
	for (let inorder = 0; inorder < numberIndices; inorder++) {
		indices[inorder] = inorder;
	}
	console.log("indices", indices.length);
	console.log(indices);
	//console.table(indices);

	// calculate normals for height map
	for (let idk = 2; idk < vertices.length; idk = idk + 9) {
		let p_a = makePoint(vertices[idk-2], vertices[idk-1], vertices[idk]);
		let p_b = makePoint(vertices[idk+1], vertices[idk+2], vertices[idk+3]);
		let p_c = makePoint(vertices[idk+4], vertices[idk+5], vertices[idk+6]);
		let vectors = vectorizeTriangle(p_b, p_a, p_c);
		let vector1 = vectors[0];
		let vector2 = vectors[1];
		if (vector2 && vector1) {
			let cp = normalize(...crossProduct(vector1, vector2));
			normals.push(cp);
			normals.push(cp);
			normals.push(cp);
		}
	}
	normals = normals.flat();
	console.log("normals",normals.length);
	console.log(normals);
	//console.table(normals);

	// load textures coordinates, currently use same texture for colour
	//    for all points
	// you don't need to change this code but you do need to set
	//     numberIndices to the number of indices 
	for (let i=0; i<(numberIndices/3); i++) {
	   textureCoords.push(0.0,0.0,  1.0,0.0,   1.0,1.0,);
	}
	console.log("why though");
}

function makePoint(x, y, z) {
	return {x:x, y:y, z:z};
}

function vectorizeTriangle(start, term1, term2) {
	v_a = makePoint(term1.x-start.x, term1.y-start.y, term1.z-start.z);
	v_b = makePoint(term2.x-start.x, term2.y-start.y, term2.z-start.z);
	return [v_a, v_b];
}

function triangularize(i) {
	return [imageData[i],
	imageData[i+imageWidth],
	imageData[i+imageWidth+1],
	imageData[i+imageWidth+1],
	imageData[i+1],
	imageData[i]];
}

function getAngle(a, b) {
	return Math.acos(dotProduct(a, b) / (getLength(a) * getLength(b)));
}

function getLength(a) {
	return (Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2) + Math.pow(a.z, 2)));
} //this may be incredibly slow due to javascript

//object point = {x:float, y:float, z:float}
function dotProduct(a, b) { //vector objects
	return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
}

function normalize(x, y, z) {
	let len = getLength(makePoint(x, y, z));
	return [(x/len), (y/len), (z/len)];
}

function crossProduct(a, b) {
	//isnt this only correct when they're at the origin though...
	console.log(a.x, "*", b.y, "-", a.y, "*", b.x, "=", (a.x*b.y - a.y*b.x)); //so many 0 wtf
	//console.log([(a.y*b.z - a.z*b.y), (a.z*b.x - a.x*b.z), (a.x*b.y - a.y*b.x)]);
	return [(a.y*b.z - a.z*b.y), (a.z*b.x - a.x*b.z), (a.x*b.y - a.y*b.x)];
}

/* you don't need to change anything past this point
   the following functions return the geometry information
*/

// return the number of indices in the object
// this should match the number of values in the indices[] array
function getVertexCount() {
   return(vertexCount);
}

// position array
// vertex positions
function loadvertices() {
  return(vertices);
}


// normals array
function loadnormals() {
   return(normals);
}


// texture coordinates
function loadtextcoords() {
	return(textureCoords);
}


// load vertex indices
function loadvertexindices() {
   return(indices);
}


// texture array size and data
function loadwidth() {
   return 2;
}

function loadheight() {
   return 2;
}

// using a fixed texture map to colour object
function loadtexture() {
   return(new Uint8Array([128,128,128,255,
						  128,128,128,255,
						  128,128,128,255,
						  128,128,128,255]) );
}