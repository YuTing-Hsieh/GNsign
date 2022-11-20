function getStorageArray(key) {
    let value = localStorage.getItem(key);
    if (value) {
        return JSON.parse(value);
    }
}
function addItem(key, addData) {
    let StorageArray = getStorageArray(key);

    if (StorageArray) {
        StorageArray.push(addData);
    }
    else {
        StorageArray = [addData];
    }
    localStorage.setItem(key, JSON.stringify(StorageArray));
}
function deleteItem(key, deleteData) {
    let StorageArray = getStorageArray(key);

    if (StorageArray) {
        StorageArray.splice(StorageArray.indexOf(deleteData), 1);
        localStorage.setItem(key, JSON.stringify(StorageArray));
    }
}
function clearAll(){
    localStorage.clear();
}