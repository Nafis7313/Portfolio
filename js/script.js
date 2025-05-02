document.addEventListener('DOMContentLoaded', function() {
    // Initialize the site
    updateCurrentYear();
    populatePortfolio();
    populateEducation();
    populateExperience();
    populateSkills();
    populateContactInfo();
    populateSocialIcons();
    
    // Setup event listeners
    setupMobileMenu();
    setupScrollingHeader();
    setupFilterButtons();
    setupScrollToTop();
    setupContactForm();
});

// Update Current Year in Footer
function updateCurrentYear() {
    document.getElementById('current-year').textContent = new Date().getFullYear();
}

// Mobile Menu Toggle
function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileNav.classList.toggle('show');
    });
    
    // Close mobile menu when clicking a navigation link
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('show');
        });
    });
}

// Add header background on scroll
function setupScrollingHeader() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Populate Portfolio Grid
function populatePortfolio() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    
    portfolioProjects.forEach(project => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = `portfolio-item ${project.category}`;
        portfolioItem.setAttribute('data-id', project.id);
        
        portfolioItem.innerHTML = `
            <img src="${project.thumbnail}" alt="${project.title}">
            <div class="portfolio-item-overlay">
                <div class="portfolio-item-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                </div>
            </div>
        `;
        
        portfolioItem.addEventListener('click', function() {
            openProjectModal(project);
        });
        
        portfolioGrid.appendChild(portfolioItem);
    });
}

// Setup Portfolio Filter Buttons
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Open Project Modal
function openProjectModal(project) {
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalImage = document.getElementById('modal-image');
    const modalClient = document.getElementById('modal-client');
    const modalTimeline = document.getElementById('modal-timeline');
    const modalServices = document.getElementById('modal-services');
    const modalOverview = document.getElementById('modal-overview');
    const modalProcess = document.getElementById('modal-process');
    
    // Set modal content
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    modalImage.src = project.thumbnail;
    modalImage.alt = project.title;
    modalClient.textContent = project.client;
    modalTimeline.textContent = project.timeline;
    modalServices.textContent = project.services.join(', ');
    
    // Set overview paragraphs
    modalOverview.innerHTML = '';
    project.overview.forEach(paragraph => {
        const p = document.createElement('p');
        p.textContent = paragraph;
        modalOverview.appendChild(p);
    });
    
    // Set process paragraphs
    modalProcess.innerHTML = '';
    project.process.forEach(paragraph => {
        const p = document.createElement('p');
        p.textContent = paragraph;
        modalProcess.appendChild(p);
    });
    
    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Close modal when clicking close button
    const closeButton = document.getElementById('modal-close');
    closeButton.addEventListener('click', closeProjectModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeProjectModal();
        }
    });
}

// Close Project Modal
function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    
    modal.classList.remove('show');
    document.body.style.overflow = '';
    
    // Remove event listeners to prevent duplicates
    const closeButton = document.getElementById('modal-close');
    closeButton.removeEventListener('click', closeProjectModal);
    modal.removeEventListener('click', closeProjectModal);
}

// Populate Education List
function populateEducation() {
    const educationList = document.getElementById('education-list');
    
    educationData.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <i class="fas fa-${item.icon}"></i>
            <div>
                <p class="font-medium">${item.degree}</p>
                <p>${item.institution}</p>
            </div>
        `;
        educationList.appendChild(li);
    });
}

// Populate Experience List
function populateExperience() {
    const experienceList = document.getElementById('experience-list');
    
    experienceData.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <i class="fas fa-${item.icon}"></i>
            <div>
                <p class="font-medium">${item.position}</p>
                <p>${item.company}, ${item.period}</p>
            </div>
        `;
        experienceList.appendChild(li);
    });
}

// Populate Skills
function populateSkills() {
    const designSkillsContainer = document.getElementById('design-skills');
    const creativeSkillsContainer = document.getElementById('creative-skills');
    
    // Populate design skills
    designSkills.forEach((skill, index) => {
        const skillBar = createSkillBar(skill, index);
        designSkillsContainer.appendChild(skillBar);
    });
    
    // Populate creative skills
    creativeSkills.forEach((skill, index) => {
        const skillBar = createSkillBar(skill, index);
        creativeSkillsContainer.appendChild(skillBar);
    });
    
    // Initialize skill bar animations on scroll
    initSkillBarAnimations();
}

// Create Skill Bar
function createSkillBar(skill, index) {
    const skillBar = document.createElement('div');
    skillBar.className = 'skill-bar';
    skillBar.setAttribute('data-percentage', skill.percentage);
    skillBar.innerHTML = `
        <div class="skill-info">
            <span>${skill.name}</span>
            <span>${skill.percentage}%</span>
        </div>
        <div class="skill-progress">
            <div class="skill-progress-bar" data-delay="${index * 200}"></div>
        </div>
    `;
    
    return skillBar;
}

