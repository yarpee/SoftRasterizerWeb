define("Data", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Vector3 {
        constructor(x = 0.0, y = 0.0, z = 0.0) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        static add(a, b) {
            var c = new Vector3();
            c.x = a.x + b.x;
            c.y = a.y + b.y;
            c.z = a.z + b.z;
            return c;
        }
        static subtract(a, b) {
            var c = new Vector3();
            c.x = a.x - b.x;
            c.y = a.y - b.y;
            c.z = a.z - b.z;
            return c;
        }
        static cross(a, b) {
            var c = new Vector3();
            c.x = a.y * b.z - a.z * b.y;
            c.y = a.z * b.x - a.x * b.z;
            c.z = a.x * b.y - a.y * b.x;
            return c;
        }
        static dot(a, b) {
            return a.x * b.x + a.y * b.y + a.z * b.z;
        }
        static scale(a, b) {
            var c = new Vector3();
            c.x = a.x * b;
            c.y = a.y * b;
            c.z = a.z * b;
            return c;
        }
        static normalize(a) {
            var c = new Vector3(a.x, a.y, a.z);
            var len = a.x * a.x + a.y * a.y + a.z * a.z;
            if (len > 0) {
                len = 1 / Math.sqrt(len);
                c.x *= len;
                c.y *= len;
                c.z *= len;
            }
            return c;
        }
        get length() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        }
        floorXY() {
            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);
        }
        multiplyMatrix4x4(m) {
            var c = new Vector3();
            c.x = this.x * m.get(0, 0) + this.y * m.get(0, 1) + this.z * m.get(0, 2) + m.get(0, 3);
            c.y = this.x * m.get(1, 0) + this.y * m.get(1, 1) + this.z * m.get(1, 2) + m.get(1, 3);
            c.z = this.x * m.get(2, 0) + this.y * m.get(2, 1) + this.z * m.get(2, 2) + m.get(2, 3);
            var w = this.x * m.get(3, 0) + this.y * m.get(3, 1) + this.z * m.get(3, 2) + m.get(3, 3);
            if (w != 1) {
                // console.error("w != 1");
                c.x /= w;
                c.y /= w;
                c.z /= w;
            }
            return c;
        }
    }
    Vector3.right = new Vector3(1, 0, 0);
    Vector3.up = new Vector3(0, 1, 0);
    Vector3.front = new Vector3(0, 0, 1);
    exports.Vector3 = Vector3;
    class Matrix4x4 {
        constructor() {
            this.elements = new Float32Array(16);
        }
        identity() {
            var e = this.elements;
            e[1] = e[2] = e[3] = e[4] = e[6] = e[7] = e[8] = e[9] = e[11] = e[12] = e[13] = e[14] = 0;
            e[0] = e[5] = e[10] = e[15] = 1;
        }
        set(row, column, data) {
            var index = row * 4 + column;
            this.elements[index] = data;
        }
        get(row, column) {
            var index = row * 4 + column;
            return this.elements[index];
        }
        transpose() {
            var e, t;
            e = this.elements;
            t = e[1];
            e[1] = e[4];
            e[4] = t;
            t = e[2];
            e[2] = e[8];
            e[8] = t;
            t = e[3];
            e[3] = e[12];
            e[12] = t;
            t = e[6];
            e[6] = e[9];
            e[9] = t;
            t = e[7];
            e[7] = e[13];
            e[13] = t;
            t = e[11];
            e[11] = e[14];
            e[14] = t;
        }
        static multiply(left, right) {
            var out = new Matrix4x4();
            var l = right.elements;
            var r = left.elements;
            var e = out.elements;
            var l11 = l[0], l12 = l[1], l13 = l[2], l14 = l[3];
            var l21 = l[4], l22 = l[5], l23 = l[6], l24 = l[7];
            var l31 = l[8], l32 = l[9], l33 = l[10], l34 = l[11];
            var l41 = l[12], l42 = l[13], l43 = l[14], l44 = l[15];
            var r11 = r[0], r12 = r[1], r13 = r[2], r14 = r[3];
            var r21 = r[4], r22 = r[5], r23 = r[6], r24 = r[7];
            var r31 = r[8], r32 = r[9], r33 = r[10], r34 = r[11];
            var r41 = r[12], r42 = r[13], r43 = r[14], r44 = r[15];
            e[0] = (l11 * r11) + (l12 * r21) + (l13 * r31) + (l14 * r41);
            e[1] = (l11 * r12) + (l12 * r22) + (l13 * r32) + (l14 * r42);
            e[2] = (l11 * r13) + (l12 * r23) + (l13 * r33) + (l14 * r43);
            e[3] = (l11 * r14) + (l12 * r24) + (l13 * r34) + (l14 * r44);
            e[4] = (l21 * r11) + (l22 * r21) + (l23 * r31) + (l24 * r41);
            e[5] = (l21 * r12) + (l22 * r22) + (l23 * r32) + (l24 * r42);
            e[6] = (l21 * r13) + (l22 * r23) + (l23 * r33) + (l24 * r43);
            e[7] = (l21 * r14) + (l22 * r24) + (l23 * r34) + (l24 * r44);
            e[8] = (l31 * r11) + (l32 * r21) + (l33 * r31) + (l34 * r41);
            e[9] = (l31 * r12) + (l32 * r22) + (l33 * r32) + (l34 * r42);
            e[10] = (l31 * r13) + (l32 * r23) + (l33 * r33) + (l34 * r43);
            e[11] = (l31 * r14) + (l32 * r24) + (l33 * r34) + (l34 * r44);
            e[12] = (l41 * r11) + (l42 * r21) + (l43 * r31) + (l44 * r41);
            e[13] = (l41 * r12) + (l42 * r22) + (l43 * r32) + (l44 * r42);
            e[14] = (l41 * r13) + (l42 * r23) + (l43 * r33) + (l44 * r43);
            e[15] = (l41 * r14) + (l42 * r24) + (l43 * r34) + (l44 * r44);
            return out;
        }
    }
    exports.Matrix4x4 = Matrix4x4;
    class Face {
        constructor() {
            this.vertexIndexs = [];
            this.textureIndexs = [];
            this.normalIndexs = [];
        }
    }
    exports.Face = Face;
});
define("OBJLoader", ["require", "exports", "Data"], function (require, exports, Data_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // https://en.wikipedia.org/wiki/Wavefront_.obj_file
    // https://threejs.org/examples/jsm/loaders/OBJLoader.js
    class OBJLoader {
        constructor() {
            this.m_VertexArray = [];
            this.m_UVArray = [];
            this.m_NormalArray = [];
            this.m_FaceArray = [];
        }
        get faceCount() {
            return this.m_FaceArray.length;
        }
        getFace(index) {
            return this.m_FaceArray[index];
        }
        getVertex(index) {
            return this.m_VertexArray[index];
        }
        getFaceVertex(faceIndex, vertexIndex) {
            var face = this.m_FaceArray[faceIndex];
            var realVertexIndex = face.vertexIndexs[vertexIndex] - 1; // Wavefront .obj file index从1开始，这里要转换为从0开始
            return this.m_VertexArray[realVertexIndex];
        }
        getFaceVertexUV(faceIndex, vertexIndex) {
            var face = this.m_FaceArray[faceIndex];
            var uvIndex = face.textureIndexs[vertexIndex] - 1;
            return this.m_UVArray[uvIndex];
        }
        getFaceVertexNormal(faceIndex, vertexIndex) {
            var face = this.m_FaceArray[faceIndex];
            var normalIndex = face.normalIndexs[vertexIndex] - 1;
            return this.m_NormalArray[normalIndex];
        }
        load(url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'text';
            xhr.open('GET', url);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE && (xhr.status === 0 || xhr.status === 200)) {
                    this.parse(xhr.responseText);
                    callback(this);
                }
            }.bind(this);
            xhr.withCredentials = true;
            xhr.send();
        }
        parse(text) {
            if (text) {
                var lines = text.split('\n');
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    var firstChar = line[0];
                    if (firstChar === '#') {
                        continue;
                    }
                    else if (firstChar === 'v') {
                        var data = line.split(/\s+/);
                        switch (data[0]) {
                            case 'v':
                                var v = new Data_1.Vector3();
                                v.x = parseFloat(data[1]);
                                v.y = parseFloat(data[2]);
                                v.z = parseFloat(data[3]);
                                this.m_VertexArray.push(v);
                                break;
                            case 'vt':
                                this.m_UVArray.push(new Data_1.Vector3(parseFloat(data[1]), parseFloat(data[2])));
                                break;
                            case 'vn':
                                var normal = new Data_1.Vector3();
                                normal.x = parseFloat(data[1]);
                                normal.y = parseFloat(data[2]);
                                normal.z = parseFloat(data[3]);
                                this.m_NormalArray.push(normal);
                                break;
                        }
                    }
                    else if (firstChar === 'f') {
                        var data = line.split(/\s+/);
                        var f = new Data_1.Face();
                        for (var j = 1; j < data.length; j++) {
                            var vertexData = data[j].split('/');
                            f.vertexIndexs.push(parseInt(vertexData[0], 10));
                            if (vertexData.length > 1) {
                                f.textureIndexs.push(parseInt(vertexData[1], 10));
                            }
                            if (vertexData.length > 2) {
                                f.normalIndexs.push(parseInt(vertexData[2], 10));
                            }
                        }
                        this.m_FaceArray.push(f);
                    }
                }
            }
        }
    }
    exports.OBJLoader = OBJLoader;
});
define("TGALoader", ["require", "exports", "Data"], function (require, exports, Data_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // https://raw.githubusercontent.com/mrdoob/three.js/master/examples/jsm/loaders/TGALoader.js
    class TGALoader {
        getColor(u, v) {
            u = Math.floor(u * this.m_Width + 0.5);
            v = 1.0 - v; // v要做转换
            v = Math.floor(v * this.m_Height + 0.5);
            var index = (u + v * this.m_Width) * 4;
            var r = this.m_ImageData[index];
            var g = this.m_ImageData[index + 1];
            var b = this.m_ImageData[index + 2];
            return new Data_2.Vector3(r, g, b);
        }
        load(url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'arraybuffer';
            xhr.open('GET', url);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE && (xhr.status === 0 || xhr.status === 200)) {
                    this.parse(xhr.response);
                    callback(this);
                }
            }.bind(this);
            xhr.withCredentials = true;
            xhr.send();
        }
        parse(buffer) {
            // reference from vthibault, https://github.com/vthibault/roBrowser/blob/master/src/Loaders/Targa.js
            function tgaCheckHeader(header) {
                switch (header.image_type) {
                    // check indexed type
                    case TGA_TYPE_INDEXED:
                    case TGA_TYPE_RLE_INDEXED:
                        if (header.colormap_length > 256 || header.colormap_size !== 24 || header.colormap_type !== 1) {
                            console.error('THREE.TGALoader: Invalid type colormap data for indexed type.');
                        }
                        break;
                    // check colormap type
                    case TGA_TYPE_RGB:
                    case TGA_TYPE_GREY:
                    case TGA_TYPE_RLE_RGB:
                    case TGA_TYPE_RLE_GREY:
                        if (header.colormap_type) {
                            console.error('THREE.TGALoader: Invalid type colormap data for colormap type.');
                        }
                        break;
                    // What the need of a file without data ?
                    case TGA_TYPE_NO_DATA:
                        console.error('THREE.TGALoader: No data.');
                    // Invalid type ?
                    default:
                        console.error('THREE.TGALoader: Invalid type "%s".', header.image_type);
                }
                // check image width and height
                if (header.width <= 0 || header.height <= 0) {
                    console.error('THREE.TGALoader: Invalid image size.');
                }
                // check image pixel size
                if (header.pixel_size !== 8 && header.pixel_size !== 16 &&
                    header.pixel_size !== 24 && header.pixel_size !== 32) {
                    console.error('THREE.TGALoader: Invalid pixel size "%s".', header.pixel_size);
                }
            }
            // parse tga image buffer
            function tgaParse(use_rle, use_pal, header, offset, data) {
                let pixel_data, palettes;
                const pixel_size = header.pixel_size >> 3;
                const pixel_total = header.width * header.height * pixel_size;
                // read palettes
                if (use_pal) {
                    palettes = data.subarray(offset, offset += header.colormap_length * (header.colormap_size >> 3));
                }
                // read RLE
                if (use_rle) {
                    pixel_data = new Uint8Array(pixel_total);
                    let c, count, i;
                    let shift = 0;
                    const pixels = new Uint8Array(pixel_size);
                    while (shift < pixel_total) {
                        c = data[offset++];
                        count = (c & 0x7f) + 1;
                        // RLE pixels
                        if (c & 0x80) {
                            // bind pixel tmp array
                            for (i = 0; i < pixel_size; ++i) {
                                pixels[i] = data[offset++];
                            }
                            // copy pixel array
                            for (i = 0; i < count; ++i) {
                                pixel_data.set(pixels, shift + i * pixel_size);
                            }
                            shift += pixel_size * count;
                        }
                        else {
                            // raw pixels
                            count *= pixel_size;
                            for (i = 0; i < count; ++i) {
                                pixel_data[shift + i] = data[offset++];
                            }
                            shift += count;
                        }
                    }
                }
                else {
                    // raw pixels
                    pixel_data = data.subarray(offset, offset += (use_pal ? header.width * header.height : pixel_total));
                }
                return {
                    pixel_data: pixel_data,
                    palettes: palettes
                };
            }
            function tgaGetImageData8bits(imageData, y_start, y_step, y_end, x_start, x_step, x_end, image, palettes) {
                const colormap = palettes;
                let color, i = 0, x, y;
                const width = header.width;
                for (y = y_start; y !== y_end; y += y_step) {
                    for (x = x_start; x !== x_end; x += x_step, i++) {
                        color = image[i];
                        imageData[(x + width * y) * 4 + 3] = 255;
                        imageData[(x + width * y) * 4 + 2] = colormap[(color * 3) + 0];
                        imageData[(x + width * y) * 4 + 1] = colormap[(color * 3) + 1];
                        imageData[(x + width * y) * 4 + 0] = colormap[(color * 3) + 2];
                    }
                }
                return imageData;
            }
            function tgaGetImageData16bits(imageData, y_start, y_step, y_end, x_start, x_step, x_end, image) {
                let color, i = 0, x, y;
                const width = header.width;
                for (y = y_start; y !== y_end; y += y_step) {
                    for (x = x_start; x !== x_end; x += x_step, i += 2) {
                        color = image[i + 0] + (image[i + 1] << 8); // Inversed ?
                        imageData[(x + width * y) * 4 + 0] = (color & 0x7C00) >> 7;
                        imageData[(x + width * y) * 4 + 1] = (color & 0x03E0) >> 2;
                        imageData[(x + width * y) * 4 + 2] = (color & 0x001F) >> 3;
                        imageData[(x + width * y) * 4 + 3] = (color & 0x8000) ? 0 : 255;
                    }
                }
                return imageData;
            }
            function tgaGetImageData24bits(imageData, y_start, y_step, y_end, x_start, x_step, x_end, image) {
                let i = 0, x, y;
                const width = header.width;
                for (y = y_start; y !== y_end; y += y_step) {
                    for (x = x_start; x !== x_end; x += x_step, i += 3) {
                        imageData[(x + width * y) * 4 + 3] = 255;
                        imageData[(x + width * y) * 4 + 2] = image[i + 0];
                        imageData[(x + width * y) * 4 + 1] = image[i + 1];
                        imageData[(x + width * y) * 4 + 0] = image[i + 2];
                    }
                }
                return imageData;
            }
            function tgaGetImageData32bits(imageData, y_start, y_step, y_end, x_start, x_step, x_end, image) {
                let i = 0, x, y;
                const width = header.width;
                for (y = y_start; y !== y_end; y += y_step) {
                    for (x = x_start; x !== x_end; x += x_step, i += 4) {
                        imageData[(x + width * y) * 4 + 2] = image[i + 0];
                        imageData[(x + width * y) * 4 + 1] = image[i + 1];
                        imageData[(x + width * y) * 4 + 0] = image[i + 2];
                        imageData[(x + width * y) * 4 + 3] = image[i + 3];
                    }
                }
                return imageData;
            }
            function tgaGetImageDataGrey8bits(imageData, y_start, y_step, y_end, x_start, x_step, x_end, image) {
                let color, i = 0, x, y;
                const width = header.width;
                for (y = y_start; y !== y_end; y += y_step) {
                    for (x = x_start; x !== x_end; x += x_step, i++) {
                        color = image[i];
                        imageData[(x + width * y) * 4 + 0] = color;
                        imageData[(x + width * y) * 4 + 1] = color;
                        imageData[(x + width * y) * 4 + 2] = color;
                        imageData[(x + width * y) * 4 + 3] = 255;
                    }
                }
                return imageData;
            }
            function tgaGetImageDataGrey16bits(imageData, y_start, y_step, y_end, x_start, x_step, x_end, image) {
                let i = 0, x, y;
                const width = header.width;
                for (y = y_start; y !== y_end; y += y_step) {
                    for (x = x_start; x !== x_end; x += x_step, i += 2) {
                        imageData[(x + width * y) * 4 + 0] = image[i + 0];
                        imageData[(x + width * y) * 4 + 1] = image[i + 0];
                        imageData[(x + width * y) * 4 + 2] = image[i + 0];
                        imageData[(x + width * y) * 4 + 3] = image[i + 1];
                    }
                }
                return imageData;
            }
            function getTgaRGBA(data, width, height, image, palette) {
                let x_start, y_start, x_step, y_step, x_end, y_end;
                switch ((header.flags & TGA_ORIGIN_MASK) >> TGA_ORIGIN_SHIFT) {
                    default:
                    case TGA_ORIGIN_UL:
                        x_start = 0;
                        x_step = 1;
                        x_end = width;
                        y_start = 0;
                        y_step = 1;
                        y_end = height;
                        break;
                    case TGA_ORIGIN_BL:
                        x_start = 0;
                        x_step = 1;
                        x_end = width;
                        y_start = height - 1;
                        y_step = -1;
                        y_end = -1;
                        break;
                    case TGA_ORIGIN_UR:
                        x_start = width - 1;
                        x_step = -1;
                        x_end = -1;
                        y_start = 0;
                        y_step = 1;
                        y_end = height;
                        break;
                    case TGA_ORIGIN_BR:
                        x_start = width - 1;
                        x_step = -1;
                        x_end = -1;
                        y_start = height - 1;
                        y_step = -1;
                        y_end = -1;
                        break;
                }
                if (use_grey) {
                    switch (header.pixel_size) {
                        case 8:
                            tgaGetImageDataGrey8bits(data, y_start, y_step, y_end, x_start, x_step, x_end, image);
                            break;
                        case 16:
                            tgaGetImageDataGrey16bits(data, y_start, y_step, y_end, x_start, x_step, x_end, image);
                            break;
                        default:
                            console.error('THREE.TGALoader: Format not supported.');
                            break;
                    }
                }
                else {
                    switch (header.pixel_size) {
                        case 8:
                            tgaGetImageData8bits(data, y_start, y_step, y_end, x_start, x_step, x_end, image, palette);
                            break;
                        case 16:
                            tgaGetImageData16bits(data, y_start, y_step, y_end, x_start, x_step, x_end, image);
                            break;
                        case 24:
                            tgaGetImageData24bits(data, y_start, y_step, y_end, x_start, x_step, x_end, image);
                            break;
                        case 32:
                            tgaGetImageData32bits(data, y_start, y_step, y_end, x_start, x_step, x_end, image);
                            break;
                        default:
                            console.error('THREE.TGALoader: Format not supported.');
                            break;
                    }
                }
                // Load image data according to specific method
                // let func = 'tgaGetImageData' + (use_grey ? 'Grey' : '') + (header.pixel_size) + 'bits';
                // func(data, y_start, y_step, y_end, x_start, x_step, x_end, width, image, palette );
                return data;
            }
            // TGA constants
            const TGA_TYPE_NO_DATA = 0, TGA_TYPE_INDEXED = 1, TGA_TYPE_RGB = 2, TGA_TYPE_GREY = 3, TGA_TYPE_RLE_INDEXED = 9, TGA_TYPE_RLE_RGB = 10, TGA_TYPE_RLE_GREY = 11, TGA_ORIGIN_MASK = 0x30, TGA_ORIGIN_SHIFT = 0x04, TGA_ORIGIN_BL = 0x00, TGA_ORIGIN_BR = 0x01, TGA_ORIGIN_UL = 0x02, TGA_ORIGIN_UR = 0x03;
            if (buffer.byteLength < 19) {
                console.error('THREE.TGALoader: Not enough data to contain header.');
            }
            let offset = 0;
            const content = new Uint8Array(buffer), header = {
                id_length: content[offset++],
                colormap_type: content[offset++],
                image_type: content[offset++],
                colormap_index: content[offset++] | content[offset++] << 8,
                colormap_length: content[offset++] | content[offset++] << 8,
                colormap_size: content[offset++],
                origin: [
                    content[offset++] | content[offset++] << 8,
                    content[offset++] | content[offset++] << 8
                ],
                width: content[offset++] | content[offset++] << 8,
                height: content[offset++] | content[offset++] << 8,
                pixel_size: content[offset++],
                flags: content[offset++]
            };
            // check tga if it is valid format
            tgaCheckHeader(header);
            if (header.id_length + offset > buffer.byteLength) {
                console.error('THREE.TGALoader: No data.');
            }
            // skip the needn't data
            offset += header.id_length;
            // get targa information about RLE compression and palette
            let use_rle = false, use_pal = false, use_grey = false;
            switch (header.image_type) {
                case TGA_TYPE_RLE_INDEXED:
                    use_rle = true;
                    use_pal = true;
                    break;
                case TGA_TYPE_INDEXED:
                    use_pal = true;
                    break;
                case TGA_TYPE_RLE_RGB:
                    use_rle = true;
                    break;
                case TGA_TYPE_RGB:
                    break;
                case TGA_TYPE_RLE_GREY:
                    use_rle = true;
                    use_grey = true;
                    break;
                case TGA_TYPE_GREY:
                    use_grey = true;
                    break;
            }
            this.m_ImageData = new Uint8Array(header.width * header.height * 4);
            this.m_Width = header.width;
            this.m_Height = header.height;
            const result = tgaParse(use_rle, use_pal, header, offset, content);
            getTgaRGBA(this.m_ImageData, header.width, header.height, result.pixel_data, result.palettes);
        }
    }
    exports.TGALoader = TGALoader;
});
define("RefactorMain", ["require", "exports", "Data", "OBJLoader", "TGALoader"], function (require, exports, Data_3, OBJLoader_1, TGALoader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Color;
    (function (Color) {
        Color["red"] = "rgb(255, 0, 0)";
        Color["green"] = "rgb(0, 255, 0)";
        Color["blue"] = "rgb(0, 0, 255)";
        Color["white"] = "rgb(255, 255, 255)";
    })(Color || (Color = {}));
    class RefactorMain {
        constructor() {
            this.cameraPos = new Data_3.Vector3(0, 0, 1);
            this.target = new Data_3.Vector3(0, 0, 0);
            this.cameraUp = new Data_3.Vector3(0, 1, 0);
            this.lightDir = new Data_3.Vector3(1, 0, 1);
            this.m_Canvas = document.getElementById('glcanvas');
            this.m_Ctx = this.m_Canvas.getContext('2d');
            OpenGL.Canvas = this.m_Canvas;
            OpenGL.Context = this.m_Ctx;
            this.m_Canvas.width = 800;
            this.m_Canvas.height = 800;
            this.m_OBJLoader = new OBJLoader_1.OBJLoader();
            this.m_OBJLoader.load("african_head.obj", this.onModelWasLoaded.bind(this));
            OpenGL.lookat(this.cameraPos, this.target, this.cameraUp);
            OpenGL.projection(Data_3.Vector3.subtract(this.cameraPos, this.target).length);
            OpenGL.viewport(0, 0, 800, 800);
        }
        onModelWasLoaded(loader) {
            this.m_DiffuseLoader = new TGALoader_1.TGALoader();
            this.m_DiffuseLoader.load("african_head_diffuse.tga", function () {
                this.m_NormalLoader = new TGALoader_1.TGALoader();
                this.m_NormalLoader.load("african_head_nm_tangent.tga", function () {
                    this.m_SpecularLoader = new TGALoader_1.TGALoader();
                    this.m_SpecularLoader.load("african_head_spec.tga", function () {
                        this.drawModelFlatShadingLight(loader);
                    }.bind(this));
                    //this.drawModelFlatShadingLight(loader);
                }.bind(this));
                //this.drawModelFlatShadingLight(loader);
            }.bind(this));
        }
        drawModelFlatShadingLight(loader) {
            var shader = new PhongShader();
            shader.diffuseTexture = this.m_DiffuseLoader;
            shader.normalTexture = this.m_NormalLoader;
            shader.specularTexture = this.m_SpecularLoader;
            shader.lightDir = Data_3.Vector3.normalize(this.lightDir);
            shader.cameraPos = this.cameraPos;
            OpenGL.drawModel(loader, shader);
        }
    }
    exports.RefactorMain = RefactorMain;
    class OpenGL {
        // eye: camera position
        // target: lookat point
        // up: camera's up vection
        // view matrix计算步骤：
        // 1. 平移矩阵将eye移回原点-eye
        // 2. 将camera的x/y/z轴旋转对齐坐标系的x/y/z轴，求这个旋转不容易，但可以求它的逆旋转，再转置（旋转矩阵的转置矩阵等于它的逆矩阵）
        static lookat(eye, target, up) {
            var cameraZ = Data_3.Vector3.normalize(Data_3.Vector3.subtract(eye, target)); // 我们的右手坐标系x/y/z分别对应右、上、外，camera是看向-z轴的，所以camera的z轴是eye-target
            var cameraX = Data_3.Vector3.normalize(Data_3.Vector3.cross(up, cameraZ)); // camera的上叉乘外得到右即x轴
            var cameraY = Data_3.Vector3.normalize(Data_3.Vector3.cross(cameraZ, cameraX)); // 原up不一定与计算出的cameraZ和cameraX正交，因此要算出一个cameraY相互正交，才能用这个正交坐标系的x/y/z与原坐标系的x/y/z一一对齐。这里计算出的cameraY不是camera的up方向。
            var translation = new Data_3.Matrix4x4();
            translation.identity();
            translation.set(0, 3, -eye.x);
            translation.set(1, 3, -eye.y);
            translation.set(2, 3, -eye.z);
            var rotation = new Data_3.Matrix4x4();
            rotation.identity();
            rotation.set(0, 0, cameraX.x);
            rotation.set(1, 0, cameraX.y);
            rotation.set(2, 0, cameraX.z);
            rotation.set(0, 1, cameraY.x);
            rotation.set(1, 1, cameraY.y);
            rotation.set(2, 1, cameraY.z);
            rotation.set(0, 2, cameraZ.x);
            rotation.set(1, 2, cameraZ.y);
            rotation.set(2, 2, cameraZ.z);
            rotation.transpose();
            this.ViewMatrix = Data_3.Matrix4x4.multiply(translation, rotation);
            return this.ViewMatrix;
        }
        static projection(distance) {
            var projection = new Data_3.Matrix4x4();
            projection.identity();
            projection.set(3, 2, -1 / distance);
            this.ProjectionMatrix = projection;
            return this.ProjectionMatrix;
        }
        // projection应将顶点范围限定在[-1, 1]的cube中，viewport与uv坐标系一致范围为[0, 1]的平面，z我们也限定在[0, 1]中，因此第一步平移（1, 1, 1)是一致的
        // 第二步是缩放0.5
        // 再要把x, y从[0, 1]映射到[x, x + width]和[y, y + height]
        // 第三步x轴缩放width，y轴缩放height
        // 第四步x轴平移x，y轴平移y
        static viewport(x, y, width, height) {
            var translation = new Data_3.Matrix4x4();
            translation.identity();
            translation.set(0, 3, 1);
            translation.set(1, 3, 1);
            translation.set(2, 3, 1);
            var scale = new Data_3.Matrix4x4();
            scale.identity();
            scale.set(0, 0, 0.5);
            scale.set(1, 1, 0.5);
            scale.set(2, 2, 0.5);
            var scale2 = new Data_3.Matrix4x4();
            scale2.identity();
            scale2.set(0, 0, width);
            scale2.set(1, 1, height);
            var translation2 = new Data_3.Matrix4x4();
            translation2.identity();
            translation2.set(0, 3, x);
            translation2.set(1, 3, y);
            //this.ViewportMatrix = Matrix4x4.multiply(Matrix4x4.multiply(translation, scale), scale2);
            this.ViewportMatrix = Data_3.Matrix4x4.multiply(Data_3.Matrix4x4.multiply(Data_3.Matrix4x4.multiply(translation, scale), scale2), translation2);
            return this.ViewportMatrix;
        }
        static drawDot(x, y, color) {
            x = Math.floor(x);
            y = Math.floor(y);
            y = OpenGL.Canvas.height - 1 - y; // 旋转成左下角为原点，同贴图的UV坐标系
            OpenGL.Context.fillStyle = color;
            OpenGL.Context.fillRect(x, y, 1, 1);
        }
        static drawModel(loader, shader) {
            OpenGL.Shader = shader;
            var faceCount = loader.faceCount;
            for (var i = 0; i < faceCount; i++) {
                var v1 = loader.getFaceVertex(i, 0);
                var v2 = loader.getFaceVertex(i, 1);
                var v3 = loader.getFaceVertex(i, 2);
                var uv1 = loader.getFaceVertexUV(i, 0);
                var uv2 = loader.getFaceVertexUV(i, 1);
                var uv3 = loader.getFaceVertexUV(i, 2);
                var n1 = loader.getFaceVertexNormal(i, 0);
                var n2 = loader.getFaceVertexNormal(i, 1);
                var n3 = loader.getFaceVertexNormal(i, 2);
                v1 = shader.vertex(v1, uv1, n1, 0);
                v2 = shader.vertex(v2, uv2, n2, 1);
                v3 = shader.vertex(v3, uv3, n3, 2);
                OpenGL.drawTriangleBarycentricZBuffer(v1, v2, v3);
            }
        }
        static barycentric(a, b, c, p) {
            // P的重心坐标表示要满足(1 - u - v, u, v)，即P = (1 - u - v) * A + u * B + v * C = A + u * (B - A) + v * (C - A)
            // 表示为向量算法为PA + u * AB + v * AC = 0，即[v, u, 1] * [AC, AB, PA] = 0
            // 那么cross出来的vec里x代表v，y代表u，z不为0的情况下各分量除以z就满足了[v, u, 1]的形式，u v也就算出来了
            var xVec = new Data_3.Vector3(c.x - a.x, b.x - a.x, a.x - p.x);
            var yVec = new Data_3.Vector3(c.y - a.y, b.y - a.y, a.y - p.y);
            var vec = Data_3.Vector3.cross(xVec, yVec);
            if (Math.abs(vec.z) > 1e-2) {
                var v = vec.x / vec.z;
                var u = vec.y / vec.z;
                return new Data_3.Vector3(1 - u - v, u, v);
            }
            return new Data_3.Vector3(-1, 1, 1);
        }
        static drawTriangleBarycentricZBuffer(v1, v2, v3) {
            v1.floorXY();
            v2.floorXY();
            v3.floorXY();
            var minBox = new Data_3.Vector3(OpenGL.Canvas.width - 1, OpenGL.Canvas.height - 1);
            var maxBox = new Data_3.Vector3();
            minBox.x = Math.max(Math.min(minBox.x, v1.x, v2.x, v3.x), 0);
            minBox.y = Math.max(Math.min(minBox.y, v1.y, v2.y, v3.y), 0);
            maxBox.x = Math.min(Math.max(maxBox.x, v1.x, v2.x, v3.x), OpenGL.Canvas.width - 1);
            maxBox.y = Math.min(Math.max(maxBox.y, v1.y, v2.y, v3.y), OpenGL.Canvas.height - 1);
            var p = new Data_3.Vector3();
            for (var x = minBox.x; x <= maxBox.x; x++) {
                for (var y = minBox.y; y <= maxBox.y; y++) {
                    p.x = x;
                    p.y = y;
                    var bc = OpenGL.barycentric(v1, v2, v3, p);
                    p.z = v1.z * bc.x + v2.z * bc.y + v3.z * bc.z; // 插值z
                    if (bc.x < 0 || bc.y < 0 || bc.z < 0) {
                        continue;
                    }
                    else {
                        if (!this.ZBuffer) {
                            var bufferSize = OpenGL.Canvas.width * OpenGL.Canvas.height;
                            this.ZBuffer = [];
                            for (var i = 0; i < bufferSize; i++) {
                                this.ZBuffer[i] = 0;
                            }
                        }
                        var index = x + y * OpenGL.Canvas.width;
                        if (p.z > this.ZBuffer[index]) { // 坐标系z向屏幕外，所以z越大越近
                            this.ZBuffer[index] = p.z;
                            var result = OpenGL.Shader.fragment(bc);
                            if (!result.discard) {
                                this.drawDot(x, y, result.color);
                            }
                        }
                    }
                }
            }
        }
    }
    exports.OpenGL = OpenGL;
    class GouraudShader {
        constructor() {
            this.varying_uv = [new Data_3.Vector3(), new Data_3.Vector3(), new Data_3.Vector3()];
            this.varying_intensity = [0, 0, 0];
        }
        vertex(v, uv, normal, index) {
            //var MVP = OpenGL.ViewportMatrix;
            var MVP = Data_3.Matrix4x4.multiply(Data_3.Matrix4x4.multiply(OpenGL.ViewMatrix, OpenGL.ProjectionMatrix), OpenGL.ViewportMatrix);
            var glVertex = v.multiplyMatrix4x4(MVP);
            this.varying_uv[index].x = uv.x;
            this.varying_uv[index].y = uv.y;
            this.varying_intensity[index] = Math.max(Data_3.Vector3.dot(normal, this.lightDir), 0);
            return glVertex;
        }
        fragment(bc) {
            var u = this.varying_uv[0].x * bc.x + this.varying_uv[1].x * bc.y + this.varying_uv[2].x * bc.z;
            var v = this.varying_uv[0].y * bc.x + this.varying_uv[1].y * bc.y + this.varying_uv[2].y * bc.z;
            var rgb = this.diffuseTexture.getColor(u, v);
            var intensity = this.varying_intensity[0] * bc.x + this.varying_intensity[1] * bc.y + this.varying_intensity[2] * bc.z;
            rgb = Data_3.Vector3.scale(rgb, intensity);
            var outColor = "rgb(" + rgb.x + ", " + rgb.y + ", " + rgb.z + ")";
            return { discard: false, color: outColor };
        }
    }
    exports.GouraudShader = GouraudShader;
    class PhongShader {
        constructor() {
            this.varying_uv = [new Data_3.Vector3(), new Data_3.Vector3(), new Data_3.Vector3()];
            this.vertexPos = [new Data_3.Vector3(), new Data_3.Vector3(), new Data_3.Vector3()];
            this.varying_normal = [new Data_3.Vector3(), new Data_3.Vector3(), new Data_3.Vector3()];
        }
        vertex(v, uv, normal, index) {
            //var MVP = OpenGL.ViewportMatrix;
            var MVP = Data_3.Matrix4x4.multiply(Data_3.Matrix4x4.multiply(OpenGL.ViewMatrix, OpenGL.ProjectionMatrix), OpenGL.ViewportMatrix);
            var glVertex = v.multiplyMatrix4x4(MVP);
            this.varying_uv[index].x = uv.x;
            this.varying_uv[index].y = uv.y;
            this.vertexPos[index].x = v.x;
            this.vertexPos[index].y = v.y;
            this.vertexPos[index].z = v.z;
            this.varying_normal[index].x = normal.x;
            this.varying_normal[index].y = normal.y;
            this.varying_normal[index].z = normal.z;
            return glVertex;
        }
        fragment(bc) {
            var u = this.varying_uv[0].x * bc.x + this.varying_uv[1].x * bc.y + this.varying_uv[2].x * bc.z;
            var v = this.varying_uv[0].y * bc.x + this.varying_uv[1].y * bc.y + this.varying_uv[2].y * bc.z;
            var rgb = this.diffuseTexture.getColor(u, v);
            // normal map
            var edge1 = Data_3.Vector3.subtract(this.vertexPos[1], this.vertexPos[0]);
            var edge2 = Data_3.Vector3.subtract(this.vertexPos[2], this.vertexPos[1]);
            var deltaUV1 = Data_3.Vector3.subtract(this.varying_uv[1], this.varying_uv[0]);
            var deltaUV2 = Data_3.Vector3.subtract(this.varying_uv[2], this.varying_uv[1]);
            var f = 1.0 / (deltaUV1.x * deltaUV2.y - deltaUV2.x * deltaUV1.y);
            var tangent = new Data_3.Vector3();
            tangent.x = f * (deltaUV2.y * edge1.x - deltaUV1.y * edge2.x);
            tangent.y = f * (deltaUV2.y * edge1.y - deltaUV1.y * edge2.y);
            tangent.z = f * (deltaUV2.y * edge1.z - deltaUV1.y * edge2.z);
            tangent = Data_3.Vector3.normalize(tangent);
            var bitangent = new Data_3.Vector3();
            bitangent.x = f * (-deltaUV2.x * edge1.x + deltaUV1.x * edge2.x);
            bitangent.y = f * (-deltaUV2.x * edge1.y + deltaUV1.x * edge2.y);
            bitangent.z = f * (-deltaUV2.x * edge1.z + deltaUV1.x * edge2.z);
            bitangent = Data_3.Vector3.normalize(bitangent);
            //var normal = Vector3.cross(tangent, bitangent);
            var normal = new Data_3.Vector3();
            normal.x = this.varying_normal[0].x * bc.x + this.varying_normal[1].x * bc.y + this.varying_normal[2].x * bc.z;
            normal.y = this.varying_normal[0].y * bc.x + this.varying_normal[1].y * bc.y + this.varying_normal[2].y * bc.z;
            normal.z = this.varying_normal[0].z * bc.x + this.varying_normal[1].z * bc.y + this.varying_normal[2].z * bc.z;
            normal = Data_3.Vector3.normalize(normal);
            var tbn = new Data_3.Matrix4x4();
            tbn.identity();
            tbn.set(0, 0, tangent.x);
            tbn.set(1, 0, tangent.y);
            tbn.set(2, 0, tangent.z);
            tbn.set(0, 1, bitangent.x);
            tbn.set(1, 1, bitangent.y);
            tbn.set(2, 1, bitangent.z);
            tbn.set(0, 2, normal.x);
            tbn.set(1, 2, normal.y);
            tbn.set(2, 2, normal.z);
            var rgbNormal = this.normalTexture.getColor(u, v);
            rgbNormal.x = rgbNormal.x / 255.0 * 2 - 1; // [0, 255]转换为[-1, 1]
            rgbNormal.y = rgbNormal.y / 255.0 * 2 - 1;
            rgbNormal.z = rgbNormal.z / 255.0 * 2 - 1;
            var worldNormal = Data_3.Vector3.normalize(rgbNormal.multiplyMatrix4x4(tbn));
            // rgb.x = (worldNormal.x + 1) / 2 * 255;
            // rgb.y = (worldNormal.y + 1) / 2 * 255;
            // rgb.z = (worldNormal.z + 1) / 2 * 255;
            var intensity = Math.max(Data_3.Vector3.dot(worldNormal, this.lightDir), 0) * 2;
            // rgb.x = Math.min(rgb.x * intensity, 255);
            // rgb.y = Math.min(rgb.y * intensity, 255);
            // rgb.z = Math.min(rgb.z * intensity, 255);
            // specular
            var pos = new Data_3.Vector3();
            pos.x = this.vertexPos[0].x * bc.x + this.vertexPos[1].x * bc.y + this.vertexPos[2].x * bc.z;
            pos.y = this.vertexPos[0].y * bc.x + this.vertexPos[1].y * bc.y + this.vertexPos[2].y * bc.z;
            pos.z = this.vertexPos[0].z * bc.x + this.vertexPos[1].z * bc.y + this.vertexPos[2].z * bc.z;
            var cameraDir = Data_3.Vector3.normalize(Data_3.Vector3.subtract(this.cameraPos, pos));
            var halfNormal = Data_3.Vector3.normalize(Data_3.Vector3.add(cameraDir, this.lightDir));
            var specular = Math.max(Data_3.Vector3.dot(worldNormal, halfNormal), 0);
            specular = Math.pow(specular, 200);
            rgb.x = Math.min(5 + rgb.x * (intensity + specular), 255);
            rgb.y = Math.min(5 + rgb.y * (intensity + specular), 255);
            rgb.z = Math.min(5 + rgb.z * (intensity + specular), 255);
            var outColor = "rgb(" + rgb.x + ", " + rgb.y + ", " + rgb.z + ")";
            return { discard: false, color: outColor };
        }
    }
    exports.PhongShader = PhongShader;
});
define("Main", ["require", "exports", "Data", "OBJLoader", "RefactorMain", "TGALoader"], function (require, exports, Data_4, OBJLoader_2, RefactorMain_1, TGALoader_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Color;
    (function (Color) {
        Color["red"] = "rgb(255, 0, 0)";
        Color["green"] = "rgb(0, 255, 0)";
        Color["blue"] = "rgb(0, 0, 255)";
        Color["white"] = "rgb(255, 255, 255)";
    })(Color || (Color = {}));
    class Main {
        constructor() {
            this.m_Canvas = document.getElementById('glcanvas');
            this.m_Ctx = this.m_Canvas.getContext('2d');
            //this.drawSampleLine();
            //this.drawSampleModelWireframe();
            //this.drawSampleTriangle();
            //this.drawSampleModelFlatShading();
            new RefactorMain_1.RefactorMain();
        }
        // draw sample functions start
        drawSampleLine() {
            this.m_Canvas.width = 100;
            this.m_Canvas.height = 100;
            //this.lineTwoPoint(13, 20, 80, 40, Color.white);
            // this.lineTwoPoint2(13, 20, 80, 40, Color.white);
            // this.lineTwoPoint2(20, 13, 40, 80, Color.red);
            // this.lineTwoPoint2(80, 40, 13, 20, Color.red);
            //this.lineTwoPoint3(20, 13, 40, 80, Color.red);
            //this.lineBresenham(20, 13, 40, 80, Color.red);
            this.lineBresenham2(20, 13, 40, 80, Color.red);
        }
        drawSampleModelWireframe() {
            var loader = new OBJLoader_2.OBJLoader();
            loader.load("african_head.obj", this.drawModelWireframe.bind(this));
        }
        drawSampleTriangle() {
            this.m_Canvas.width = 200;
            this.m_Canvas.height = 200;
            var t1 = [new Data_4.Vector3(10, 70), new Data_4.Vector3(50, 160), new Data_4.Vector3(70, 80)];
            var t2 = [new Data_4.Vector3(180, 50), new Data_4.Vector3(150, 1), new Data_4.Vector3(70, 180)];
            var t3 = [new Data_4.Vector3(180, 150), new Data_4.Vector3(120, 160), new Data_4.Vector3(130, 180)];
            // this.drawTriangle(t1[0], t1[1], t1[2], Color.red);
            // this.drawTriangle(t2[0], t2[1], t2[2], Color.white);
            // this.drawTriangle(t3[0], t3[1], t3[2], Color.green);
            // this.drawTriangleScanline(t1[0], t1[1], t1[2], Color.red);
            // this.drawTriangleScanline(t2[0], t2[1], t2[2], Color.white);
            // this.drawTriangleScanline(t3[0], t3[1], t3[2], Color.green);
            // this.drawTriangleScanline2(t1[0], t1[1], t1[2], Color.red);
            // this.drawTriangleScanline2(t2[0], t2[1], t2[2], Color.white);
            // this.drawTriangleScanline2(t3[0], t3[1], t3[2], Color.green);
            this.drawTriangleBarycentric(t1[0], t1[1], t1[2], Color.red);
            this.drawTriangleBarycentric(t2[0], t2[1], t2[2], Color.white);
            this.drawTriangleBarycentric(t3[0], t3[1], t3[2], Color.green);
        }
        drawSampleModelFlatShading() {
            this.m_Canvas.width = 800;
            this.m_Canvas.height = 800;
            var loader = new OBJLoader_2.OBJLoader();
            //loader.load("african_head.obj", this.drawModelFlatShading.bind(this));
            //loader.load("african_head.obj", this.drawModelFlatShadingLight.bind(this)); // 关闭drawModelFlatShadingLight中的texture处理
            loader.load("african_head.obj", this.onModelWasLoaded.bind(this)); // 打开drawModelFlatShadingLight中的texture处理
        }
        onModelWasLoaded(loader) {
            this.m_TGALoader = new TGALoader_2.TGALoader();
            this.m_TGALoader.load("african_head_diffuse.tga", function () {
                this.drawModelFlatShadingLight(loader);
            }.bind(this));
        }
        // draw sample functions end
        drawDot(x, y, color) {
            x = Math.floor(x);
            y = Math.floor(y);
            y = this.m_Canvas.height - 1 - y; // 旋转成左下角为原点，同贴图的UV坐标系
            this.m_Ctx.fillStyle = color;
            this.m_Ctx.fillRect(x, y, 1, 1);
        }
        lineTwoPoint(x1, y1, x2, y2, color) {
            var dx = x2 - x1;
            var dy = y2 - y1;
            for (var delta = 0.0; delta <= 1.0; delta += 0.01) { // 注意这里的步长
                var x = x1 + dx * delta;
                var y = y1 + dy * delta;
                this.drawDot(x, y, color);
            }
        }
        // naive algorithm
        // This algorithm works just fine when dx>=dy (i.e., slope is less than or equal to 1), 
        // but if dx<dy (i.e., slope greater than 1), the line becomes quite sparse with many gaps, 
        // and in the limiting case of dx=0, a division by zero exception will occur.
        // 去掉步长，更高效，但是因为存在浮点计算也并没有那么高效
        lineTwoPoint2(x1, y1, x2, y2, color) {
            // x递增，存在方向性
            if (x1 > x2) {
                [x1, x2] = [x2, x1];
                [y1, y2] = [y2, y1];
            }
            var dx = x2 - x1;
            var dy = y2 - y1;
            for (var x = x1; x <= x2; x++) {
                var y = y1 + (x - x1) / dx * dy;
                this.drawDot(x, y, color);
            }
        }
        lineTwoPoint3(x1, y1, x2, y2, color) {
            var usingYIncrement = false;
            var dx = x2 - x1;
            var dy = y2 - y1;
            if (Math.abs(dy) > Math.abs(dx)) {
                [x1, y1] = [y1, x1];
                [x2, y2] = [y2, x2];
                usingYIncrement = true;
            }
            if (x1 > x2) {
                [x1, x2] = [x2, x1];
                [y1, y2] = [y2, y1];
            }
            var dx = x2 - x1;
            var dy = y2 - y1;
            for (var x = x1; x <= x2; x++) {
                var y = y1 + (x - x1) / dx * dy;
                if (usingYIncrement) {
                    this.drawDot(y, x, color);
                }
                else {
                    this.drawDot(x, y, color);
                }
            }
        }
        // 布雷森汉姆画线算法消除了算法中的乘、除操作
        lineBresenham(x1, y1, x2, y2, color) {
            var usingYIncrement = false;
            var dx = x2 - x1;
            var dy = y2 - y1;
            if (Math.abs(dy) > Math.abs(dx)) {
                [x1, y1] = [y1, x1];
                [x2, y2] = [y2, x2];
                usingYIncrement = true;
            }
            if (x1 > x2) {
                [x1, x2] = [x2, x1];
                [y1, y2] = [y2, y1];
            }
            var dx = x2 - x1;
            var dy = y2 - y1;
            var derr = Math.abs(dy / dx);
            var error = 0.0;
            var y = y1;
            for (var x = x1; x <= x2; x++) {
                if (usingYIncrement) {
                    this.drawDot(y, x, color);
                }
                else {
                    this.drawDot(x, y, color);
                }
                error += derr;
                if (error > 0.5) { // (x, y)表示像素中心，那么误差>0.5就可以移动y了
                    y += (y2 > y1 ? 1 : -1);
                    error -= 1.0;
                }
            }
        }
        // 通过整体 * dx * 2去掉浮点比较和计算
        lineBresenham2(x1, y1, x2, y2, color) {
            var usingYIncrement = false;
            var dx = x2 - x1;
            var dy = y2 - y1;
            if (Math.abs(dy) > Math.abs(dx)) {
                [x1, y1] = [y1, x1];
                [x2, y2] = [y2, x2];
                usingYIncrement = true;
            }
            if (x1 > x2) {
                [x1, x2] = [x2, x1];
                [y1, y2] = [y2, y1];
            }
            var dx = x2 - x1;
            var dy = y2 - y1;
            var dx2 = dx * 2;
            var derr2 = Math.abs(dy) * 2; // derr2 = derr * dx * 2, dx一定为正, derr2为整数
            var error = 0; // error为整数
            var y = y1;
            for (var x = x1; x <= x2; x++) {
                if (usingYIncrement) {
                    this.drawDot(y, x, color);
                }
                else {
                    this.drawDot(x, y, color);
                }
                error += derr2;
                if (error > dx) { // dx = 0.5 * dx * 2
                    y += (y2 > y1 ? 1 : -1);
                    error -= dx2; // dx2 = 1.0 * dx * 2
                }
            }
        }
        drawModelWireframe(loader) {
            var faceCount = loader.faceCount;
            for (var i = 0; i < faceCount; i++) {
                for (var j = 0; j < 3; j++) {
                    var v1 = loader.getFaceVertex(i, j);
                    var v2 = loader.getFaceVertex(i, (j + 1) % 3);
                    var x1 = (v1.x + 1.0) * this.m_Canvas.width * 0.5;
                    var y1 = (v1.y + 1.0) * this.m_Canvas.height * 0.5;
                    var x2 = (v2.x + 1.0) * this.m_Canvas.width * 0.5;
                    var y2 = (v2.y + 1.0) * this.m_Canvas.height * 0.5;
                    this.lineBresenham2(x1, y1, x2, y2, Color.white);
                }
            }
        }
        drawTriangle(v1, v2, v3, color) {
            this.lineBresenham2(v1.x, v1.y, v2.x, v2.y, color);
            this.lineBresenham2(v2.x, v2.y, v3.x, v3.y, color);
            this.lineBresenham2(v3.x, v3.y, v1.x, v1.y, color);
        }
        drawTriangleScanline(v1, v2, v3, color) {
            // 按UV坐标从下往上，从左到右扫描，按y排序应是v1.y <= v2.y <= v3.y
            if (v1.y > v2.y) {
                [v1, v2] = [v2, v1];
            }
            if (v1.y > v3.y) {
                [v1, v3] = [v3, v1];
            }
            if (v2.y > v3.y) {
                [v2, v3] = [v3, v2];
            }
            var height = v3.y - v1.y + 1;
            for (var y = v1.y; y <= v2.y; y++) {
                var lowerHeight = v2.y - v1.y + 1;
                var v13Lerp = (y - v1.y) / height;
                var v12Lerp = (y - v1.y) / lowerHeight; // 可能除0
                var p13 = Data_4.Vector3.add(v1, Data_4.Vector3.scale(Data_4.Vector3.subtract(v3, v1), v13Lerp)); // v1 + (v3 - v1) * v13Lerp, 点+向量
                var p12 = Data_4.Vector3.add(v1, Data_4.Vector3.scale(Data_4.Vector3.subtract(v2, v1), v12Lerp));
                // 这里是为了展示y轴连续但x轴不一定连续的问题，lineTwoPoint3当时有解决
                this.drawDot(p13.x, y, Color.red);
                this.drawDot(p12.x, y, Color.green);
                // 下面展示与画线不同，填充三角形不需要考虑线段不连续问题
                // 确保从左到右
                // if (p13.x > p12.x) {
                //     [p13, p12] = [p12, p13];
                // }
                // for (var x = p13.x; x <= p12.x; x++) {
                //     this.drawDot(x, y, color);
                // }
            }
        }
        // 整合drawTriangleScanline的上下两部分三角形
        drawTriangleScanline2(v1, v2, v3, color) {
            // 按UV坐标从下往上，从左到右扫描，按y排序应是v1.y <= v2.y <= v3.y
            if (v1.y > v2.y) {
                [v1, v2] = [v2, v1];
            }
            if (v1.y > v3.y) {
                [v1, v3] = [v3, v1];
            }
            if (v2.y > v3.y) {
                [v2, v3] = [v3, v2];
            }
            var height = v3.y - v1.y + 1;
            for (var i = 0; i < height; i++) {
                var isUpper = (i > v2.y - v1.y) || (v2.y == v1.y);
                var halfHeight = isUpper ? v3.y - v2.y + 1 : v2.y - v1.y + 1;
                var v13Lerp = i / (height - 1);
                var p13 = Data_4.Vector3.add(v1, Data_4.Vector3.scale(Data_4.Vector3.subtract(v3, v1), v13Lerp)); // v1 + (v3 - v1) * v13Lerp, 点+向量
                var p;
                if (isUpper) {
                    var v23Lerp = (i - (v2.y - v1.y)) / (halfHeight - 1);
                    p = Data_4.Vector3.add(v2, Data_4.Vector3.scale(Data_4.Vector3.subtract(v3, v2), v23Lerp));
                }
                else {
                    var v12Lerp = i / (halfHeight - 1);
                    p = Data_4.Vector3.add(v1, Data_4.Vector3.scale(Data_4.Vector3.subtract(v2, v1), v12Lerp));
                }
                // 确保从左到右
                if (p13.x > p.x) {
                    [p13, p] = [p, p13];
                }
                var y = v1.y + i;
                for (var x = p13.x; x <= p.x; x++) {
                    this.drawDot(x, y, color);
                }
            }
        }
        barycentric(a, b, c, p) {
            // P的重心坐标表示要满足(1 - u - v, u, v)，即P = (1 - u - v) * A + u * B + v * C = A + u * (B - A) + v * (C - A)
            // 表示为向量算法为PA + u * AB + v * AC = 0，即[v, u, 1] * [AC, AB, PA] = 0
            // 那么cross出来的vec里x代表v，y代表u，z不为0的情况下各分量除以z就满足了[v, u, 1]的形式，u v也就算出来了
            var xVec = new Data_4.Vector3(c.x - a.x, b.x - a.x, a.x - p.x);
            var yVec = new Data_4.Vector3(c.y - a.y, b.y - a.y, a.y - p.y);
            var vec = Data_4.Vector3.cross(xVec, yVec);
            if (Math.abs(vec.z) > 1e-2) {
                var v = vec.x / vec.z;
                var u = vec.y / vec.z;
                return new Data_4.Vector3(1 - u - v, u, v);
            }
            return new Data_4.Vector3(-1, 1, 1);
        }
        drawTriangleBarycentric(v1, v2, v3, color) {
            var minBox = new Data_4.Vector3(this.m_Canvas.width - 1, this.m_Canvas.height - 1);
            var maxBox = new Data_4.Vector3();
            minBox.x = Math.max(Math.min(minBox.x, v1.x, v2.x, v3.x), 0);
            minBox.y = Math.max(Math.min(minBox.y, v1.y, v2.y, v3.y), 0);
            maxBox.x = Math.min(Math.max(maxBox.x, v1.x, v2.x, v3.x), this.m_Canvas.width - 1);
            maxBox.y = Math.min(Math.max(maxBox.y, v1.y, v2.y, v3.y), this.m_Canvas.height - 1);
            var p = new Data_4.Vector3();
            for (var x = minBox.x; x <= maxBox.x; x++) {
                for (var y = minBox.y; y <= maxBox.y; y++) {
                    p.x = x;
                    p.y = y;
                    var bc = this.barycentric(v1, v2, v3, p);
                    if (bc.x < 0 || bc.y < 0 || bc.z < 0) {
                        continue;
                    }
                    else {
                        this.drawDot(x, y, color);
                    }
                }
            }
        }
        drawTriangleBarycentricZBuffer(v1, v2, v3, color, uv1 = null, uv2 = null, uv3 = null) {
            var minBox = new Data_4.Vector3(this.m_Canvas.width - 1, this.m_Canvas.height - 1);
            var maxBox = new Data_4.Vector3();
            minBox.x = Math.max(Math.min(minBox.x, v1.x, v2.x, v3.x), 0);
            minBox.y = Math.max(Math.min(minBox.y, v1.y, v2.y, v3.y), 0);
            maxBox.x = Math.min(Math.max(maxBox.x, v1.x, v2.x, v3.x), this.m_Canvas.width - 1);
            maxBox.y = Math.min(Math.max(maxBox.y, v1.y, v2.y, v3.y), this.m_Canvas.height - 1);
            var p = new Data_4.Vector3();
            for (var x = minBox.x; x <= maxBox.x; x++) {
                for (var y = minBox.y; y <= maxBox.y; y++) {
                    p.x = x;
                    p.y = y;
                    var bc = this.barycentric(v1, v2, v3, p);
                    p.z = v1.z * bc.x + v2.z * bc.y + v3.z * bc.z; // 插值z
                    if (bc.x < 0 || bc.y < 0 || bc.z < 0) {
                        continue;
                    }
                    else {
                        if (!this.m_ZBuffer) {
                            var bufferSize = this.m_Canvas.width * this.m_Canvas.height;
                            this.m_ZBuffer = [];
                            for (var i = 0; i < bufferSize; i++) {
                                this.m_ZBuffer[i] = -Number.MAX_VALUE;
                            }
                        }
                        var index = x + y * this.m_Canvas.width;
                        if (p.z > this.m_ZBuffer[index]) { // 坐标系z向屏幕外，所以z越大越近
                            this.m_ZBuffer[index] = p.z;
                            if (uv1 && uv2 && uv3) {
                                var u = uv1.x * bc.x + uv2.x * bc.y + uv3.x * bc.z;
                                var v = uv1.y * bc.x + uv2.y * bc.y + uv3.y * bc.z;
                                var rgb = this.m_TGALoader.getColor(u, v);
                                color = "rgb(" + rgb.x + ", " + rgb.y + ", " + rgb.z + ")";
                            }
                            this.drawDot(x, y, color);
                        }
                    }
                }
            }
        }
        // Model to Screen
        m2s(v) {
            var result = new Data_4.Vector3();
            result.x = Math.floor((v.x + 1.0) * this.m_Canvas.width * 0.5); // 注意要加上Math.floor
            result.y = Math.floor((v.y + 1.0) * this.m_Canvas.height * 0.5);
            result.z = v.z; // x, y因为是屏幕像素位置固要取整，z用于zbuffer保留精度
            return result;
        }
        // eye: camera position
        // target: lookat point
        // up: camera's up vection
        // view matrix计算步骤：
        // 1. 平移矩阵将eye移回原点-eye
        // 2. 将camera的x/y/z轴旋转对齐坐标系的x/y/z轴，求这个旋转不容易，但可以求它的逆旋转，再转置（旋转矩阵的转置矩阵等于它的逆矩阵）
        lookat(eye, target, up) {
            var cameraZ = Data_4.Vector3.normalize(Data_4.Vector3.subtract(eye, target)); // 我们的右手坐标系x/y/z分别对应右、上、外，camera是看向-z轴的，所以camera的z轴是eye-target
            var cameraX = Data_4.Vector3.normalize(Data_4.Vector3.cross(up, cameraZ)); // camera的上叉乘外得到右即x轴
            var cameraY = Data_4.Vector3.normalize(Data_4.Vector3.cross(cameraZ, cameraX)); // 原up不一定与计算出的cameraZ和cameraX正交，因此要算出一个cameraY相互正交，才能用这个正交坐标系的x/y/z与原坐标系的x/y/z一一对齐。这里计算出的cameraY不是camera的up方向。
            var translation = new Data_4.Matrix4x4();
            translation.identity();
            translation.set(0, 3, -eye.x);
            translation.set(1, 3, -eye.y);
            translation.set(2, 3, -eye.z);
            var rotation = new Data_4.Matrix4x4();
            rotation.identity();
            rotation.set(0, 0, cameraX.x);
            rotation.set(1, 0, cameraX.y);
            rotation.set(2, 0, cameraX.z);
            rotation.set(0, 1, cameraY.x);
            rotation.set(1, 1, cameraY.y);
            rotation.set(2, 1, cameraY.z);
            rotation.set(0, 2, cameraZ.x);
            rotation.set(1, 2, cameraZ.y);
            rotation.set(2, 2, cameraZ.z);
            rotation.transpose();
            return Data_4.Matrix4x4.multiply(translation, rotation);
        }
        projection(distance) {
            var projection = new Data_4.Matrix4x4();
            projection.identity();
            projection.set(3, 2, -1 / distance);
            // projection.set(0, 0, -distance);
            // projection.set(1, 1, -distance);
            // projection.set(2, 2, -distance);
            // projection.set(3, 3, -distance);
            // projection.set(3, 2, 1);
            return projection;
        }
        drawModelFlatShading(loader) {
            var faceCount = loader.faceCount;
            for (var i = 0; i < faceCount; i++) {
                var v1 = loader.getFaceVertex(i, 0);
                var v2 = loader.getFaceVertex(i, 1);
                var v3 = loader.getFaceVertex(i, 2);
                var r = Math.floor(Math.random() * 255);
                var g = Math.floor(Math.random() * 255);
                var b = Math.floor(Math.random() * 255);
                var color = "rgb(" + r + ", " + g + ", " + b + ")";
                //this.drawTriangleScanline2(this.m2s(v1), this.m2s(v2), this.m2s(v3), color);
                this.drawTriangleBarycentric(this.m2s(v1), this.m2s(v2), this.m2s(v3), color);
            }
        }
        drawModelFlatShadingLight(loader) {
            var faceCount = loader.faceCount;
            var viewMatrix = this.lookat(new Data_4.Vector3(0, 0, 1), new Data_4.Vector3(0, 0, 0), Data_4.Vector3.up);
            var projectionMatrix = this.projection(2);
            viewMatrix = Data_4.Matrix4x4.multiply(viewMatrix, projectionMatrix);
            for (var i = 0; i < faceCount; i++) {
                var v1 = loader.getFaceVertex(i, 0);
                var v2 = loader.getFaceVertex(i, 1);
                var v3 = loader.getFaceVertex(i, 2);
                var normal = Data_4.Vector3.normalize(Data_4.Vector3.cross(Data_4.Vector3.subtract(v3, v1), Data_4.Vector3.subtract(v2, v1)));
                var lightDir = new Data_4.Vector3(0, 0, -1); // uv坐标系x向右，y向上。模型采用右手坐标系，所以z向屏幕外。
                var intensity = Data_4.Vector3.dot(normal, lightDir);
                // 配合lookat
                v1 = v1.multiplyMatrix4x4(viewMatrix);
                v2 = v2.multiplyMatrix4x4(viewMatrix);
                v3 = v3.multiplyMatrix4x4(viewMatrix);
                if (intensity > 0) {
                    var r = Math.floor(intensity * 255);
                    var g = Math.floor(intensity * 255);
                    var b = Math.floor(intensity * 255);
                    var color = "rgb(" + r + ", " + g + ", " + b + ")";
                    //this.drawTriangleScanline2(this.m2s(v1), this.m2s(v2), this.m2s(v3), color);
                    //this.drawTriangleBarycentric(this.m2s(v1), this.m2s(v2), this.m2s(v3), color);    // artifacts
                    //this.drawTriangleBarycentricZBuffer(this.m2s(v1), this.m2s(v2), this.m2s(v3), color);   // artifacts
                    // texture
                    var uv1 = loader.getFaceVertexUV(i, 0);
                    var uv2 = loader.getFaceVertexUV(i, 1);
                    var uv3 = loader.getFaceVertexUV(i, 2);
                    this.drawTriangleBarycentricZBuffer(this.m2s(v1), this.m2s(v2), this.m2s(v3), color, uv1, uv2, uv3);
                }
            }
        }
    }
    exports.Main = Main;
});
//# sourceMappingURL=engine.js.map