<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import { onBeforeUnmount, onMounted, ref } from "vue";

const dialogRef = ref<HTMLDialogElement | null>(null);
const imgSrc = ref<string>("");
const imgAlt = ref<string>("");

function isZoomableImg(target: unknown): target is HTMLImageElement {
	if (!(target instanceof HTMLImageElement)) return false;
	// Only images inside the rendered doc content.
	if (!target.closest(".vp-doc")) return false;
	// Allow opting out per image.
	if (target.classList.contains("no-zoom")) return false;
	if (target.getAttribute("data-no-zoom") === "true") return false;
	return true;
}

function openZoom(img: HTMLImageElement) {
	imgSrc.value = img.currentSrc || img.src;
	imgAlt.value = img.alt || "";
	dialogRef.value?.showModal();
}

function closeZoom() {
	dialogRef.value?.close();
	imgSrc.value = "";
	imgAlt.value = "";
}

function onDialogClosed() {
	imgSrc.value = "";
	imgAlt.value = "";
}

function onDocClick(ev: MouseEvent) {
	const target = ev.target;
	if (!isZoomableImg(target)) return;
	ev.preventDefault();
	ev.stopPropagation();
	openZoom(target);
}

function onDialogClick(ev: MouseEvent) {
	// Click on the backdrop closes the dialog (clicking the image doesn't).
	if (ev.target === dialogRef.value) closeZoom();
}

onMounted(() => {
	document.addEventListener("click", onDocClick, { capture: true });
});

onBeforeUnmount(() => {
	document.removeEventListener("click", onDocClick, { capture: true });
});
</script>

<template>
	<DefaultTheme.Layout />

	<Teleport to="body">
		<dialog
			ref="dialogRef"
			class="vp-image-lightbox"
			@click="onDialogClick"
			@close="onDialogClosed"
		>
			<figure>
				<img :src="imgSrc" :alt="imgAlt" @click="closeZoom" />
				<figcaption v-if="imgAlt">{{ imgAlt }}</figcaption>
			</figure>
		</dialog>
	</Teleport>
</template>
