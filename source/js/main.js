'use strict';
const FOCUSABLE_ELEMENTS_STRING = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
const pageHeaderLink = document.querySelector('.page-header__link');
const pageFooterContainer = document.querySelector('.page-footer__container');
const pageFooterItems = document.querySelectorAll('.page-footer__item');
const accordionTriggers = pageFooterContainer.querySelectorAll('button');
const consultationForm = document.querySelector('.consultation');
const consultationClose = document.querySelector('.consultation__close');
const consultationWrapper = document.querySelector('.consultation__wrapper');
const formForm = document.querySelector('.form__form');
const body = document.querySelector('.body');
const html = document.querySelector('.page');
const inputConsultationName = document.querySelector('#name-consultation');
const inputConsultationTel = document.querySelector('#tel-consultation');
const textareaConsultationQuestion = document.querySelector('#question-consultation');
const inputFormName = document.querySelector('#name-form');
const inputFormTel = document.querySelector('#tel-form');
const textareaFormQuestion = document.querySelector('#question-form');
let windowHeight = window.screen.height;
let lastFocusedElement;
let isStorageSupport = true;
let storageName = '';
let storageTel = '';
let storageQuestion = '';

try {
  storageName = localStorage.getItem('name');
  storageTel = localStorage.getItem('tel')
  storageQuestion = localStorage.getItem('question')
} catch (err) {
  isStorageSupport = false;
}

const substituteData = (storage, input) => {
  if (storage) {
    input.value = storage;
  }
};

substituteData(storageName, inputConsultationName);
substituteData(storageTel, inputConsultationTel);
substituteData(storageQuestion, textareaConsultationQuestion);
substituteData(storageName, inputFormName);
substituteData(storageTel, inputFormTel);
substituteData(storageQuestion, textareaFormQuestion);

if (inputFormTel) {
  $(inputFormTel).mask('+7(999)999-9999');
}

formForm.addEventListener('submit', () => {
  if (isStorageSupport) {
    if (inputFormName.value) {
      localStorage.setItem('name', inputFormName.value);
    }
    if (inputFormTel.value) {
      localStorage.setItem('tel', inputFormTel.value);
    }
    if (textareaFormQuestion.value) {
      localStorage.setItem('question', textareaFormQuestion.value);
    }
  }
});

if (consultationForm && pageHeaderLink && consultationClose) {
  const closeForm = () => {
    consultationForm.classList.remove('consultation--show');
    consultationWrapper.classList.remove('consultation__wrapper--show');
    consultationClose.removeEventListener('click', onCloseClick);
    document.removeEventListener('keydown', onEscKeydown);
    consultationForm.removeEventListener('click', onOverlayClick);
    body.classList.remove('body--hidden');
    html.classList.remove('page--hidden');
    consultationWrapper.classList.remove('consultation__wrapper--overflow');
    html.classList.remove('page--overflow');
    body.classList.remove('body--overflow');
    lastFocusedElement.focus();
  }

  const onCloseClick = () => {
    closeForm();
  };
  const onEscKeydown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      closeForm();
    }
  }
  const onOverlayClick = (evt) => {
    const target = evt.target;
    const itsForm = target === consultationWrapper || consultationWrapper.contains(target);
    if (!itsForm) {
      closeForm();
    }
  };

  pageHeaderLink.addEventListener('click', () => {
    lastFocusedElement = document.activeElement;
    consultationForm.classList.add('consultation--show');
    consultationForm.addEventListener('click', onOverlayClick);
    const consultationHeight = consultationWrapper.offsetHeight;
    inputConsultationName.focus();
    $(inputConsultationTel).mask('+7(999)999-9999');
    let focusableElements = consultationForm.querySelectorAll(FOCUSABLE_ELEMENTS_STRING);
    focusableElements = Array.prototype.slice.call(focusableElements);
    let firstTabStop = focusableElements[0];
    let lastTabStop = focusableElements[focusableElements.length - 1];
    document.addEventListener('keydown', onEscKeydown);
    consultationForm.addEventListener('keydown', (evt) => {
      if (evt.key === 'Tab') {
        if (evt.shiftKey) {
          if (document.activeElement === firstTabStop) {
            evt.preventDefault();
            lastTabStop.focus();
          }
        } else {
          if (document.activeElement === lastTabStop) {
            evt.preventDefault();
            firstTabStop.focus();
          }
        }
      }
    });
    consultationClose.addEventListener('click', onCloseClick);
    body.classList.add('body--hidden');
    html.classList.add('page--hidden');

    if (consultationForm.classList.contains('consultation--show')) {
      if (consultationHeight > windowHeight) {
        consultationWrapper.classList.add('consultation__wrapper--overflow');
        html.classList.add('page--overflow');
        body.classList.add('body--overflow');
      } else {
        consultationWrapper.classList.add('consultation__wrapper--show');
        consultationWrapper.classList.remove('consultation__wrapper--overflow');
        html.classList.remove('page--overflow');
        body.classList.remove('body--overflow');
      }
    }

    window.addEventListener('resize', () => {
      if (consultationForm.classList.contains('consultation--show')) {
        windowHeight = window.screen.height;
        if (consultationHeight > windowHeight) {
          consultationWrapper.classList.add('consultation__wrapper--overflow');
          html.classList.add('page--overflow');
          body.classList.add('body--overflow');
        } else {
          consultationWrapper.classList.remove('consultation__wrapper--overflow');
          html.classList.remove('page--overflow');
          body.classList.remove('body--overflow');
        }
      }
    });
  });

  consultationForm.addEventListener('submit', () => {
    if (isStorageSupport) {
      if (inputConsultationName.value) {
        localStorage.setItem('name', inputConsultationName.value);
      }
      if (inputConsultationTel.value) {
        localStorage.setItem('tel', inputConsultationTel.value);
      }
      if (textareaConsultationQuestion.value) {
        localStorage.setItem('question', textareaConsultationQuestion.value);
      }
    }
    closeForm();
  });
}

if (pageFooterItems) {
  pageFooterItems.forEach(item => {
    item.classList.remove('page-footer__item--nojs');
  });
}

const onAccordionClick = (evt) => {
  const id = evt.target.getAttribute('data-accordion');
  const item = pageFooterContainer.querySelector('li[data-accordion="' + id + '"]');
  const showItem = document.querySelector('.page-footer__item--show');

  if (showItem) {
    showItem.classList.remove('page-footer__item--show');
  }
  if (item) {
    item.classList.add('page-footer__item--show');
  }
  if (showItem === item) {
    item.classList.remove('page-footer__item--show');
  }
};

if (accordionTriggers) {
  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', onAccordionClick);
  });
}

$('a[href*="#"]').on('click', function(evt) {
  evt.preventDefault();
  const anchor = $(this).attr('href');
  $('html, body').stop().animate({
    scrollTop: $(anchor).offset().top - 60
  }, 800);
});
