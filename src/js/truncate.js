(function () {
    const elements = document.querySelectorAll('.js-truncate')
    elements.forEach((element) => {
        const lineHeight = parseInt(getComputedStyle(element).lineHeight)
        const height = parseInt(getComputedStyle(element).height)
    
        const { lines } = element.dataset;

        const maxHeight = lineHeight * lines
        const maxHeightStyle = maxHeight + 'px';

        element.style.maxHeight = maxHeightStyle;

        if ((height - lineHeight) >= maxHeight) {
            element.classList.add('truncate')
        }
    })
}())
