export class FormManager {
    constructor(fieldset, addBtn, itemSelector) {
        this.fieldset = fieldset;
        this.addBtn = addBtn;
        this.itemSelector = itemSelector;

        this.template = fieldset.querySelector('template');

        fieldset.querySelectorAll(`${itemSelector}`).forEach(this.attachRemove);

        this.addBtn.addEventListener('click', event => {
            event.preventDefault();
            this.addItem();
        });
    }

    attachRemove(item) {
        const btn = item.querySelector('.btn-remove');
        btn.addEventListener('click', () => {
            item.remove();
        })
    }

    addItem(prefillValue = '') {
        const clone = this.template.content.firstElementChild.cloneNode(true);
        const input = clone.querySelector('input, textarea');
        if (input) input.value = prefillValue;

        this.attachRemove(clone);
        this.fieldset.insertBefore(clone, this.addBtn);
    }

    getValues() {
        return Array.from(this.fieldset.querySelectorAll(this.itemSelector)).map((item) => {
            const input = item.querySelector('input, textarea');
            return input ? input.value.trim() : null;
        }).filter(Boolean);
    }
}