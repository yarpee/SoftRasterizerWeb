import { Matrix4x4, Vector3 } from "./Data";
import { OBJLoader } from "./OBJLoader";
import { RefactorMain } from "./RefactorMain";
import { TGALoader } from "./TGALoader";

enum Color {
    red = "rgb(255, 0, 0)",
    green = "rgb(0, 255, 0)",
    blue = "rgb(0, 0, 255)",
    white = "rgb(255, 255, 255)"
}

export class Main {
    private m_Canvas: HTMLCanvasElement;
    private m_Ctx: CanvasRenderingContext2D;
    private m_ZBuffer: number[];
    private m_TGALoader: TGALoader;

    constructor() {
        this.m_Canvas = document.getElementById('glcanvas') as HTMLCanvasElement;
        this.m_Ctx = this.m_Canvas.getContext('2d');

        //this.drawSampleLine();

        //this.drawSampleModelWireframe();

        //this.drawSampleTriangle();

        //this.drawSampleModelFlatShading();

        new RefactorMain();
    }

    // draw sample functions start
    drawSampleLine(): void {
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

    drawSampleModelWireframe(): void {
        var loader = new OBJLoader();
        loader.load("african_head.obj", this.drawModelWireframe.bind(this));
    }

    drawSampleTriangle(): void {
        this.m_Canvas.width = 200;
        this.m_Canvas.height = 200;
        var t1: Vector3[] = [new Vector3(10, 70), new Vector3(50, 160), new Vector3(70, 80)];
        var t2: Vector3[] = [new Vector3(180, 50), new Vector3(150, 1), new Vector3(70, 180)];
        var t3: Vector3[] = [new Vector3(180, 150), new Vector3(120, 160), new Vector3(130, 180)];
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

    drawSampleModelFlatShading(): void {
        this.m_Canvas.width = 800;
        this.m_Canvas.height = 800;
        var loader = new OBJLoader();
        //loader.load("african_head.obj", this.drawModelFlatShading.bind(this));
        //loader.load("african_head.obj", this.drawModelFlatShadingLight.bind(this)); // ??????drawModelFlatShadingLight??????texture??????
        loader.load("african_head.obj", this.onModelWasLoaded.bind(this));    // ??????drawModelFlatShadingLight??????texture??????
    }

    onModelWasLoaded(loader: OBJLoader): void {
        this.m_TGALoader = new TGALoader();
        this.m_TGALoader.load("african_head_diffuse.tga", function () {
            this.drawModelFlatShadingLight(loader);
        }.bind(this));
    }
    // draw sample functions end

    drawDot(x: number, y: number, color: Color | string): void {
        x = Math.floor(x);
        y = Math.floor(y);
        y = this.m_Canvas.height - 1 - y;   // ??????????????????????????????????????????UV?????????
        this.m_Ctx.fillStyle = color;
        this.m_Ctx.fillRect(x, y, 1, 1);
    }

    lineTwoPoint(x1: number, y1: number, x2: number, y2: number, color: Color): void {
        var dx = x2 - x1;
        var dy = y2 - y1;
        for (var delta = 0.0; delta <= 1.0; delta += 0.01) {    // ?????????????????????
            var x = x1 + dx * delta;
            var y = y1 + dy * delta;
            this.drawDot(x, y, color);
        }
    }

    // naive algorithm
    // This algorithm works just fine when dx>=dy (i.e., slope is less than or equal to 1), 
    // but if dx<dy (i.e., slope greater than 1), the line becomes quite sparse with many gaps, 
    // and in the limiting case of dx=0, a division by zero exception will occur.
    // ?????????????????????????????????????????????????????????????????????????????????
    lineTwoPoint2(x1: number, y1: number, x2: number, y2: number, color: Color): void {
        // x????????????????????????
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

    lineTwoPoint3(x1: number, y1: number, x2: number, y2: number, color: Color): void {
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
            } else {
                this.drawDot(x, y, color);
            }
        }
    }

    // ???????????????????????????????????????????????????????????????
    lineBresenham(x1: number, y1: number, x2: number, y2: number, color: Color): void {
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
            } else {
                this.drawDot(x, y, color);
            }
            error += derr;
            if (error > 0.5) {  // (x, y)?????????????????????????????????>0.5???????????????y???
                y += (y2 > y1 ? 1 : -1);
                error -= 1.0;
            }
        }
    }

    // ???????????? * dx * 2???????????????????????????
    lineBresenham2(x1: number, y1: number, x2: number, y2: number, color: Color): void {
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
        var derr2 = Math.abs(dy) * 2;   // derr2 = derr * dx * 2, dx????????????, derr2?????????
        var error = 0;  // error?????????
        var y = y1;
        for (var x = x1; x <= x2; x++) {
            if (usingYIncrement) {
                this.drawDot(y, x, color);
            } else {
                this.drawDot(x, y, color);
            }
            error += derr2;
            if (error > dx) {  // dx = 0.5 * dx * 2
                y += (y2 > y1 ? 1 : -1);
                error -= dx2;   // dx2 = 1.0 * dx * 2
            }
        }
    }

    drawModelWireframe(loader: OBJLoader): void {
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

    drawTriangle(v1: Vector3, v2: Vector3, v3: Vector3, color: Color): void {
        this.lineBresenham2(v1.x, v1.y, v2.x, v2.y, color);
        this.lineBresenham2(v2.x, v2.y, v3.x, v3.y, color);
        this.lineBresenham2(v3.x, v3.y, v1.x, v1.y, color);
    }

    drawTriangleScanline(v1: Vector3, v2: Vector3, v3: Vector3, color: Color): void {
        // ???UV?????????????????????????????????????????????y????????????v1.y <= v2.y <= v3.y
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
            var v12Lerp = (y - v1.y) / lowerHeight; // ?????????0
            var p13 = Vector3.add(v1, Vector3.scale(Vector3.subtract(v3, v1), v13Lerp));    // v1 + (v3 - v1) * v13Lerp, ???+??????
            var p12 = Vector3.add(v1, Vector3.scale(Vector3.subtract(v2, v1), v12Lerp));
            // ?????????????????????y????????????x??????????????????????????????lineTwoPoint3???????????????
            this.drawDot(p13.x, y, Color.red);
            this.drawDot(p12.x, y, Color.green);
            // ?????????????????????????????????????????????????????????????????????????????????
            // ??????????????????
            // if (p13.x > p12.x) {
            //     [p13, p12] = [p12, p13];
            // }
            // for (var x = p13.x; x <= p12.x; x++) {
            //     this.drawDot(x, y, color);
            // }
        }
    }

    // ??????drawTriangleScanline???????????????????????????
    drawTriangleScanline2(v1: Vector3, v2: Vector3, v3: Vector3, color: Color | string): void {
        // ???UV?????????????????????????????????????????????y????????????v1.y <= v2.y <= v3.y
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
            var p13 = Vector3.add(v1, Vector3.scale(Vector3.subtract(v3, v1), v13Lerp));    // v1 + (v3 - v1) * v13Lerp, ???+??????
            var p;
            if (isUpper) {
                var v23Lerp = (i - (v2.y - v1.y)) / (halfHeight - 1);
                p = Vector3.add(v2, Vector3.scale(Vector3.subtract(v3, v2), v23Lerp));
            } else {
                var v12Lerp = i / (halfHeight - 1);
                p = Vector3.add(v1, Vector3.scale(Vector3.subtract(v2, v1), v12Lerp));
            }
            // ??????????????????
            if (p13.x > p.x) {
                [p13, p] = [p, p13];
            }
            var y = v1.y + i;
            for (var x = p13.x; x <= p.x; x++) {
                this.drawDot(x, y, color);
            }
        }
    }

    barycentric(a: Vector3, b: Vector3, c: Vector3, p: Vector3): Vector3 {
        // P??????????????????????????????(1 - u - v, u, v)??????P = (1 - u - v) * A + u * B + v * C = A + u * (B - A) + v * (C - A)
        // ????????????????????????PA + u * AB + v * AC = 0??????[v, u, 1] * [AC, AB, PA] = 0
        // ??????cross?????????vec???x??????v???y??????u???z??????0???????????????????????????z????????????[v, u, 1]????????????u v??????????????????
        var xVec = new Vector3(c.x - a.x, b.x - a.x, a.x - p.x);
        var yVec = new Vector3(c.y - a.y, b.y - a.y, a.y - p.y);
        var vec = Vector3.cross(xVec, yVec);
        if (Math.abs(vec.z) > 1e-2) {
            var v = vec.x / vec.z;
            var u = vec.y / vec.z;
            return new Vector3(1 - u - v, u, v);
        }
        return new Vector3(-1, 1, 1);
    }

    drawTriangleBarycentric(v1: Vector3, v2: Vector3, v3: Vector3, color: Color | string): void {
        var minBox = new Vector3(this.m_Canvas.width - 1, this.m_Canvas.height - 1);
        var maxBox = new Vector3();
        minBox.x = Math.max(Math.min(minBox.x, v1.x, v2.x, v3.x), 0);
        minBox.y = Math.max(Math.min(minBox.y, v1.y, v2.y, v3.y), 0);
        maxBox.x = Math.min(Math.max(maxBox.x, v1.x, v2.x, v3.x), this.m_Canvas.width - 1);
        maxBox.y = Math.min(Math.max(maxBox.y, v1.y, v2.y, v3.y), this.m_Canvas.height - 1);
        var p = new Vector3();
        for (var x = minBox.x; x <= maxBox.x; x++) {
            for (var y = minBox.y; y <= maxBox.y; y++) {
                p.x = x;
                p.y = y;
                var bc = this.barycentric(v1, v2, v3, p);
                if (bc.x < 0 || bc.y < 0 || bc.z < 0) {
                    continue;
                } else {
                    this.drawDot(x, y, color);
                }
            }
        }
    }

    drawTriangleBarycentricZBuffer(v1: Vector3, v2: Vector3, v3: Vector3, color: Color | string,
        uv1: Vector3 = null, uv2: Vector3 = null, uv3: Vector3 = null): void {
        var minBox = new Vector3(this.m_Canvas.width - 1, this.m_Canvas.height - 1);
        var maxBox = new Vector3();
        minBox.x = Math.max(Math.min(minBox.x, v1.x, v2.x, v3.x), 0);
        minBox.y = Math.max(Math.min(minBox.y, v1.y, v2.y, v3.y), 0);
        maxBox.x = Math.min(Math.max(maxBox.x, v1.x, v2.x, v3.x), this.m_Canvas.width - 1);
        maxBox.y = Math.min(Math.max(maxBox.y, v1.y, v2.y, v3.y), this.m_Canvas.height - 1);
        var p = new Vector3();
        for (var x = minBox.x; x <= maxBox.x; x++) {
            for (var y = minBox.y; y <= maxBox.y; y++) {
                p.x = x;
                p.y = y;
                var bc = this.barycentric(v1, v2, v3, p);
                p.z = v1.z * bc.x + v2.z * bc.y + v3.z * bc.z;  // ??????z
                if (bc.x < 0 || bc.y < 0 || bc.z < 0) {
                    continue;
                } else {
                    if (!this.m_ZBuffer) {
                        var bufferSize = this.m_Canvas.width * this.m_Canvas.height;
                        this.m_ZBuffer = [];
                        for (var i = 0; i < bufferSize; i++) {
                            this.m_ZBuffer[i] = -Number.MAX_VALUE;
                        }
                    }
                    var index = x + y * this.m_Canvas.width;
                    if (p.z > this.m_ZBuffer[index]) {// ?????????z?????????????????????z????????????
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
    m2s(v: Vector3): Vector3 {
        var result = new Vector3();
        result.x = Math.floor((v.x + 1.0) * this.m_Canvas.width * 0.5); // ???????????????Math.floor
        result.y = Math.floor((v.y + 1.0) * this.m_Canvas.height * 0.5);
        result.z = v.z; // x, y??????????????????????????????????????????z??????zbuffer????????????
        return result;
    }

    // eye: camera position
    // target: lookat point
    // up: camera's up vection
    // view matrix???????????????
    // 1. ???????????????eye????????????-eye
    // 2. ???camera???x/y/z???????????????????????????x/y/z??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    lookat(eye: Vector3, target: Vector3, up: Vector3): Matrix4x4 {
        var cameraZ = Vector3.normalize(Vector3.subtract(eye, target)); // ????????????????????????x/y/z??????????????????????????????camera?????????-z???????????????camera???z??????eye-target
        var cameraX = Vector3.normalize(Vector3.cross(up, cameraZ));    // camera???????????????????????????x???
        var cameraY = Vector3.normalize(Vector3.cross(cameraZ, cameraX));   // ???up????????????????????????cameraZ???cameraX??????????????????????????????cameraY????????????????????????????????????????????????x/y/z??????????????????x/y/z?????????????????????????????????cameraY??????camera???up?????????
        var translation = new Matrix4x4();
        translation.identity();
        translation.set(0, 3, -eye.x);
        translation.set(1, 3, -eye.y);
        translation.set(2, 3, -eye.z);
        var rotation = new Matrix4x4();
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
        return Matrix4x4.multiply(translation, rotation);
    }

    projection(distance: number): Matrix4x4 {
        var projection = new Matrix4x4();
        projection.identity();
        projection.set(3, 2, -1 / distance);
        // projection.set(0, 0, -distance);
        // projection.set(1, 1, -distance);
        // projection.set(2, 2, -distance);
        // projection.set(3, 3, -distance);
        // projection.set(3, 2, 1);
        return projection;
    }

    drawModelFlatShading(loader: OBJLoader): void {
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

    drawModelFlatShadingLight(loader: OBJLoader): void {
        var faceCount = loader.faceCount;
        var viewMatrix = this.lookat(new Vector3(0, 0, 1), new Vector3(0, 0, 0), Vector3.up);
        var projectionMatrix = this.projection(2);
        viewMatrix = Matrix4x4.multiply(viewMatrix, projectionMatrix);
        for (var i = 0; i < faceCount; i++) {
            var v1 = loader.getFaceVertex(i, 0);
            var v2 = loader.getFaceVertex(i, 1);
            var v3 = loader.getFaceVertex(i, 2);

            var normal = Vector3.normalize(Vector3.cross(Vector3.subtract(v3, v1), Vector3.subtract(v2, v1)));
            var lightDir = new Vector3(0, 0, -1);   // uv?????????x?????????y?????????????????????????????????????????????z???????????????
            var intensity = Vector3.dot(normal, lightDir);

            // ??????lookat
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