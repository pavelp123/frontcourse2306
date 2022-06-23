const handleSuccess = (data) => {
    location.href = '/success-order'
}

const handleFail = (data) => {
    alert(data);
}

buildForm('.js-order-form', handleSuccess, handleFail)