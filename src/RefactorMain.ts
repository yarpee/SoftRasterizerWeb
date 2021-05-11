import { Matrix4x4, Vector3 } from "./Data";
import { OBJLoader } from "./OBJLoader";
import { TGALoader } from "./TGALoader";

enum Color {
    red = "rgb(255, 0, 0)",
    green = "rgb(0, 255, 0)",
    blue = "rgb(0, 0, 255)",
    white = "rgb(255, 255, 255)"
}

export class RefactorMain {
    private m_Canvas: HTMLCanvasElement;
    private m_Ctx: CanvasRenderingContext2D;
    private m_OBJLoader: OBJLoader;
    private m_DiffuseLoader: TGALoader;
    private m_NormalLoader: TGALoader;
    private m_SpecularLoader: TGALoader;

    private cameraPos: Vector3 = new Vector3(0, 0, 1);
    private target: Vector3 = new Vector3(0, 0, 0);
    private cameraUp: Vector3 = new Vector3(0, 1, 0);
    private lightDir: Vector3 = new Vector3(1, 0, 1);

    constructor() {
        this.m_Canvas = document.getElementById('glcanvas') as HTMLCanvasElement;
        this.m_Ctx = this.m_Canvas.getContext('2d');
        OpenGL.Canvas = this.m_Canvas;
        OpenGL.Context = this.m_Ctx;
        this.m_Canvas.width = 800;
        this.m_Canvas.height = 800;
        this.m_OBJLoader = new OBJLoader();
        this.m_OBJLoader.load("african_head.obj", this.onModelWasLoaded.bind(this));
        OpenGL.lookat(this.cameraPos, this.target, this.cameraUp);
        OpenGL.projection(Vector3.subtract(this.cameraPos, this.target).length);
        OpenGL.viewport(0, 0, 800, 800);
    }

    onModelWasLoaded(loader: OBJLoader): void {
        this.m_DiffuseLoader = new TGALoader();
        this.m_DiffuseLoader.load("african_head_diffuse.tga", function () {
            this.m_NormalLoader = new TGALoader();
            this.m_NormalLoader.load("african_head_nm_tangent.tga", function () {
                this.m_SpecularLoader = new TGALoader();
                this.m_SpecularLoader.load("african_head_spec.tga", function () {
                    this.drawModelFlatShadingLight(loader);
                }.bind(this));
                //this.drawModelFlatShadingLight(loader);
            }.bind(this));
            //this.drawModelFlatShadingLight(loader);
        }.bind(this));
    }

    drawModelFlatShadingLight(loader: OBJLoader): void {
        var shader = new PhongShader();
        shader.diffuseTexture = this.m_DiffuseLoader;
        shader.normalTexture = this.m_NormalLoader;
        shader.specularTexture = this.m_SpecularLoader;
        shader.lightDir = Vector3.normalize(this.lightDir);
        shader.cameraPos = this.cameraPos;
        OpenGL.drawModel(loader, shader);
    }
}

export class OpenGL {
    public static Canvas: HTMLCanvasElement;
    public static Context: CanvasRenderingContext2D;
    public static ViewMatrix: Matrix4x4;
    public static ProjectionMatrix: Matrix4x4;
    public static ViewportMatrix: Matrix4x4;
    public static ZBuffer: number[];
    public static Shader: IShader;

