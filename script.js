// 스크롤 시 사이드 네비게이션 활성화
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.side-nav-list a');

function updateActiveNav() {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop - 200) {
            current = sectionId;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// 부드러운 스크롤
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// 스크롤 애니메이션
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// 페이지 로드 시 애니메이션 적용
document.addEventListener('DOMContentLoaded', () => {
    // 인트로 섹션 애니메이션
    const introContent = document.querySelector('.intro-content');
    if (introContent) {
        introContent.style.opacity = '0';
        introContent.style.transform = 'translateY(20px)';
        introContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            introContent.style.opacity = '1';
            introContent.style.transform = 'translateY(0)';
        }, 100);
    }

    // 섹션 콘텐츠 애니메이션
    const sectionContents = document.querySelectorAll('.section-content, .intro-content');
    sectionContents.forEach((content, index) => {
        content.classList.add('fade-in');
        setTimeout(() => {
            observer.observe(content);
        }, index * 100);
    });

    // 타임라인 아이템 애니메이션
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            observer.observe(item);
        }, 200 * index);
    });

    observer.observe = new Proxy(observer.observe, {
        apply: function(target, thisArg, argumentsList) {
            const element = argumentsList[0];
            if (element.classList.contains('fade-in')) {
                element.addEventListener('transitionend', function() {
                    if (element.classList.contains('visible')) {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }
                }, { once: true });
            }
            return target.apply(thisArg, argumentsList);
        }
    });
});

// 타임라인 아이템 개별 관찰
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.timeline-item').forEach(item => {
    timelineObserver.observe(item);
});

// CTA 버튼 호버 효과
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
    });
    
    ctaButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
}

// 페이지 로드 시 초기 활성화
window.addEventListener('load', () => {
    updateActiveNav();
});

// 리사이즈 시 레이아웃 조정
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        updateActiveNav();
    }, 250);
});
