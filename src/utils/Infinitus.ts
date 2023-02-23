// 下级
export function getData(id: number, arry: any) {
  var childArry = getParentArry(id, arry);
  if (childArry.length > 0) {
    for (var i in childArry) {
      var sub = getData(childArry[i].id, arry);
      if (sub.length > 0) {
        childArry[i].sub = getData(childArry[i].id, arry);
      } else {
        continue;
      }
    }
  }
  return childArry;
}
// 一级
function getParentArry(id: number, arry: any) {
  var newArry = new Array();
  for (var i in arry) {
    if (arry[i].pid == id)
      newArry.push(arry[i]);
  }
  return newArry;
}
