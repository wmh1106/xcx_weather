const host = 'https://test-miniprogram.com'
const qqMapKeySDK = 'UUABZ-NM53I-TLEG7-5TAKN-TJNKV-IZFP5'

function getNowDay() {
	const date = new Date()
	const y = date.getFullYear()
	const m = date.getMonth() + 1
	const d = date.getDate()
	return `${zero(y)}-${zero(m)}-${zero(d)}`
}

function zero(n){
	return n>10 ? ''+n : '0'+n
}

export {
	host,
	getNowDay,
	zero,
	qqMapKeySDK
} 