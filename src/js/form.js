function buildForm(selector, onSuccess, onFail) {
	const form = document.querySelector(selector)

	if (!form) {
		return
	}

	let isValid = true

	function showStatusText(element, condition, text) {
		if (condition) {
			element.textContent = text
			isValid = false
		} else if (!element.textContent) {
			element.textContent = ''
		}
	}

	form.addEventListener('submit', async (e) => {
		e.preventDefault()

		if (isValid) {
			const request = await fetch(form.getAttribute('action'), {
				method: form.getAttribute('method'),
				body: JSON.stringify(FormData(form)),
			})

			const { status, data } = await request.json()

			if (status) {
				onSuccess(data)
			} else {
				onFail(data)
			}
		}
	})

	const fields = form.querySelectorAll('.js-form-field')

	fields.forEach((field) => {
		const input = field.querySelector('.js-form-input')
		const statusElement = field.querySelector('.js-form-status')

		const { required, max } = field.dataset

		input.addEventListener('blur', () => {
			showStatusText(statusElement, required && !input.value, 'Это поле обязательно')
			showStatusText(statusElement, max && input.value.length > max, `Поле не должно превышать ${max} символов`)
		})

		input.addEventListener('focus', () => {
			statusElement.textContent = ''
		})
	})
}
