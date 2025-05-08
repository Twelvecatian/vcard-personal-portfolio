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

// Khai báo biến translations ở phạm vi toàn cục
let translations;

// Tải file translations.json
async function loadTranslations() {
  try {
    const response = await fetch('./assets/js/translations.json');
    translations = await response.json();
    
    // Khởi tạo ngôn ngữ mặc định hoặc lấy từ localStorage
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    await changeLanguage(savedLang);
  } catch (error) {
    console.error('Lỗi khi tải file translations:', error);
  }
}

// Gọi hàm loadTranslations khi trang web tải xong
document.addEventListener('DOMContentLoaded', loadTranslations);

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

    // Cập nhật Resume section
    if (translations[lang].resume) {
      try {
        // Cập nhật tiêu đề chính Resume
        const resumeTitle = document.querySelector('.article-title[data-resume]');
        if (resumeTitle) {
          resumeTitle.textContent = translations[lang].resume.title;
        }
    
        // Cập nhật tiêu đề Education
        const educationTitle = document.querySelector('.h3[data-education]');
        if (educationTitle) {
          educationTitle.textContent = translations[lang].resume.education.title;
        }
    
        // Cập nhật thông tin học vấn
        const educationItem = document.querySelector('.timeline-item');
        if (educationItem && translations[lang].resume.education.item1) {
          const degree = educationItem.querySelector('.h4.timeline-item-title');
          const school = educationItem.querySelector('em');
          const description = educationItem.querySelector('.timeline-text');
          
          if (degree) degree.textContent = translations[lang].resume.education.item1.title;
          if (school) school.textContent = translations[lang].resume.education.item1.school;
          if (description) description.textContent = translations[lang].resume.education.item1.description;
        }
    
        // Cập nhật tiêu đề Experience
        const experienceTitle = document.querySelector('.h3[data-experience]');
        if (experienceTitle) {
          experienceTitle.textContent = translations[lang].resume.experience.title;
        }
    
        // Cập nhật thông tin kinh nghiệm
        const experienceItems = document.querySelectorAll('.timeline-item');
        if (experienceItems[1] && translations[lang].resume.experience.item1) {
          const title1 = experienceItems[1].querySelector('.h4.timeline-item-title');
          const company1 = experienceItems[1].querySelector('em');
          const description1 = experienceItems[1].querySelector('.timeline-text');
          
          if (title1) title1.textContent = translations[lang].resume.experience.item1.title;
          if (company1) company1.textContent = translations[lang].resume.experience.item1.company;
          if (description1) description1.textContent = translations[lang].resume.experience.item1.description;
        }
        
        if (experienceItems[2] && translations[lang].resume.experience.item2) {
          const title2 = experienceItems[2].querySelector('.h4.timeline-item-title');
          const company2 = experienceItems[2].querySelector('em');
          const description2 = experienceItems[2].querySelector('.timeline-text');
          
          if (title2) title2.textContent = translations[lang].resume.experience.item2.title;
          if (company2) company2.textContent = translations[lang].resume.experience.item2.company;
          if (description2) description2.textContent = translations[lang].resume.experience.item2.description;
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật Resume section:', error);
      }
    }
    
    // Cập nhật Blog section
    if (translations[lang].blog) {
      try {
        // Cập nhật tiêu đề chính Blog
        const blogTitle = document.querySelector('.article-title[data-translate="blog.title"]');
        if (blogTitle) {
          blogTitle.textContent = translations[lang].blog.title;
        }
    
        // Cập nhật các bài viết blog
        const blogPosts = document.querySelectorAll('.blog-post-item');
        blogPosts.forEach((post, index) => {
          const postNumber = index + 1;
          const postData = translations[lang].blog[`post${postNumber}`];
          
          if (postData) {
            // Cập nhật category
            const category = post.querySelector('.blog-category[data-translate="blog.post' + postNumber + '.category"]');
            if (category) {
              category.textContent = postData.category;
            }
    
            // Cập nhật title
            const title = post.querySelector('.blog-item-title[data-translate="blog.post' + postNumber + '.title"]');
            if (title) {
              title.textContent = postData.title;
            }
    
            // Cập nhật description
            const description = post.querySelector('.blog-text[data-translate="blog.post' + postNumber + '.description"]');
            if (description) {
              description.textContent = postData.description;
            }
          }
        });
    
      } catch (error) {
        console.error('Lỗi khi cập nhật Blog section:', error);
      }
    }
    // Cập nhật phần Contact
    const contactTitle = document.querySelector('.contact .article-title');
    if (contactTitle && translations[lang].contact.title) {
      contactTitle.textContent = translations[lang].contact.title;
    }

    // Cập nhật form contact
    const formTitle = document.querySelector('.form-title');
    if (formTitle && translations[lang].contact.form.title) {
      formTitle.textContent = translations[lang].contact.form.title;
    }

    // Cập nhật placeholders cho các input
    const fullNameInput = document.querySelector('input[name="fullname"]');
    if (fullNameInput && translations[lang].contact.form.fullname) {
      fullNameInput.placeholder = translations[lang].contact.form.fullname.placeholder;
    }

    const emailInput = document.querySelector('input[name="email"]');
    if (emailInput && translations[lang].contact.form.email) {
      emailInput.placeholder = translations[lang].contact.form.email.placeholder;
    }

    const messageInput = document.querySelector('textarea[name="message"]');
    if (messageInput && translations[lang].contact.form.message) {
      messageInput.placeholder = translations[lang].contact.form.message.placeholder;
    }

    const submitButton = document.querySelector('[data-form-btn]');
    if (submitButton && translations[lang].contact.form.submit) {
      submitButton.textContent = translations[lang].contact.form.submit;
    }
  } catch (error) {
    console.error('Lỗi khi thay đổi ngôn ngữ:', error);
  }
}

// Thêm event listener cho form submit
form.addEventListener("submit", async function(e) {
  e.preventDefault();
  
  // Lấy giá trị từ các input
  const formData = {
    fullname: document.querySelector('[data-form-input][name="fullname"]').value,
    email: document.querySelector('[data-form-input][name="email"]').value,
    message: document.querySelector('[data-form-input][name="message"]').value
  };

  try {
    // Hiển thị thông báo gửi thành công
    formBtn.textContent = "Sending...";
    
    // Giả lập gửi form (thay thế bằng API thực tế sau này)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reset form
    form.reset();
    formBtn.setAttribute("disabled", "");
    formBtn.textContent = "Send Message";
    
    // Hiển thị thông báo thành công
    alert("Message sent successfully!");

  } catch (error) {
    console.error("Error sending message:", error);
    alert("Failed to send message. Please try again.");
    formBtn.textContent = "Send Message";
  }
});