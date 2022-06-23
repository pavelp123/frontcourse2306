const handleSuccess = (data) => {
    MicroModal.close('.feedback-modal')

    alert(JSON.parse(data));
}

const handleFail = (data) => {
    alert(data);
}

buildForm('.js-feedback-form', handleSuccess, handleFail)