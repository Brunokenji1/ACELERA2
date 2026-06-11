export function getCroppedImg(imageSrc, cropPixels){
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;

        image.onload = () => {
            const TAMANHO = 400;
            const canvas = document.createElement("canvas");
            canvas.width = TAMANHO;
            canvas.height = TAMANHO;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(
                image,
                cropPixels.x,
                cropPixels.y,
                cropPixels.width,
                cropPixels.height,
                0,
                0,
                TAMANHO,
                TAMANHO
            );

            canvas.toBlob(
                (blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error("Falha ao gerar a imagem"));
                },
                "image/jpeg",
                0.9
            );
        };
        image.onerror = () => reject(new Error("Falha ao carregar a imagem"));
    });
}