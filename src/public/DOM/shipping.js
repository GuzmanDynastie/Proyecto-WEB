class Shipping {
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
    const shipping = new Shipping();

    const detalleCompra = document.getElementById('detalle-compra');
    const costoEnvio = document.getElementById('costo-envio');
    const subTotal = document.getElementById('sub-total');
    const IVA = document.getElementById('IVA');
    const montoTotal = document.getElementById('monto-total');

    if (detalleCompra && montoTotal) {
        detalleCompra.innerHTML = shipping.getProductsDetails();
    }

    if (shipping.calculateTotal() > 0) {
        if (costoEnvio) {
            costoEnvio.innerHTML = `Costo del envio: $${shipping.shipping.shipping.toFixed(2)}`;
            subTotal.innerHTML = `Subtotal: $${shipping.calculateTotal().toFixed(2)}`;
            IVA.innerHTML = `IVA (16%): $${(shipping.IVA()).toFixed(2)}`;
            montoTotal.innerHTML = `Total: $${(shipping.calculateTotal() + shipping.IVA()).toFixed(2)}`;
        }
    } else {
        if (costoEnvio) {
            costoEnvio.innerHTML = '';
            montoTotal.innerHTML = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const shipping = new Shipping();
    actualizarTotalCompra();

    document.addEventListener('click', function(event) {
        if (event.target.id === 'radioFree') {
            shipping.shipping.shipping = 0;
            shipping.saveShipping();
            actualizarTotalCompra();
        }
    });

    document.addEventListener('click', function(event) {
        if (event.target.id === 'radioPay') {
            shipping.shipping.shipping = 100;
            shipping.saveShipping();
            actualizarTotalCompra();
        }
    });

    document.getElementById('siguiente-button').addEventListener('click', function(event) {
        event.preventDefault();

        const form = document.getElementById('shipping-form');
        const errorMessage = document.getElementById('error-message');

        // window.location.href = '/shopping/payment';
        
        if (form.checkValidity()) {
            form.submit();
            window.location.href = '/shopping/payment';
        } else {
            errorMessage.textContent = 'Por favor, completa todos los campos requeridos.';
        }
    });

    document.getElementById('cancelar-button').addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/shopping/shopping_cart';
    });
});
