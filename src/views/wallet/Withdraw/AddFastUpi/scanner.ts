//@ts-nocheck
import jsQR from "jsqr";
const canvas = document.createElement("canvas");
const canvasCtx = canvas.getContext("2d");

canvas.width = 1920;
canvas.height = 1080;
export class DropImageFetchError extends Error {
	constructor() {
		super("can't process cross-origin image");

		this.name = "DropImageFetchError";
	}
}

export class DropImageDecodeError extends Error {
	constructor() {
		super("drag-and-dropped file is not of type image and can't be decoded");

		this.name = "DropImageDecodeError";
	}
}
export function asyncListenEvent(eventTarget, successEvent, errorEvent) {
	let _resolve:any, _reject:any
	const promise = new Promise((resolve, reject) => {
		_resolve = resolve
		_reject = reject
	})
	eventTarget.addEventListener(successEvent, _resolve)
	eventTarget.addEventListener(errorEvent, _reject)
	promise.finally(() => {
		eventTarget.removeEventListener(successEvent, _resolve)
		eventTarget.removeEventListener(errorEvent, _reject)
	})
	return promise
}
function imageDataFromCanvas(canvasImageSource, width, height) {
	const scalingRatio = Math.min(
		1,
		canvas.width / width,
		canvas.height / height
	);
	const widthScaled = scalingRatio * width;
	const heightScaled = scalingRatio * height;

	canvasCtx.drawImage(canvasImageSource, 0, 0, widthScaled, heightScaled);

	return canvasCtx.getImageData(0, 0, widthScaled, heightScaled);
}

export function imageDataFromImage(imageElement) {
	const width = imageElement.naturalWidth;
	const height = imageElement.naturalHeight;
	return imageDataFromCanvas(imageElement, width, height);
}


export async function imageDataFromUrl(url) {
	if (url.startsWith("http") && url.includes(location.host) === false) {
		throw new DropImageFetchError();
	}

	const image = document.createElement("img");
	image.src = url;

	await asyncListenEvent(image, "load");

	return imageDataFromImage(image);
}

export async function imageDataFromFile(file) {
	if (/image.*/.test(file.type)) {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		const data = await asyncListenEvent(reader, "load");
		const dataURL = data.target.result;
		const imageData=await imageDataFromUrl(dataURL);
		return  jsQR(imageData.data, imageData.width, imageData.height);
	} else {
		throw new DropImageDecodeError();
	}
}