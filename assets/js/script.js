'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
navigationLinks.forEach((link) => {
  link.addEventListener("click", function () {
    const clickedPage = this.getAttribute('data-original-page') || this.textContent.trim().toLowerCase();
    
    pages.forEach((page, index) => {
      if (clickedPage === page.dataset.page.toLowerCase()) {
        page.classList.add("active");
        navigationLinks[index].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        page.classList.remove("active");
        navigationLinks[index].classList.remove("active");
      }
    });
  });
});

// Khởi tạo biến translations toàn cục
let translations = {};

// Hàm load translations từ file JSON
async function loadTranslations() {
  try {
    const response = await fetch('./assets/js/translations.json');
    if (!response.ok) throw new Error('Không thể tải file translations');
    translations = await response.json();
    
    // Áp dụng ngôn ngữ đã lưu hoặc mặc định
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    await changeLanguage(savedLanguage);
  } catch (error) {
    console.error('Lỗi khi tải translations:', error);
  }
}

// Hàm thay đổi ngôn ngữ
async function changeLanguage(lang) {
  try {
    if (!translations[lang]) {
      console.error('Không tìm thấy ngôn ngữ:', lang);
      return;
    }

    // Cập nhật navigation và lưu giá trị gốc
    document.querySelectorAll('[data-nav-link]').forEach(element => {
      const originalText = element.getAttribute('data-original-page') || element.textContent.trim().toLowerCase();
      if (!element.getAttribute('data-original-page')) {
        element.setAttribute('data-original-page', originalText);
      }
      const key = originalText;
      if (translations[lang].nav[key]) {
        element.textContent = translations[lang].nav[key];
      }
    });

    // Cập nhật trạng thái active cho nút
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      }
    });

    // Cập nhật tất cả các phần tử trong sidebar
    if (translations[lang].sidebar) {
      // Cập nhật tiêu đề
      const sidebarTitle = document.querySelector('.title');
      if (sidebarTitle) {
        sidebarTitle.textContent = translations[lang].sidebar.title;
      }

      // Cập nhật nút Show Contacts
      const showContactsBtn = document.querySelector('.info_more-btn span');
      if (showContactsBtn) {
        showContactsBtn.textContent = translations[lang].sidebar.showContacts;
      }

      // Cập nhật các tiêu đề liên hệ
      document.querySelectorAll('.contact-title').forEach(element => {
        const key = element.getAttribute('data-original-contact') || element.textContent.trim().toLowerCase();
        if (!element.getAttribute('data-original-contact')) {
          element.setAttribute('data-original-contact', key);
        }
        if (translations[lang].sidebar.contacts[key]) {
          element.textContent = translations[lang].sidebar.contacts[key];
        }
      });

      // Cập nhật địa chỉ và thông tin liên hệ khác
      const contactInfo = document.querySelectorAll('.contact-info');
      contactInfo.forEach(info => {
        const title = info.querySelector('.contact-title');
        if (title) {
          const key = title.textContent.toLowerCase();
          const value = info.querySelector('.contact-link, time, address');
          if (value && translations[lang].sidebar.contactValues && translations[lang].sidebar.contactValues[key]) {
            value.textContent = translations[lang].sidebar.contactValues[key];
          }
        }
      });
    }

    // Cập nhật about section
    const aboutTitle = document.querySelector('.article-title');
    if (aboutTitle && translations[lang].about.title) {
      aboutTitle.textContent = translations[lang].about.title;
    }

    const aboutText = document.querySelector('.about-text p:first-child');
    if (aboutText && translations[lang].about.description) {
      aboutText.textContent = translations[lang].about.description;
    }

    const aboutText2 = document.querySelector('.about-text p:last-child');
    if (aboutText2 && translations[lang].about.description2) {
      aboutText2.textContent = translations[lang].about.description2;
    }

    // Lưu ngôn ngữ đã chọn
    localStorage.setItem('selectedLanguage', lang);

    // Cập nhật tiêu đề "Things I'm Good At"
    const skillsSectionTitle = document.querySelector('.about .h3');
    if (skillsSectionTitle && translations[lang].about.skillsTitle) {
      skillsSectionTitle.textContent = translations[lang].about.skillsTitle;
    }

    // Cập nhật các kỹ năng
    const skillItems = document.querySelectorAll('.service-item');
    skillItems.forEach((item, index) => {
      const title = item.querySelector('.h4');
      const desc = item.querySelector('p');
      
      // Lưu trữ text gốc
      if (!item.getAttribute('data-original-skill')) {
        const originalTitle = title ? title.textContent.trim() : '';
        item.setAttribute('data-original-skill', originalTitle.toLowerCase());
      }
      
      const originalSkill = item.getAttribute('data-original-skill');
      let skillKey;
      
      // Map các kỹ năng với key trong translations
      switch(originalSkill.toLowerCase()) {
        case 'analytical thinking':
          skillKey = 'analyticalThinking';
          break;
        case 'research & information gathering':
          skillKey = 'researchInfo';
          break;
        case 'digital marketing basics':
          skillKey = 'digitalMarketing';
          break;
        case 'tool proficiency':
          skillKey = 'tools';
          break;
        case 'communication':
          skillKey = 'communication';
          break;
        case 'learning agility':
          skillKey = 'learning';
          break;
      }
      
      if (skillKey && translations[lang].about.skills[skillKey]) {
        if (title) {
          title.textContent = translations[lang].about.skills[skillKey].title;
        }
        if (desc) {
          desc.textContent = translations[lang].about.skills[skillKey].description;
        }
      }
    });

    if (translations[lang].about.skills) {
      // Analytical Thinking
      const analyticalTitle = document.querySelector('[data-testimonials-title="Analytical Thinking"]');
      const analyticalDesc = document.querySelector('[data-testimonials-text="Analytical Thinking"]');
      if (analyticalTitle && translations[lang].about.skills.analyticalThinking) {
        analyticalTitle.textContent = translations[lang].about.skills.analyticalThinking.title;
        analyticalDesc.textContent = translations[lang].about.skills.analyticalThinking.description;
      }

      // Digital Marketing
      const digitalTitle = document.querySelector('[data-testimonials-title="Digital Marketing Basics"]');
      const digitalDesc = document.querySelector('[data-testimonials-text="Digital Marketing Basics"]');
      if (digitalTitle && translations[lang].about.skills.digitalMarketing) {
        digitalTitle.textContent = translations[lang].about.skills.digitalMarketing.title;
        digitalDesc.textContent = translations[lang].about.skills.digitalMarketing.description;
      }

      // Tool Proficiency
      const toolTitle = document.querySelector('[data-testimonials-title="Tool Proficiency"]');
      const toolDesc = document.querySelector('[data-testimonials-text="Tool Proficiency"]');
      if (toolTitle && translations[lang].about.skills.tools) {
        toolTitle.textContent = translations[lang].about.skills.tools.title;
        toolDesc.textContent = translations[lang].about.skills.tools.description;
      }

      // Communication
      const commTitle = document.querySelector('[data-testimonials-title="Communication"]');
      const commDesc = document.querySelector('[data-testimonials-text="Communication"]');
      if (commTitle && translations[lang].about.skills.communication) {
        commTitle.textContent = translations[lang].about.skills.communication.title;
        commDesc.textContent = translations[lang].about.skills.communication.description;
      }

      // Learning Agility
      const learnTitle = document.querySelector('[data-testimonials-title="Learning Agility"]');
      const learnDesc = document.querySelector('[data-testimonials-text="Learning Agility"]');
      if (learnTitle && translations[lang].about.skills.learning) {
        learnTitle.textContent = translations[lang].about.skills.learning.title;
        learnDesc.textContent = translations[lang].about.skills.learning.description;
      }
    }

    // Cập nhật testimonials
    if (translations[lang].testimonials) {
      // Cập nhật tiêu đề section
      const testimonialsTitle = document.querySelector('.testimonials-title');
      if (testimonialsTitle) {
        testimonialsTitle.textContent = translations[lang].testimonials.title;
      }

      // Cập nhật các testimonial items
      const testimonialItems = document.querySelectorAll('.testimonials-item');
      testimonialItems.forEach((item, index) => {
        if (translations[lang].testimonials.items[index]) {
          const title = item.querySelector('.testimonials-item-title');
          const text = item.querySelector('.testimonials-text p');
          
          if (title) {
            title.textContent = translations[lang].testimonials.items[index].title;
          }
          if (text) {
            text.textContent = translations[lang].testimonials.items[index].text;
          }
        }
      });

      // Cập nhật modal testimonial
      const modalTitle = document.querySelector('.modal-title');
      const modalText = document.querySelector('.modal-text');
      
      document.querySelectorAll('.testimonials-item').forEach((item, index) => {
        item.addEventListener('click', () => {
          if (translations[lang].testimonials.items[index]) {
            modalTitle.textContent = translations[lang].testimonials.items[index].title;
            modalText.textContent = translations[lang].testimonials.items[index].text;
          }
        });
      });
    }

    // Sửa lỗi không thay đều tiêu đề sidebar
    const sidebarTitle = document.querySelector('.title');
    if (sidebarTitle && translations[lang].sidebar && translations[lang].sidebar.title) {
      sidebarTitle.textContent = translations[lang].sidebar.title;
    }

    // Log để debug
    console.log('Đã thay đổi ngôn ngữ thành:', lang);
    console.log('Translations loaded:', translations[lang]);

  } catch (error) {
    console.error('Lỗi khi thay đổi ngôn ngữ:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Load translations khi trang tải xong
  loadTranslations();

  // Thêm event listeners cho các nút ngôn ngữ
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (lang) {
        changeLanguage(lang);
      }
    });
  });
});

// Cập nhật Tools I Use section
const toolsTitle = document.querySelector('.clients-title');
if (toolsTitle && translations[lang].toolsSection) {
toolsTitle.textContent = translations[lang].toolsSection.title;
}
