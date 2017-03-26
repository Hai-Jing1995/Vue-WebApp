//向本地存数据
export function saveToLocal(id, key, value){
	let seller = window.localStorage._seller_;
	if (!seller){
		seller = {};
		seller[id] = {};
		seller[id][key] = value;
	}else{
		//localStorage直接存储的是字符串
		//我们需要的是一个Json对象
		seller = JSON.parse(seller);
		if (!seller[id]){
			seller[id] = {};
		}	
	}
	seller[id][key] = value;
	window.localStorage._seller_ = JSON.stringify(seller);	//存储的是字符串
};

//从本地取数据
export function loadFromLocal(id, key, def){
	let seller = window.localStorage._seller_;
	if (!seller){
		return def;
	}
	seller = JSON.parse(seller)[id];
	if (!seller[id]){
		return def;
	}
	let ret = seller[key];
	return ret || def;
};