import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  Texture,
  SRGBColorSpace,
} from "three";
import vert from "../../shaders/photo.vert";
import frag from "../../shaders/photo.frag";

const MAX_TEXTURE_SIZE = 1280;

interface PhotoItem {
  el: HTMLElement;
  mesh: Mesh;
  material: ShaderMaterial;
  texture: Texture | null;
  visible: boolean;
}

export class PhotoScene {
  private scene = new Scene();
  private camera: OrthographicCamera;
  private renderer: WebGLRenderer;
  private geometry = new PlaneGeometry(1, 1, 32, 1);
  private items: PhotoItem[] = [];
  private elementToItem = new Map<HTMLElement, PhotoItem>();
  private animationId = 0;
  private lastTime = performance.now();
  private lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
  private smoothVelocity = 0;
  private onResizeBound: () => void;
  private observer: IntersectionObserver | null = null;

  constructor(canvas: HTMLCanvasElement, elements: HTMLElement[]) {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.renderer = new WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h, false);
    this.renderer.setClearAlpha(0);

    this.camera = new OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 10);
    this.camera.position.z = 1;

    for (const el of elements) {
      const src = el.dataset.src;
      if (!src) continue;

      const material = new ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms: {
          uTexture: { value: null },
          uHasTexture: { value: 0 },
          uScrollVelocity: { value: 0 },
          uPlaneAspect: { value: 1 },
          uImageAspect: { value: 1 },
        },
        transparent: true,
      });

      const mesh = new Mesh(this.geometry, material);
      mesh.matrixAutoUpdate = false;
      mesh.visible = false;
      const item: PhotoItem = {
        el,
        mesh,
        material,
        texture: null,
        visible: false,
      };
      this.scene.add(mesh);
      this.items.push(item);
      this.elementToItem.set(el, item);

      this.loadResizedTexture(src).then((res) => {
        if (!res) return;
        res.texture.colorSpace = SRGBColorSpace;
        res.texture.generateMipmaps = false;
        res.texture.needsUpdate = true;
        item.texture = res.texture;
        material.uniforms.uImageAspect.value = res.width / res.height;
        material.uniforms.uTexture.value = res.texture;
        material.uniforms.uHasTexture.value = 1;
      });
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const item = this.elementToItem.get(e.target as HTMLElement);
          if (item) item.visible = e.isIntersecting;
        }
      },
      { rootMargin: "200px" },
    );
    for (const item of this.items) this.observer.observe(item.el);

    this.onResizeBound = this.onResize.bind(this);
    window.addEventListener("resize", this.onResizeBound);

    this.animate();
  }

  private async loadResizedTexture(
    url: string,
  ): Promise<{ texture: Texture; width: number; height: number } | null> {
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        i.crossOrigin = "anonymous";
        i.onload = () => resolve(i);
        i.onerror = () => reject(new Error("image load failed"));
        i.src = url;
      });
      if (typeof img.decode === "function") {
        try {
          await img.decode();
        } catch {
          // decode is a hint; fall through if it fails
        }
      }
      const ow = img.naturalWidth || 1;
      const oh = img.naturalHeight || 1;
      const scale = Math.min(1, MAX_TEXTURE_SIZE / Math.max(ow, oh));
      const tw = Math.max(1, Math.round(ow * scale));
      const th = Math.max(1, Math.round(oh * scale));

      let source: ImageBitmap | HTMLImageElement = img;
      if (typeof createImageBitmap === "function") {
        source =
          scale < 1
            ? await createImageBitmap(img, {
                resizeWidth: tw,
                resizeHeight: th,
                resizeQuality: "high",
                imageOrientation: "flipY",
              })
            : await createImageBitmap(img, { imageOrientation: "flipY" });
      }

      const texture = new Texture();
      (texture as unknown as { image: ImageBitmap | HTMLImageElement }).image =
        source;
      return { texture, width: tw, height: th };
    } catch (err) {
      console.error("Failed to load texture:", url, err);
      return null;
    }
  }

  private onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.left = -w / 2;
    this.camera.right = w / 2;
    this.camera.top = h / 2;
    this.camera.bottom = -h / 2;
    this.camera.updateProjectionMatrix();
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    const now = performance.now();
    const dt = Math.max(0.001, (now - this.lastTime) / 1000);
    this.lastTime = now;

    const scrollY = window.scrollY;
    const rawVelocity = (scrollY - this.lastScrollY) / dt / 1000;
    this.lastScrollY = scrollY;
    this.smoothVelocity += (rawVelocity - this.smoothVelocity) * 0.18;
    this.smoothVelocity *= 0.92;
    if (Math.abs(this.smoothVelocity) < 0.0005) this.smoothVelocity = 0;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let anyVisible = false;

    for (const item of this.items) {
      if (!item.visible) {
        if (item.mesh.visible) item.mesh.visible = false;
        continue;
      }
      anyVisible = true;
      item.mesh.visible = true;

      const rect = item.el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2 - vw / 2;
      const cy = -(rect.top + rect.height / 2 - vh / 2);

      item.mesh.position.set(cx, cy, 0);
      item.mesh.scale.set(rect.width, rect.height, 1);
      item.mesh.updateMatrix();

      item.material.uniforms.uScrollVelocity.value = this.smoothVelocity;
      item.material.uniforms.uPlaneAspect.value =
        rect.height > 0 ? rect.width / rect.height : 1;
    }

    if (anyVisible) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  dispose() {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener("resize", this.onResizeBound);
    this.observer?.disconnect();

    for (const item of this.items) {
      this.scene.remove(item.mesh);
      item.material.dispose();
      const img = item.texture?.image as
        | { close?: () => void }
        | null
        | undefined;
      if (img && typeof img.close === "function") img.close();
      item.texture?.dispose();
    }
    this.geometry.dispose();
    this.renderer.dispose();
  }
}