    // eye: camera position
    // target: lookat point
    // up: camera's up vection
    // view matrix计算步骤：
    // 1. 平移矩阵将eye移回原点-eye
    // 2. 将camera的x/y/z轴旋转对齐坐标系的x/y/z轴，求这个旋转不容易，但可以求它的逆旋转，再转置（旋转矩阵的转置矩阵等于它的逆矩阵）
    public static lookat(eye: Vector3, target: Vector3, up: Vector3): Matrix4x4 {
        var cameraZ = Vector3.normalize(Vector3.subtract(eye, target)); // 我们的右手坐标系x/y/z分别对应右、上、外，camera是看向-z轴的，所以camera的z轴是eye-target
        var cameraX = Vector3.normalize(Vector3.cross(up, cameraZ));    // camera的上叉乘外得到右即x轴
        var cameraY = Vector3.normalize(Vector3.cross(cameraZ, cameraX));   // 原up不一定与计算出的cameraZ和cameraX正交，因此要算出一个cameraY相互正交，才能用这个正交坐标系的x/y/z与原坐标系的x/y/z一一对齐。这里计算出的cameraY不是camera的up方向。
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
        this.ViewMatrix = Matrix4x4.multiply(translation, rotation);
        return this.ViewMatrix;
    }

    public static projection(distance: number): Matrix4x4 {
        var projection = new Matrix4x4();
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
    public static viewport(x: number, y: number, width: number, height: number): Matrix4x4 {
        var translation = new Matrix4x4();
        translation.identity();
        translation.set(0, 3, 1);
        translation.set(1, 3, 1);
        translation.set(2, 3, 1);
        var scale = new Matrix4x4();
        scale.identity();
        scale.set(0, 0, 0.5);
        scale.set(1, 1, 0.5);
        scale.set(2, 2, 0.5);
        var scale2 = new Matrix4x4();
        scale2.identity();
        scale2.set(0, 0, width);
        scale2.set(1, 1, height);
        var translation2 = new Matrix4x4();
        translation2.identity();
        translation2.set(0, 3, x);
        translation2.set(1, 3, y);
        //this.ViewportMatrix = Matrix4x4.multiply(Matrix4x4.multiply(translation, scale), scale2);
        this.ViewportMatrix = Matrix4x4.multiply(Matrix4x4.multiply(Matrix4x4.multiply(translation, scale), scale2), translation2);
        return this.ViewportMatrix;
    }

    public static drawDot(x: number, y: number, color: Color | string): void {
        x = Math.floor(x);
        y = Math.floor(y);
        y = OpenGL.Canvas.height - 1 - y;   // 旋转成左下角为原点，同贴图的UV坐标系
        OpenGL.Context.fillStyle = color;
        OpenGL.Context.fillRect(x, y, 1, 1);
    }

    public static drawModel(loader: OBJLoader, shader: IShader): void {
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

    private static barycentric(a: Vector3, b: Vector3, c: Vector3, p: Vector3): Vector3 {
        // P的重心坐标表示要满足(1 - u - v, u, v)，即P = (1 - u - v) * A + u * B + v * C = A + u * (B - A) + v * (C - A)
        // 表示为向量算法为PA + u * AB + v * AC = 0，即[v, u, 1] * [AC, AB, PA] = 0
        // 那么cross出来的vec里x代表v，y代表u，z不为0的情况下各分量除以z就满足了[v, u, 1]的形式，u v也就算出来了
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

    private static drawTriangleBarycentricZBuffer(v1: Vector3, v2: Vector3, v3: Vector3): void {
        v1.floorXY();
        v2.floorXY();
        v3.floorXY();
        var minBox = new Vector3(OpenGL.Canvas.width - 1, OpenGL.Canvas.height - 1);
        var maxBox = new Vector3();
        minBox.x = Math.max(Math.min(minBox.x, v1.x, v2.x, v3.x), 0);
        minBox.y = Math.max(Math.min(minBox.y, v1.y, v2.y, v3.y), 0);
        maxBox.x = Math.min(Math.max(maxBox.x, v1.x, v2.x, v3.x), OpenGL.Canvas.width - 1);
        maxBox.y = Math.min(Math.max(maxBox.y, v1.y, v2.y, v3.y), OpenGL.Canvas.height - 1);
        var p = new Vector3();
        for (var x = minBox.x; x <= maxBox.x; x++) {
            for (var y = minBox.y; y <= maxBox.y; y++) {
                p.x = x;
                p.y = y;
                var bc = OpenGL.barycentric(v1, v2, v3, p);
                p.z = v1.z * bc.x + v2.z * bc.y + v3.z * bc.z;  // 插值z
                if (bc.x < 0 || bc.y < 0 || bc.z < 0) {
                    continue;
                } else {
                    if (!this.ZBuffer) {
                        var bufferSize = OpenGL.Canvas.width * OpenGL.Canvas.height;
                        this.ZBuffer = [];
                        for (var i = 0; i < bufferSize; i++) {
                            this.ZBuffer[i] = 0;
                        }
                    }
                    var index = x + y * OpenGL.Canvas.width;
                    if (p.z > this.ZBuffer[index]) {// 坐标系z向屏幕外，所以z越大越近
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

export interface IShader {
    vertex(v: Vector3, uv: Vector3, normal: Vector3, index: number): Vector3;
    fragment(bc: Vector3): any;
}

export class GouraudShader implements IShader {
    diffuseTexture: TGALoader;
    lightDir: Vector3;
    varying_uv: Vector3[] = [new Vector3(), new Vector3(), new Vector3()];
    varying_intensity: number[] = [0, 0, 0];

    vertex(v: Vector3, uv: Vector3, normal: Vector3, index: number): Vector3 {
        //var MVP = OpenGL.ViewportMatrix;
        var MVP = Matrix4x4.multiply(Matrix4x4.multiply(OpenGL.ViewMatrix, OpenGL.ProjectionMatrix), OpenGL.ViewportMatrix);
        var glVertex = v.multiplyMatrix4x4(MVP);
        this.varying_uv[index].x = uv.x;
        this.varying_uv[index].y = uv.y;
        this.varying_intensity[index] = Math.max(Vector3.dot(normal, this.lightDir), 0);
        return glVertex;
    }

    fragment(bc: Vector3): any {
        var u = this.varying_uv[0].x * bc.x + this.varying_uv[1].x * bc.y + this.varying_uv[2].x * bc.z;
        var v = this.varying_uv[0].y * bc.x + this.varying_uv[1].y * bc.y + this.varying_uv[2].y * bc.z;
        var rgb = this.diffuseTexture.getColor(u, v);
        var intensity = this.varying_intensity[0] * bc.x + this.varying_intensity[1] * bc.y + this.varying_intensity[2] * bc.z;
        rgb = Vector3.scale(rgb, intensity);
        var outColor = "rgb(" + rgb.x + ", " + rgb.y + ", " + rgb.z + ")";
        return { discard: false, color: outColor };
    }
}

export class PhongShader implements IShader {
    diffuseTexture: TGALoader;
    normalTexture: TGALoader;
    specularTexture: TGALoader;
    lightDir: Vector3;
    cameraPos: Vector3;
    varying_uv: Vector3[] = [new Vector3(), new Vector3(), new Vector3()];
    vertexPos: Vector3[] = [new Vector3(), new Vector3(), new Vector3()];
    varying_normal: Vector3[] = [new Vector3(), new Vector3(), new Vector3()];

    vertex(v: Vector3, uv: Vector3, normal: Vector3, index: number): Vector3 {
        //var MVP = OpenGL.ViewportMatrix;
        var MVP = Matrix4x4.multiply(Matrix4x4.multiply(OpenGL.ViewMatrix, OpenGL.ProjectionMatrix), OpenGL.ViewportMatrix);
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

    fragment(bc: Vector3): any {
        var u = this.varying_uv[0].x * bc.x + this.varying_uv[1].x * bc.y + this.varying_uv[2].x * bc.z;
        var v = this.varying_uv[0].y * bc.x + this.varying_uv[1].y * bc.y + this.varying_uv[2].y * bc.z;
        var rgb = this.diffuseTexture.getColor(u, v);

        // normal map
        var edge1 = Vector3.subtract(this.vertexPos[1], this.vertexPos[0]);
        var edge2 = Vector3.subtract(this.vertexPos[2], this.vertexPos[1]);
        var deltaUV1 = Vector3.subtract(this.varying_uv[1], this.varying_uv[0]);
        var deltaUV2 = Vector3.subtract(this.varying_uv[2], this.varying_uv[1]);
        var f = 1.0 / (deltaUV1.x * deltaUV2.y - deltaUV2.x * deltaUV1.y);
        var tangent = new Vector3();
        tangent.x = f * (deltaUV2.y * edge1.x - deltaUV1.y * edge2.x);
        tangent.y = f * (deltaUV2.y * edge1.y - deltaUV1.y * edge2.y);
        tangent.z = f * (deltaUV2.y * edge1.z - deltaUV1.y * edge2.z);
        tangent = Vector3.normalize(tangent);
        var bitangent = new Vector3();
        bitangent.x = f * (-deltaUV2.x * edge1.x + deltaUV1.x * edge2.x);
        bitangent.y = f * (-deltaUV2.x * edge1.y + deltaUV1.x * edge2.y);
        bitangent.z = f * (-deltaUV2.x * edge1.z + deltaUV1.x * edge2.z);
        bitangent = Vector3.normalize(bitangent);
        //var normal = Vector3.cross(tangent, bitangent);
        var normal = new Vector3();
        normal.x = this.varying_normal[0].x * bc.x + this.varying_normal[1].x * bc.y + this.varying_normal[2].x * bc.z;
        normal.y = this.varying_normal[0].y * bc.x + this.varying_normal[1].y * bc.y + this.varying_normal[2].y * bc.z;
        normal.z = this.varying_normal[0].z * bc.x + this.varying_normal[1].z * bc.y + this.varying_normal[2].z * bc.z;
        normal = Vector3.normalize(normal);
        var tbn = new Matrix4x4();
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
        rgbNormal.x = rgbNormal.x / 255.0 * 2 - 1;  // [0, 255]转换为[-1, 1]
        rgbNormal.y = rgbNormal.y / 255.0 * 2 - 1;
        rgbNormal.z = rgbNormal.z / 255.0 * 2 - 1;
        var worldNormal = Vector3.normalize(rgbNormal.multiplyMatrix4x4(tbn));
        // rgb.x = (worldNormal.x + 1) / 2 * 255;
        // rgb.y = (worldNormal.y + 1) / 2 * 255;
        // rgb.z = (worldNormal.z + 1) / 2 * 255;
        var intensity = Math.max(Vector3.dot(worldNormal, this.lightDir), 0) * 2;
        // rgb.x = Math.min(rgb.x * intensity, 255);
        // rgb.y = Math.min(rgb.y * intensity, 255);
        // rgb.z = Math.min(rgb.z * intensity, 255);

        // specular
        var pos = new Vector3();
        pos.x = this.vertexPos[0].x * bc.x + this.vertexPos[1].x * bc.y + this.vertexPos[2].x * bc.z;
        pos.y = this.vertexPos[0].y * bc.x + this.vertexPos[1].y * bc.y + this.vertexPos[2].y * bc.z;
        pos.z = this.vertexPos[0].z * bc.x + this.vertexPos[1].z * bc.y + this.vertexPos[2].z * bc.z;
        var cameraDir = Vector3.normalize(Vector3.subtract(this.cameraPos, pos));
        var halfNormal = Vector3.normalize(Vector3.add(cameraDir, this.lightDir));
        var specular = Math.max(Vector3.dot(worldNormal, halfNormal), 0);
        specular = Math.pow(specular, 200);
        rgb.x = Math.min(5 + rgb.x * (intensity + specular), 255);
        rgb.y = Math.min(5 + rgb.y * (intensity + specular), 255);
        rgb.z = Math.min(5 + rgb.z * (intensity + specular), 255);

        var outColor = "rgb(" + rgb.x + ", " + rgb.y + ", " + rgb.z + ")";
        return { discard: false, color: outColor };
    }
}