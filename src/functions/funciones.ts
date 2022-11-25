export const instanceOf = <T>(value: any, fieldName: string): value is T =>
  fieldName in value;

export const getMaxId = (arr:any)=>{
    let idx = arr.length;
    let maxId = arr[idx-1].id;
    while (idx--){
        if(arr[idx].id > maxId){
            maxId = arr[idx].id
        }else if(arr[idx].id === maxId){
            maxId++
        }
    }
    return maxId;
};