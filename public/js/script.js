function michelinRange() {
	let rangevalue = document.getElementById('multi10');
	let setvalue = document.getElementById('rangevalue');
	let imgchangevalue = document.getElementById('imgchange');

	let getvalue = rangevalue.value;
	// setvalue.innerHTML = this.value;
	if (getvalue == 1) {
		imgchangevalue.setAttribute('src', '../../images/range-slider/0.png');
		console.log(1);
	} else if (getvalue == 2) {
		console.log(2);
		imgchangevalue.setAttribute('src', '../../images/range-slider/1.png');
	} else if (getvalue == 3) {
		imgchangevalue.setAttribute('src', '../../images/range-slider/2.png');
	} else if (getvalue == 4) {
		imgchangevalue.setAttribute('src', '../../images/range-slider/3.png');
	} else if (getvalue == 5) {
		imgchangevalue.setAttribute('src', '../../images/range-slider/4.png');
	}
}
