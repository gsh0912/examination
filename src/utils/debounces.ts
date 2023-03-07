// 函数防抖
function debounce(fn: any, delay = 300) {
  let timer: any = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    timer = setTimeout(() => {
      fn();
    }, delay);
  };
}
export default debounce;
