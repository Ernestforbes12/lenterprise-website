document.addEventListener('DOMContentLoaded', function() {
    // Loading Screen
    const loader = document.getElementById('loader');
    const header = document.querySelector('.header');
    const main = document.querySelector('main');
    const hero = document.querySelector('.hero'); // Get the hero section
    const pageTransitionOverlay = document.querySelector('.page-transition-overlay');
    const navLinks = document.querySelectorAll('.nav-menu li a');
    const footer = document.getElementById('main-footer');
    const mapContainer = document.getElementById('map-container');

    window.addEventListener('load', () => {
        gsap.to(loader, { opacity: 0, duration: 0.5, display: 'none' });
        header.style.display = 'none';
        main.style.display = 'none';
        if (footer) {
            footer.style.display = 'none';
            footer.style.opacity = 0;
        }
        if (mapContainer) {
            mapContainer.style.display = 'block';
            mapContainer.style.position = 'fixed';
            mapContainer.style.top = '0';
            mapContainer.style.left = '0';
            mapContainer.style.width = '100%';
            mapContainer.style.height = '100%';
            mapContainer.style.zIndex = '999';
        }
        gsap.to([header, main], { opacity: 0, duration: 0.5 });

        // Set initial padding for hero
        if (header && hero) {
            const headerHeight = header.offsetHeight;
            hero.style.paddingTop = `${headerHeight}px`;
        }
    });

    const mapCanvas = document.getElementById('map-canvas');
    const clickText = document.getElementById('click-text');
    const introAnimation = document.querySelector('.intro-animation');
    const introLogo = document.querySelector('.intro-animation_logo');
    const introSvg = document.querySelector('.intro-animation_svg rect');
    const minimizeSvg = document.querySelector('.intro-animation_minimize rect');
    const textElements = document.querySelectorAll('.intro-animation .text > *');
    const navBar = document.querySelector('.nav-bar');

    let map;
    let isScrolling = false;

    function initMap() {
        // ... (rest of your initMap function) ...
    }

    function startAnimation() {
        clickText.style.display = 'none';
        header.style.display = 'none';
        if (footer) {
            footer.style.display = 'none';
        }
        if (mapContainer) {
            mapContainer.style.display = 'block';
        }

        introAnimation.style.display = 'flex';
        introAnimation.style.visibility = 'visible';
        gsap.to(introAnimation, { duration: 0.5, opacity: 1 });
        gsap.to(introLogo, { duration: 0.5, opacity: 1, delay: 0.2 });
        gsap.to(introSvg, {
            duration: 0.7,
            width: '100%',
            delay: 0.5,
            ease: 'power2.inOut',
            onComplete: () => {
                gsap.to(minimizeSvg, {
                    duration: 0.5,
                    width: '100%',
                    delay: 0,
                    ease: 'power2.inOut',
                });
            }
        });

        textElements.forEach((element, index) => {
            gsap.to(element, { duration: 0.5, opacity: 1, delay: 0.7 + index * 0.1 });
        });

        setTimeout(() => {
            gsap.to(introAnimation, {
                duration: 0.5,
                scale: 0.8,
                opacity: 0,
                onComplete: () => {
                    introAnimation.style.display = 'none';
                    if (mapContainer) {
                        mapContainer.style.position = 'relative';
                        mapContainer.style.top = 'auto';
                        mapContainer.style.left = 'auto';
                        mapContainer.style.width = '100%';
                        mapContainer.style.height = '500px';
                        mapContainer.style.zIndex = 'auto';
                        mapContainer.style.display = 'none'; // Hide map after animation
                    }
                    header.style.display = 'block';
                    main.style.display = 'block';
                    gsap.to([header, main], { duration: 0.5, opacity: 1 });

                    if (footer) {
                        footer.style.display = 'block';
                        gsap.to(footer, { duration: 0.5, opacity: 1 });
                    }

                    pageTransitionOverlay.style.display = 'block';
                    gsap.to(pageTransitionOverlay, {
                        duration: 0.3,
                        opacity: 1,
                        onComplete: () => {
                            gsap.to(pageTransitionOverlay, {
                                duration: 0.3,
                                opacity: 0,
                                delay: 0.3,
                                onComplete: () => {
                                    pageTransitionOverlay.style.display = 'none';
                                }
                            });
                        }
                    });

                    // Sets padding after animation as well
                    if (header && hero) {
                        const headerHeight = header.offsetHeight;
                        hero.style.paddingTop = `${headerHeight}px`;
                    }
                }
            });
        }, 3000);
    }

    initMap();
    clickText.addEventListener('click', startAnimation);

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            isScrolling = true;
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            setTimeout(() => {
                isScrolling = false;
            }, 100);
        }
    });

    // Adjust padding on resize (for responsiveness)
    window.addEventListener('resize', () => {
        if (header && hero) {
            const headerHeight = header.offsetHeight;
            hero.style.paddingTop = `${headerHeight}px`;
        }
    });

    // Search-Bar Functionality 
    const searchButton = document.querySelector('.header .search-bar button');
    const searchInput = document.querySelector('.header .search-bar input');

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });

        function performSearch() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                window.open('https://www.google.com/search?q=site:yourdomain.com+' + encodeURIComponent(searchTerm), '_blank');
                // **IMPORTANT:** Replace 'yourdomain.com' with your actual website's domain!
            } else {
                alert('Please enter a search term.');
            }
        }
    }
});