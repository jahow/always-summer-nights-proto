export type AnchorType = [number, number]
export const AnchorTypes = {
	TOPLEFT: [0, 1] as [number, number],
	TOPRIGHT: [1, 1] as [number, number],
	BOTTOMLEFT: [0, 0] as [number, number],
	BOTTOMRIGHT: [1, 0] as [number, number],
	CENTER: [0.5, 0.5] as [number, number],
	MIDDLELEFT: [0, 0.5] as [number, number],
	MIDDLERIGHT: [1, 0.5] as [number, number],
	TOPMIDDLE: [0.5, 1] as [number, number],
	BOTTOMMIDDLE: [0.5, 0] as [number, number]
}
export enum ContentFlow {
	ROW,
	COL,
	ROW_INVERSE,
	COL_INVERSE
}

export enum RenderingGroup {
	ENVIRONMENT = 0,
	OVERLAY = 2,
	DEBUG = 3
}
