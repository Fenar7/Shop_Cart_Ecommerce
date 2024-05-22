function addToCart(proId) {
    console.log('added');
    $.ajax({
        url: '/add-to-cart/'+proId,
        method: 'get',
        timeout: 5000, // 5 seconds timeout
        success: (response) => {
            console.log('AJAX request succeeded');
            console.log('Response:', response);

            if (response.status) {
                let countElement = $('#cart-count');
                let count = countElement.html();
                console.log('Current cart count:', count);

                count = parseInt(count);
                if (!isNaN(count)) {
                    count = count + 1;
                    countElement.html(count);
                    console.log('Updated cart count:', count);
                } else {
                    console.error('Cart count is not a number');
                }
            } else {
                console.error('Failed to add product to cart');
            }
        },
        error: (xhr, status, error) => {
            if (status === 'timeout') {
                console.error('Request timed out');
            } else {
                console.error('Error adding to cart:', error);
            }
        }
    });
}
