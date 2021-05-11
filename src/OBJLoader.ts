import { Face, Vector3 } from "./Data";

// https://en.wikipedia.org/wiki/Wavefront_.obj_file
// https://threejs.org/examples/jsm/loaders/OBJLoader.js
export class OBJLoader {
    private m_VertexArray: Vector3[] = [];
    private m_UVArray: Vector3[] = [];
    private m_NormalArray: Vector3[] = [];
    private m_FaceArray: Face[] = [];

    public get faceCount(): number {
        return this.m_FaceArray.length;
    }

    public getFace(index: number): Face {
        return this.m_FaceArray[index];
    }

    public getVertex(index: number): Vector3 {
        return this.m_VertexArray[index];
    }

    public getFaceVertex(faceIndex: number, vertexIndex: number): Vector3 {
        var face = this.m_FaceArray[faceIndex];
        var realVertexIndex = face.vertexIndexs[vertexIndex] - 1;   // Wavefront .obj file index从1开始，这里要转换为从0开始
        return this.m_VertexArray[realVertexIndex];
    }

    public getFaceVertexUV(faceIndex: number, vertexIndex: number): Vector3 {
        var face = this.m_FaceArray[faceIndex];
        var uvIndex = face.textureIndexs[vertexIndex] - 1;
        return this.m_UVArray[uvIndex];
    }

    public getFaceVertexNormal(faceIndex: number, vertexIndex: number): Vector3 {
        var face = this.m_FaceArray[faceIndex];
        var normalIndex = face.normalIndexs[vertexIndex] - 1;
        return this.m_NormalArray[normalIndex];
    }

    public load(url: string, callback: any): void {
        var xhr: XMLHttpRequest = new XMLHttpRequest();
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

    private parse(text: string): void {
        if (text) {
            var lines = text.split('\n');
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                var firstChar = line[0];
                if (firstChar === '#') {
                    continue;
                } else if (firstChar === 'v') {
                    var data = line.split(/\s+/);
                    switch (data[0]) {
                        case 'v':
                            var v = new Vector3();
                            v.x = parseFloat(data[1]);
                            v.y = parseFloat(data[2]);
                            v.z = parseFloat(data[3]);
                            this.m_VertexArray.push(v);
                            break;
                        case 'vt':
                            this.m_UVArray.push(new Vector3(parseFloat(data[1]), parseFloat(data[2])));
                            break;
                        case 'vn':
                            var normal = new Vector3();
                            normal.x = parseFloat(data[1]);
                            normal.y = parseFloat(data[2]);
                            normal.z = parseFloat(data[3]);
                            this.m_NormalArray.push(normal);
                            break;
                    }
                } else if (firstChar === 'f') {
                    var data = line.split(/\s+/);
                    var f = new Face();
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