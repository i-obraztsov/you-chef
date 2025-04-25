export function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        if (!file.size) {
            resolve({
                url: null,
                title: null,
            });
            return;
        }
        const reader = new FileReader();

        reader.onload = () => resolve({
            url: reader.result,
            title: file.title
        });
        reader.onerror = () => reject(new Error('Не удалось прочитать файл'))
        reader.readAsDataURL(file);
    });
}