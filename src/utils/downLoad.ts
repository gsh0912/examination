export const downLoad=(url:string)=>{
  let a=document.createElement("a")
  a.style.display="none";
  a.href="http://estate.eshareedu.cn/exam/upload/question.xlsx"
  document.body.appendChild(a)
  a.click();
  document.body.removeChild(a)
}