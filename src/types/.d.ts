// fabric.d.ts
declare module 'fabric' {
	namespace fabric {
		interface Canvas {
			upperCanvasEl: HTMLCanvasElement;
			lastX?: number;  
			lastY?: number; 
		}
	}
}
