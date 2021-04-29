export default class NavbarHider {
    hideNavbarAndAddShowOnOverListener() {
        const nav = document.getElementById('navbar');
        nav.classList.add('hidden-navbar');
        nav.classList.add('absolute-navbar');
        const navIcon = document.getElementById('nav-open');
        navIcon.classList.remove('hidden-nav-open');
        navIcon.addEventListener('mouseover', this.openNavbarListener);
        nav.addEventListener('mouseleave', this.hideNavbarListener);
    }
    showNavbarAndRemoveShowOnOverListener() {
        const nav = document.getElementById('navbar');
        nav.classList.remove('hidden-navbar');
        nav.classList.remove('absolute-navbar');
        const navIcon = document.getElementById('nav-open');
        navIcon.removeEventListener('mouseover', this.openNavbarListener);
        navIcon.classList.add('hidden-nav-open');
        nav.removeEventListener('mouseleave', this.hideNavbarListener);
    }
    openNavbarListener() {
        const nav = document.getElementById('navbar');
        nav.classList.remove('hidden-navbar');
    }

    hideNavbarListener() {
        const nav = document.getElementById('navbar');
        nav.classList.add('hidden-navbar');
        const navIcon = document.getElementById('nav-open');
        navIcon.classList.remove('hidden-nav-open');
    }
}
