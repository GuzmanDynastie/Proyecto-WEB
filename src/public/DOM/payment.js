class Payment {
    constructor() {
        this.loadCart();
    }

    loadCart() {
        const cart = sessionStorage.getItem('cart');
        const shipping = sessionStorage.getItem('shipping');
        this.products = cart ? JSON.parse(cart) : [];
        this.shipping = shipping ? JSON.parse(shipping) : { shipping: 0 };
    }

    saveShipping() {
        sessionStorage.setItem('shipping', JSON.stringify(this.shipping));
    }

    calculateTotal() {
        const productsTotal = this.products.reduce((total, item) => total + item.productPrice * item.quantity, 0);
        return productsTotal + this.shipping.shipping;
    }

    IVA() {
        const total = this.calculateTotal();
        return total * 0.16;
    }

    getProductsDetails() {
        return this.products.map(item => `${item.productName} - ${item.productBrand} - ${item.productCategory}: ${item.quantity} x ${item.productPrice.toFixed(2)}`).join('<br>');
    }
}

function actualizarTotalCompra() {
    const payment = new Payment();

    const detalleCompra = document.getElementById('detalle-compra');
    const montoTotal = document.getElementById('monto-total');

    if (detalleCompra && montoTotal) {
        detalleCompra.innerHTML = payment.getProductsDetails();
    }

    if (payment.calculateTotal() > 0) {
        if (montoTotal) {
            montoTotal.innerHTML = `Total: $${(payment.calculateTotal() + payment.IVA()).toFixed(2)}`;
        }
    } else {
        if (montoTotal) {
            montoTotal.innerHTML = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const payment = new Payment();
    actualizarTotalCompra();

    document.addEventListener('click', function(event) {
        if (event.target.id === 'radioFree') {
            payment.shipping.shipping = 0;
            payment.saveShipping();
            actualizarTotalCompra();
        }
    });

    document.addEventListener('click', function(event) {
        if (event.target.id === 'radioPay') {
            payment.shipping.shipping = 100;
            payment.saveShipping();
            actualizarTotalCompra();
        }
    });
});