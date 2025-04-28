export class PopUp {
    constructor(){
        this.popUpEl = null;
        this.overlayEl = null;

        this.hoverPopUpElBody = null;

        this.defaultParentContainer = document.getElementsByTagName('body')[0];
    }

    openPopUp(event, popUpBody, attrs=null, parentContainer=this.defaultParentContainer) {
        event.preventDefault();

        this.popUpEl = document.createElement('div');
        this.popUpEl.classList.add('popup', 'container_2');
        this.popUpEl.innerHTML = popUpBody;

        if (attrs != null) {
            for (let attr in attrs) {
                this.popUpEl.setAttribute(attr, attrs[attr]);
                console.log(attr);
            }
        }

        this.overlayEl = document.createElement('div');
        this.overlayEl.classList.add('popup_overlay', 'flex');
        this.overlayEl.append(this.popUpEl);
        this.overlayEl.addEventListener('click', (event) => {this.closePopUpEvent(event)});
        parentContainer.prepend(this.overlayEl);
        return this;
    }

    closePopUp() {
        this.overlayEl.remove();
    }

    closePopUpEvent(event) {
        if (event.target == this.overlayEl) {
            this.closePopUp();
        }
    }

    createHoverPopup(hoverElement, parentContainer, content=null) {
        let isOver = null;

        this.popUpEl = document.createElement('div');
        this.hoverPopUpElBody = document.createElement('div');
        let popUpArrow = document.createElement('div');

        popUpArrow.classList.add('hoverPopup_arrow');
        this.hoverPopUpElBody.classList.add('hoverPopupBody');
        this.popUpEl.classList.add('hoverPopup');
        this.popUpEl.appendChild(popUpArrow);
        this.popUpEl.appendChild(this.hoverPopUpElBody);

        this.hoverPopUpElBody.innerHTML = content;

        function getProps() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

            let rect = hoverElement.getBoundingClientRect();
            let top = (rect.top + scrollTop) - (hoverElement.offsetHeight / 2) - 20;
            let left = rect.left + scrollLeft;
            return {'top': top, 'left': left}
        }

        ['click', 'mouseenter'].forEach(eventType => {
            hoverElement.addEventListener(eventType, (event) => {
                isOver = true;
                    
                this.popUpEl.style = `
                    display: flex;
                    position: absolute;
                    top: ${getProps().top}px;
                    left: ${getProps().left}px;
                    allign-items: center;
                    justify-content: center;
                    z-index: 2;
                `;
                parentContainer.prepend(this.popUpEl);
                this.popUpEl.style.left = `${parseFloat(this.popUpEl.style.left) - (parseFloat(this.popUpEl.offsetWidth) / 2) + (hoverElement.offsetWidth / 2)}px`;
                this.popUpEl.classList.add('hover_popup_opened');
                
                if (eventType == 'click') {
                    const mouseLeaveEvent = new MouseEvent('mouseleave', {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                    });
                    hoverElement.dispatchEvent(mouseLeaveEvent);
                } 
            });
        });

        let observer = new MutationObserver((mutationList) => {
            
            for (let mutation of mutationList) {

                if (mutation.type == 'childList') {
                    this.popUpEl.style.left = `${getProps().left}px`;
                    this.popUpEl.style.left = `${parseFloat(this.popUpEl.style.left) - (parseFloat(this.popUpEl.offsetWidth) / 2) + (hoverElement.offsetWidth / 2)}px`;
                    this.popUpEl.style.top = `${getProps().top}px`;
                }
            }
        });
        observer.observe(this.hoverPopUpElBody, {
            childList: true,
            characterData: true,
            attributes: true,
            subtree: true
        });

        hoverElement.addEventListener('mouseleave', (event) => {
            isOver = false;
            setTimeout(() => {
                if (isOver) {
                    return
                } else {
                    this.popUpEl.classList.remove('hover_popup_opened');
                    setTimeout(() => {
                        if(isOver) {
                            this.popUpEl.classList.add('hover_popup_opened');
                            return
                        } else {
                            this.popUpEl.remove();
                            return
                        }
                    }, 250);
                }
            }, 1500);
        });
    }
}