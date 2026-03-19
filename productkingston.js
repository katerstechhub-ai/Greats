// Initialize Swiper (exactly as before, but in a separate file)
const swiper = new Swiper('.swiper', {
    direction: 'horizontal',
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    speed: 400,
    spaceBetween: 0,
});


document.addEventListener('DOMContentLoaded', function () {
    const radioButtons = document.querySelectorAll('input[name="size"]');
    const addToCartBtn = document.getElementById('add-to-cart-btn');

    // Stop if the button isn't found (safety check)
    if (!addToCartBtn) return;

    const defaultBtnText = 'ADD TO CART';
    const defaultBtnClasses = 'bg-black text-white';        // Original button classes
    const hoverBtnText = 'SELECT A SIZE';
    const hoverBtnClasses = 'bg-gray-200 text-black';       // Hover state classes (adjust gray as needed)

    // Helper: get the number div inside the same parent as the radio
    function getSizeDiv(radio) {
        return radio.closest('.flex.flex-col.items-center').querySelector('div.bg-gray-200');
    }

    // Reset all size divs to default gray background / black text
    function resetAllSizeDivs() {
        radioButtons.forEach(radio => {
            const div = getSizeDiv(radio);
            if (div) {
                div.classList.remove('bg-black', 'text-white');
                div.classList.add('bg-gray-200', 'text-black');
            }
        });
    }

    // When a radio is selected, style its number div and revert others
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function () {
            resetAllSizeDivs();
            if (this.checked) {
                const div = getSizeDiv(this);
                if (div) {
                    div.classList.remove('bg-gray-200', 'text-black');
                    div.classList.add('bg-black', 'text-white');
                }
            }
        });
    });

    // Check if any size is currently selected
    function isAnyRadioSelected() {
        return Array.from(radioButtons).some(radio => radio.checked);
    }

    // Button hover: show hint only if no size is selected
    addToCartBtn.addEventListener('mouseenter', function () {
        if (!isAnyRadioSelected()) {
            this.textContent = hoverBtnText;
            this.classList.remove(...defaultBtnClasses.split(' '));
            this.classList.add(...hoverBtnClasses.split(' '));
        }
    });

    // When mouse leaves, always revert to default button appearance
    addToCartBtn.addEventListener('mouseleave', function () {
        this.textContent = defaultBtnText;
        this.classList.remove(...hoverBtnClasses.split(' '));
        this.classList.add(...defaultBtnClasses.split(' '));
    });

    // If a size is selected while the mouse is still over the button,
    // revert the button immediately (so the hint doesn't persist)
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function () {
            if (isAnyRadioSelected() && addToCartBtn.matches(':hover')) {
                addToCartBtn.textContent = defaultBtnText;
                addToCartBtn.classList.remove(...hoverBtnClasses.split(' '));
                addToCartBtn.classList.add(...defaultBtnClasses.split(' '));
            }
        });
    });
});