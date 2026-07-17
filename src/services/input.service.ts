export const InputService = {

    // hàm chỉ cho phép nhận số vào input
    onlyNumber(event: any) {
        const charCode = event.charCode;
        if (charCode < 48 || charCode > 57) {
            event.preventDefault(); // chặn ký tự không phải số
        }
    },
};
