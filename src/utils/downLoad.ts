export const downLoad=(url:string)=>{
  let a=document.createElement("a")
  a.style.display="none";
  a.href=url
  document.body.appendChild(a)
  a.click();
  document.body.removeChild(a)
}