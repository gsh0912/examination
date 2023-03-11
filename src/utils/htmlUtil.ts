

export const htmlEncodeByRegExp = (str: string) => {
  var s = '';
  if (str.length === 0) {
    return '';
  }
  s = s.replace(/\n/g, '<br>');
  s = s.replace(/>/g, '&gt;');

  return s;
}

// 4.使用正则实现html解码
export const htmlDecodeByRegExp = (str: string) => {
  var s = '';
  if (str.length === 0) {
    return '';
  }
  s = str.replace(/&amp;/g, '&');
  s = s.replace(/&lt;/g, '<');
  s = s.replace(/&gt;/g, '>');
  s = s.replace(/&nbsp;/g, ' ');
  s = s.replace(/&#39;/g, '\'');
  s = s.replace(/&quot;/g, '\"');
  return s;
}