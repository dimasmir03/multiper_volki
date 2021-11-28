var btn = document.getElementById("addend");
let parent = document.querySelector('#form');
let before = document.querySelector('#before');
var n = 3;

btn.onclick = function() {
	let div = document.createElement('div');
	div.setAttribute('class', 'helpbox');
	div.innerHTML = `<input class="input" id="end" type="text" name="pointb" placeholder="Промежуточный пункт"><div class="btn" id="button${n})">Выбрать на карте</div>`;
	n = n + 1;

	parent.insertBefore(div, before);
}