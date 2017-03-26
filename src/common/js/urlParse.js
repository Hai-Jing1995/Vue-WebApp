/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345, a:b} 
 */
export function urlParse(){
	//拿到?id=12345&a=b这样的字符串
	let url = window.location.search;	
	let obj = {};
	let reg = /[?&][^?&]+=[^?&]+/g;
	let arr = url.match(reg);	//数组
	//['?id=12345','&a=b']
	if(arr){
		arr.forEach((item) => {
			let tempArr = item.substring(1).split("=");
			let key = decodeURIComponent(tempArr[0]);
			let value = decodeURIComponent(tempArr[1]);
			obj[key] = value;
		})
	}
	return obj;
};