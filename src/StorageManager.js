export class StorageManager {
    load(key) {
        const savedData = localStorage.getItem(key);
        return savedData ? JSON.parse(savedData) : [];
    }

    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
}
