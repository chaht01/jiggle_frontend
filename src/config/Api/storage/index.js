export const storeItem = (item) => {
    for(let name in item){
        if(item.hasOwnProperty(name)){
            localStorage.setItem(name, item[name])
        }

    }
}
export const clearItem = (name) => {
    localStorage.removeItem(name)
}