// Initialize Skill Bar Animations
function initSkillBarAnimations() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    // Function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // Function to animate skill bars
    function animateSkillBars() {
        skillBars.forEach(bar => {
            if (isElementInViewport(bar) && !bar.classList.contains('animated')) {
                bar.classList.add('animated');
                const percentage = bar.getAttribute('data-percentage');
                const progressBar = bar.querySelector('.skill-progress-bar');
                const delay = progressBar.getAttribute('data-delay');
                
                setTimeout(() => {
                    progressBar.style.width = `${percentage}%`;
                }, delay);
            }
        });
    }
    
    // Animate skill bars on page load
    animateSkillBars();
    
    // Animate skill bars on scroll
    window.addEventListener('scroll', animateSkillBars);
}

// Populate Contact Info
function populateContactInfo() {
    document.getElementById('contact-email').textContent = contactInfo.email;
    document.getElementById('contact-phone').textContent = contactInfo.phone;
    document.getElementById('contact-location').textContent = contactInfo.location;
}

// Populate Social Icons
function populateSocialIcons() {
    const socialIconsContainer = document.getElementById('social-icons');
    
    socialLinks.forEach(link => {
        const socialLink = document.createElement('a');
        socialLink.href = link.url;
        socialLink.target = '_blank';
        socialLink.rel = 'noopener noreferrer';
        socialLink.innerHTML = `<i class="fab fa-${link.icon}"></i>`;
        
        socialIconsContainer.appendChild(socialLink);
    });
}

// Scroll to Top Button
function setupScrollToTop() {
    const scrollButton = document.getElementById('scroll-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('show');
        } else {
            scrollButton.classList.remove('show');
        }
    });
    
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupContactForm();
});

function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return; // Stop if validation fails
        }
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Submit form data to FormSubmit
        const formData = new FormData(contactForm);
        
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                contactForm.reset();
                showToast('Message sent! Thank you for your message. I\'ll get back to you soon.', 'success');
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            showToast('Message sent! Thank you for your message. I\'ll get back to you soon.', 'success');
            console.error('Error:', error);
        })
        .finally(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
    });
}

// Form validation
function validateForm() {
    resetFormErrors();
    let isValid = true;
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    
    if (nameInput.value.trim().length < 2) {
        showError(nameInput, 'Name must be at least 2 characters');
        isValid = false;
    }
    
    if (!isValidEmail(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email');
        isValid = false;
    }
    
    if (subjectInput.value.trim().length < 2) {
        showError(subjectInput, 'Subject is required');
        isValid = false;
    }
    
    if (messageInput.value.trim().length < 10) {
        showError(messageInput, 'Message must be at least 10 characters');
        isValid = false;
    }
    
    return isValid;
}

// Helper functions
function resetFormErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
}

function showError(input, message) {
    const errorElement = document.getElementById(`${input.id}-error`);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Show error message for form field
function showError(input, message) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    
    formGroup.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

// Reset all form errors
function resetFormErrors() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        group.classList.remove('error');
        const errorElement = group.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    });
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    toastMessage.textContent = message;
    toast.className = 'toast show ' + type;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

// Smooth scrolling for navigation links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        
        if (targetId === '#' || targetId === '#!') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
});



// Enhanced Loader Functionality
document.addEventListener('DOMContentLoaded', function() {
    const loader = document.getElementById('loader');
    const percentage = document.getElementById('loader-percentage');
    const progressBar = document.getElementById('progress-bar');
    
    // Simulate loading progress
    let progress = 0;
    const progressInterval = setInterval(updateProgress, 30);
    
    function updateProgress() {
        // Increment progress randomly for natural feel
        progress += Math.random() * 3;
        
        // Cap at 100%
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            percentage.textContent = "100%";
            progressBar.style.width = "100%";
            
            // Add slight delay before hiding
            setTimeout(function() {
                loader.classList.add('hidden');
                setTimeout(function() {
                    loader.style.display = 'none';
                }, 800);
            }, 500);
            return;
        }
        
        // Update display
        percentage.textContent = Math.floor(progress) + "%";
        progressBar.style.width = progress + "%";
    }
    
    // Fallback in case something goes wrong
    setTimeout(function() {
        if (progress < 100) {
            clearInterval(progressInterval);
            percentage.textContent = "100%";
            progressBar.style.width = "100%";
            loader.classList.add('hidden');
            setTimeout(function() {
                loader.style.display = 'none';
            }, 800);
        }
    }, 4000);
});