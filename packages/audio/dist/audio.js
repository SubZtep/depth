export async function playUrl(url) {
    const context = new AudioContext();
    const source = context.createBufferSource();
    const audioBuffer = await fetch(url)
        .then(res => res.arrayBuffer())
        .then(ArrayBuffer => context.decodeAudioData(ArrayBuffer));
    source.buffer = audioBuffer;
    source.connect(context.destination);
    source.start();
}
